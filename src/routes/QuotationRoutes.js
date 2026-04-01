const { Router } = require("express");
const QuotationController = require("../controllers/quotation.controller.js");
const authMiddleware = require("../middlewares/auth.middlewares.js");
const { rateLimiter } = require("../middlewares/rateLimiter.middleware.js");
const { honeypot } = require("../middlewares/honeypot.middleware.js");
const {
  validateQuotation,
} = require("../middlewares/validateQuotation.middleware.js");

const router = Router();

// ─── Público ──────────────────────────────────────────────────────────────────
router.post(
  "/",
  rateLimiter,
  honeypot,
  validateQuotation,
  QuotationController.createQuotation
);

// ─── Admin (requiere auth) ────────────────────────────────────────────────────
router.get("/", authMiddleware, QuotationController.getQuotations);
router.get("/:id", authMiddleware, QuotationController.getQuotationById);
router.patch(
  "/:id/status",
  authMiddleware,
  QuotationController.updateQuotationStatus
);
router.post(
  "/:id/promote-to-customer",
  authMiddleware,
  QuotationController.promoteToCustomer
);
router.post(
  "/:id/convert-to-order",
  authMiddleware,
  QuotationController.convertToOrder
);

module.exports = router;
