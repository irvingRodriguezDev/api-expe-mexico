const UnitTypeCategoryService = require("../services/unitTypeCategory.service.js");

function sendError(res, err) {
  const status = err.status ?? 500;
  const message = status === 500 ? "Error interno del servidor." : err.message;
  if (status === 500) console.error(err);
  return res.status(status).json({ ok: false, message });
}

async function createCategory(req, res) {
  try {
    const category = await UnitTypeCategoryService.createCategory(req.body);
    return res.status(201).json({ ok: true, data: category });
  } catch (err) {
    return sendError(res, err);
  }
}

async function getCategories(req, res) {
  try {
    const onlyActive = req.query.onlyActive === "true";
    const categories = await UnitTypeCategoryService.getCategories({
      onlyActive,
    });
    return res.json({ ok: true, data: categories });
  } catch (err) {
    return sendError(res, err);
  }
}

async function getCategoryById(req, res) {
  try {
    const category = await UnitTypeCategoryService.getCategoryById(
      req.params.id
    );
    return res.json({ ok: true, data: category });
  } catch (err) {
    return sendError(res, err);
  }
}

async function updateCategory(req, res) {
  try {
    const category = await UnitTypeCategoryService.updateCategory(
      req.params.id,
      req.body
    );
    return res.json({ ok: true, data: category });
  } catch (err) {
    return sendError(res, err);
  }
}

async function deleteCategory(req, res) {
  try {
    await UnitTypeCategoryService.deleteCategory(req.params.id);
    return res.json({ ok: true, message: "Categoría eliminada." });
  } catch (err) {
    return sendError(res, err);
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
