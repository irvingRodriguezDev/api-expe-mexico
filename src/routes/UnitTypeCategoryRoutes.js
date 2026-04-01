const { Router } = require("express");
const UnitTypeCategoryController = require("../controllers/unitTypeCategory.controller.js");
const authMiddleware = require("../middlewares/auth.middlewares.js");

const router = Router();

// Todo requiere auth — las categorías solo las gestiona el admin
router.get("/", authMiddleware, UnitTypeCategoryController.getCategories);
router.post("/", authMiddleware, UnitTypeCategoryController.createCategory);
router.get("/:id", authMiddleware, UnitTypeCategoryController.getCategoryById);
router.put("/:id", authMiddleware, UnitTypeCategoryController.updateCategory);
router.delete(
  "/:id",
  authMiddleware,
  UnitTypeCategoryController.deleteCategory
);

module.exports = router;
