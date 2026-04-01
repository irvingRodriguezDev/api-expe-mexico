const UnitTypeService = require("../services/unitType.service.js");

function sendError(res, err) {
  const status = err.status ?? 500;
  const message = status === 500 ? "Error interno del servidor." : err.message;
  if (status === 500) console.error(err);
  return res.status(status).json({ ok: false, message });
}

async function createUnitType(req, res) {
  try {
    const unitType = await UnitTypeService.createUnitType(req.body);
    return res.status(201).json({ ok: true, data: unitType });
  } catch (err) {
    return sendError(res, err);
  }
}

async function getUnitTypes(req, res) {
  try {
    const onlyActive = req.query.onlyActive === "true";
    const unitTypes = await UnitTypeService.getUnitTypes({ onlyActive });
    return res.json({ ok: true, data: unitTypes });
  } catch (err) {
    return sendError(res, err);
  }
}

// Endpoint público para el formulario — devuelve agrupado por categoría
async function getUnitTypesGrouped(req, res) {
  try {
    const data = await UnitTypeService.getUnitTypesGrouped();
    return res.json({ ok: true, data });
  } catch (err) {
    return sendError(res, err);
  }
}

async function getUnitTypeById(req, res) {
  try {
    const unitType = await UnitTypeService.getUnitTypeById(req.params.id);
    return res.json({ ok: true, data: unitType });
  } catch (err) {
    return sendError(res, err);
  }
}

async function updateUnitType(req, res) {
  try {
    const unitType = await UnitTypeService.updateUnitType(
      req.params.id,
      req.body
    );
    return res.json({ ok: true, data: unitType });
  } catch (err) {
    return sendError(res, err);
  }
}

async function deleteUnitType(req, res) {
  try {
    await UnitTypeService.deleteUnitType(req.params.id);
    return res.json({ ok: true, message: "Tipo de unidad eliminado." });
  } catch (err) {
    return sendError(res, err);
  }
}

module.exports = {
  createUnitType,
  getUnitTypes,
  getUnitTypesGrouped,
  getUnitTypeById,
  updateUnitType,
  deleteUnitType,
};
