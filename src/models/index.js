const sequelize = require("../config/db");

const User = require("./User");
const Tour = require("./Tour");
const TourMedia = require("./TourMedia");

// ✅ Los nuevos hay que invocarlos con (sequelize)
const UnitTypeCategory = require("./UnitTypeCategory")(sequelize);
const UnitType = require("./UnitType")(sequelize);
const Quotation = require("./Quotation")(sequelize);
const Customer = require("./Customer")(sequelize);
const Order = require("./Order")(sequelize);

const db = {
  sequelize,
  User,
  Tour,
  TourMedia,
  UnitTypeCategory,
  UnitType,
  Quotation,
  Customer,
  Order,
};

// Asociaciones existentes
Tour.hasMany(TourMedia, { foreignKey: "tour_id", as: "media" });
TourMedia.belongsTo(Tour, { foreignKey: "tour_id" });

// Asociaciones de los nuevos modelos
Object.values(db).forEach((model) => {
  if (model && typeof model.associate === "function") {
    model.associate(db);
  }
});

module.exports = db;
