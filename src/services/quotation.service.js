const { Op } = require("sequelize");
const {
  Quotation,
  UnitType,
  Customer,
  Order,
  sequelize,
} = require("../models");
const {
  generateQuoteNumber,
  generateOrderNumber,
} = require("../helpers/folio.helper.js");

// ─── Crear cotización (endpoint público) ─────────────────────────────────────

async function createQuotation(data) {
  const quoteNumber = await generateQuoteNumber();

  const quotation = await Quotation.create({
    quoteNumber,
    tripType: data.tripType,
    contractorName: data.contractorName,
    contractorPhone: data.contractorPhone,
    contractorEmail: data.contractorEmail,
    origin: data.origin,
    destination: data.destination,
    unitTypeId: data.unitTypeId,
    departureAt: data.departureAt,
    returnAt: data.returnAt ?? null,
    description: data.description ?? null,
    status: "pending",
    source: data.source ?? "web_form",
  });

  return quotation;
}

// ─── Listar cotizaciones (admin) ──────────────────────────────────────────────

async function getQuotations({ status, search, page = 1, limit = 20 } = {}) {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      { contractorName: { [Op.like]: `%${search}%` } },
      { contractorEmail: { [Op.like]: `%${search}%` } },
      { quoteNumber: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Quotation.findAndCountAll({
    where,
    include: [{ model: UnitType, as: "unitType", attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
}

// ─── Obtener una cotización ───────────────────────────────────────────────────

async function getQuotationById(id) {
  const quotation = await Quotation.findByPk(id, {
    include: [
      { model: UnitType, as: "unitType" },
      { model: Order, as: "order" },
      { model: Customer, as: "customer" },
    ],
  });

  if (!quotation) {
    const err = new Error("Cotización no encontrada.");
    err.status = 404;
    throw err;
  }

  return quotation;
}

// ─── Actualizar status (admin) ────────────────────────────────────────────────

const VALID_TRANSITIONS = {
  pending: ["sent", "spam", "rejected"],
  sent: ["accepted", "rejected", "expired"],
  accepted: ["rejected"],
  rejected: [],
  expired: [],
  spam: [],
};

async function updateQuotationStatus(id, newStatus, extra = {}) {
  const quotation = await getQuotationById(id);

  const allowed = VALID_TRANSITIONS[quotation.status] ?? [];

  if (!allowed.includes(newStatus)) {
    const err = new Error(
      `No se puede cambiar de '${quotation.status}' a '${newStatus}'.`
    );
    err.status = 422;
    throw err;
  }

  if (extra.totalPrice) quotation.totalPrice = extra.totalPrice;
  if (extra.expiresAt) quotation.expiresAt = extra.expiresAt;

  quotation.status = newStatus;
  await quotation.save();

  return quotation;
}

// ─── Promover a cliente (admin) ───────────────────────────────────────────────

async function promoteToCustomer(quotationId, adminId) {
  const quotation = await getQuotationById(quotationId);

  if (quotation.status !== "accepted") {
    const err = new Error("Solo se pueden promover cotizaciones aceptadas.");
    err.status = 422;
    throw err;
  }

  if (quotation.customer) {
    const err = new Error("Esta cotización ya tiene un cliente asociado.");
    err.status = 409;
    throw err;
  }

  const customer = await Customer.create({
    name: quotation.contractorName,
    phone: quotation.contractorPhone,
    email: quotation.contractorEmail,
    quotationId: quotation.id,
    createdBy: adminId,
  });

  return customer;
}

// ─── Convertir a orden (admin) ────────────────────────────────────────────────

async function convertToOrder(quotationId) {
  const quotation = await getQuotationById(quotationId);

  if (quotation.status !== "accepted") {
    const err = new Error("Solo se pueden convertir cotizaciones aceptadas.");
    err.status = 422;
    throw err;
  }

  if (quotation.order) {
    const err = new Error("Esta cotización ya tiene una orden generada.");
    err.status = 409;
    throw err;
  }

  const order = await sequelize.transaction(async (t) => {
    const orderNumber = await generateOrderNumber();

    const newOrder = await Order.create(
      {
        orderNumber,
        quotationId: quotation.id,
        status: "confirmed",
        confirmedAt: new Date(),
      },
      { transaction: t }
    );

    return newOrder;
  });

  return order;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotationStatus,
  promoteToCustomer,
  convertToOrder,
};
