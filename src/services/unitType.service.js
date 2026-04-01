const { UnitType, UnitTypeCategory } = require("../models");

async function createUnitType(data) {
  const unitType = await UnitType.create({
    name: data.name,
    description: data.description ?? null,
    capacity: data.capacity ?? null,
    isActive: data.isActive ?? true,
    categoryId: data.categoryId ?? null,
  });
  return unitType;
}

// Para el panel admin — lista plana con su categoría
async function getUnitTypes({ onlyActive = false } = {}) {
  const where = {};
  if (onlyActive) where.isActive = true;

  return await UnitType.findAll({
    where,
    include: [
      { model: UnitTypeCategory, as: "category", attributes: ["id", "name"] },
    ],
    order: [["name", "ASC"]],
  });
}

// Para el formulario público — agrupadas por categoría
async function getUnitTypesGrouped() {
  const categories = await UnitTypeCategory.findAll({
    where: { isActive: true },
    include: [
      {
        model: UnitType,
        as: "unitTypes",
        where: { isActive: true },
        required: false,
        attributes: ["id", "name", "capacity", "description"],
      },
    ],
    order: [
      ["name", "ASC"],
      [{ model: UnitType, as: "unitTypes" }, "name", "ASC"],
    ],
  });

  // Filtramos categorías que no tienen unidades activas
  return categories.filter((cat) => cat.unitTypes.length > 0);
}

async function getUnitTypeById(id) {
  const unitType = await UnitType.findByPk(id, {
    include: [
      { model: UnitTypeCategory, as: "category", attributes: ["id", "name"] },
    ],
  });
  if (!unitType) {
    const err = new Error("Tipo de unidad no encontrado.");
    err.status = 404;
    throw err;
  }
  return unitType;
}

async function updateUnitType(id, data) {
  const unitType = await getUnitTypeById(id);
  await unitType.update({
    name: data.name ?? unitType.name,
    description: data.description ?? unitType.description,
    capacity: data.capacity ?? unitType.capacity,
    isActive: data.isActive ?? unitType.isActive,
    categoryId: data.categoryId ?? unitType.categoryId,
  });
  return unitType;
}

async function deleteUnitType(id) {
  const unitType = await getUnitTypeById(id);
  await unitType.destroy();
}

module.exports = {
  createUnitType,
  getUnitTypes,
  getUnitTypesGrouped,
  getUnitTypeById,
  updateUnitType,
  deleteUnitType,
};
