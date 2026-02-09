const sequelize = require("../config/db");

const User = require("./User");
const Tour = require("./Tour");
const TourMedia = require("./TourMedia");
const db = {
  sequelize,
  User,
  Tour,
  TourMedia,
};
Tour.hasMany(TourMedia, {
  foreignKey: "tour_id",
  as: "media",
});

TourMedia.belongsTo(Tour, {
  foreignKey: "tour_id",
});
module.exports = db;
