import * as QuotationService from "../services/quotation.service.js";
import { sendQuotationEmail } from "../helpers/QuotationEmailHelper.js"; // Modifica la ruta según tu arquitectura
// ─── Helpers ──────────────────────────────────────────────────────────────────

function sendError(res, err) {
  const status = err.status ?? 500;
  const message = status === 500 ? "Error interno del servidor." : err.message;
  if (status === 500) console.error(err);
  return res.status(status).json({ ok: false, message });
}

// ─── Público ──────────────────────────────────────────────────────────────────

export async function createQuotation(req, res) {
  try {
    const quotation = await QuotationService.createQuotation(req.body);
    return res.status(201).json({
      ok: true,
      message:
        "Cotización recibida. En breve nos pondremos en contacto contigo.",
      data: { quoteNumber: quotation.quoteNumber },
    });
  } catch (err) {
    return sendError(res, err);
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getQuotations(req, res) {
  try {
    const { status, search, page, limit } = req.query;
    const result = await QuotationService.getQuotations({
      status,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
    return res.json({ ok: true, ...result });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getQuotationById(req, res) {
  try {
    const quotation = await QuotationService.getQuotationById(req.params.id);
    return res.json({ ok: true, data: quotation });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function updateQuotationStatus(req, res) {
  try {
    const { status, totalPrice, expiresAt } = req.body;

    // 1. Actualiza el registro en la base de datos
    const quotation = await QuotationService.updateQuotationStatus(
      req.params.id,
      status,
      { totalPrice, expiresAt }
    );

    // 2. Si el estatus pasa a ser "sent" (Enviada), detonamos el correo con Resend
    if (status === "sent") {
      // Disparamos el proceso en segundo plano para no demorar la respuesta de la API hacia el Admin
      sendQuotationEmail(quotation).catch((mailErr) => {
        console.error("Error asíncrono enviando el correo:", mailErr);
      });
    }

    // 3. Retorna la respuesta inmediata al panel administrativo
    return res.json({ ok: true, data: quotation });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function promoteToCustomer(req, res) {
  try {
    const customer = await QuotationService.promoteToCustomer(
      req.params.id,
      req.user.id // viene del middleware de auth
    );
    return res.status(201).json({ ok: true, data: customer });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function convertToOrder(req, res) {
  try {
    const order = await QuotationService.convertToOrder(req.params.id);
    return res.status(201).json({ ok: true, data: order });
  } catch (err) {
    return sendError(res, err);
  }
}
