const { Op } = require("sequelize");
const { Quotation, Order } = require("../models");

const PAD = 4;

async function getDailySequence(model, field, prefix) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const count = await model.count({
    where: {
      [field]: { [Op.like]: `${prefix}%` },
      createdAt: { [Op.between]: [startOfDay, endOfDay] },
    },
  });

  return String(count + 1).padStart(PAD, "0");
}

function getDateStamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

async function generateQuoteNumber() {
  const date = getDateStamp();
  const prefix = `QT-${date}-`;
  const seq = await getDailySequence(Quotation, "quoteNumber", prefix);
  return `${prefix}${seq}`;
}

async function generateOrderNumber() {
  const date = getDateStamp();
  const prefix = `ORD-${date}-`;
  const seq = await getDailySequence(Order, "orderNumber", prefix);
  return `${prefix}${seq}`;
}

module.exports = {
  generateQuoteNumber,
  generateOrderNumber,
};
