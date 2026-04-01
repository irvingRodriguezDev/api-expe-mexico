const express = require("express");
const router = express.Router();
const AuthRoutes = require("./AuthRoutes");
const healthController = require("../controllers/health.controller");
const TourRoutes = require("./TourRoutes");
const QuotationRoutes = require("./QuotationRoutes");
const UnitTypesCategoryRoutes = require("./UnitTypeCategoryRoutes");
const UnitTypesRoutes = require("./UnitTypeRoutes");

router.get("/health", healthController.check);
router.use("/auth", AuthRoutes);
router.use("/tours", TourRoutes);
router.use("/quotation", QuotationRoutes);
router.use("/unit-type-categories", UnitTypesCategoryRoutes);
router.use("/unit-types", UnitTypesRoutes);

module.exports = router;
