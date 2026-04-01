const { Router } = require("express");
const UnitTypeController = require("../controllers/unitType.controller.js");
const authMiddleware = require("../middlewares/auth.middlewares.js");

const router = Router();

// Público
router.get("/grouped", UnitTypeController.getUnitTypesGrouped); // para el formulario
router.get("/", UnitTypeController.getUnitTypes); // para el admin

// Admin
router.post("/", authMiddleware, UnitTypeController.createUnitType);
router.get("/:id", authMiddleware, UnitTypeController.getUnitTypeById);
router.put("/:id", authMiddleware, UnitTypeController.updateUnitType);
router.delete("/:id", authMiddleware, UnitTypeController.deleteUnitType);

module.exports = router;
