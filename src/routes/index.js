const express = require("express");
const router = express.Router();
const AuthRoutes = require("./AuthRoutes");
const healthController = require("../controllers/health.controller");
const TourRoutes = require("./TourRoutes");
router.get("/health", healthController.check);
router.use("/auth", AuthRoutes);
router.use("/tours", TourRoutes);

module.exports = router;
