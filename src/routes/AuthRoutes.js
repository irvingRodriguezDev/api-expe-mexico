const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

router.post("/login", authController.login);
router.post("/update-password", authController.updatePassword);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
