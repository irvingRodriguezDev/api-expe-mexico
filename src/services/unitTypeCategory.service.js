const { UnitTypeCategory, UnitType } = require("../models");

async function createCategory(data) {
  const category = await UnitTypeCategory.create({
    name: data.name,
    isActive: data.isActive ?? true,
  });
  return category;
}

async function getCategories({ onlyActive = false } = {}) {
  const where = {};
  if (onlyActive) where.isActive = true;

  return await UnitTypeCategory.findAll({
    where,
    order: [["name", "ASC"]],
  });
}

async function getCategoryById(id) {
  const category = await UnitTypeCategory.findByPk(id);
  if (!category) {
    const err = new Error("Categoría no encontrada.");
    err.status = 404;
    throw err;
  }
  return category;
}

async function updateCategory(id, data) {
  const category = await getCategoryById(id);
  await category.update({
    name: data.name ?? category.name,
    isActive: data.isActive ?? category.isActive,
  });
  return category;
}

async function deleteCategory(id) {
  const category = await getCategoryById(id);

  // Verificar que no tenga unidades asociadas antes de eliminar
  const count = await UnitType.count({ where: { categoryId: id } });
  if (count > 0) {
    const err = new Error(
      "No se puede eliminar una categoría que tiene tipos de unidad asociados."
    );
    err.status = 409;
    throw err;
  }

  await category.destroy();
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
