const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TourMedia = sequelize.define(
  "TourMedia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    tour_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tours",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    type: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_cover: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "tour_media",
    timestamps: true,
    underscored: true,
  }
);

module.exports = TourMedia;
