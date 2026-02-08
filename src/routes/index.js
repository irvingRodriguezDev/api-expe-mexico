const express = require("express");
const router = express.Router();
const AuthRoutes = require("./AuthRoutes");
const healthController = require("../controllers/health.controller");

router.get("/health", healthController.check);
router.use("/auth", AuthRoutes);

module.exports = router;
