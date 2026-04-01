const { DataTypes } = require("sequelize");

const TRIP_TYPES = ["one_way", "round_trip"];
const STATUSES = ["pending", "sent", "accepted", "rejected", "expired", "spam"];
const SOURCES = ["web_form", "admin"];

module.exports = (sequelize) => {
  const Quotation = sequelize.define(
    "Quotation",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quoteNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      tripType: {
        type: DataTypes.ENUM(...TRIP_TYPES),
        allowNull: false,
      },
      contractorName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      contractorPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      contractorEmail: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { isEmail: true },
      },
      origin: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      departureAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      returnAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...STATUSES),
        defaultValue: "pending",
      },
      source: {
        type: DataTypes.ENUM(...SOURCES),
        defaultValue: "web_form",
      },
      unitTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "unit_types", key: "id" },
      },
    },
    {
      tableName: "quotations",
      underscored: true,
      timestamps: true,
      validate: {
        returnAtRequiredIfRoundTrip() {
          if (this.tripType === "round_trip" && !this.returnAt) {
            throw new Error(
              "returnAt es obligatorio para viajes de ida y vuelta."
            );
          }
        },
      },
    }
  );

  Quotation.associate = (models) => {
    Quotation.belongsTo(models.UnitType, {
      foreignKey: "unitTypeId",
      as: "unitType",
    });
    Quotation.hasOne(models.Order, {
      foreignKey: "quotationId",
      as: "order",
    });
    Quotation.hasOne(models.Customer, {
      foreignKey: "quotationId",
      as: "customer",
    });
  };

  return Quotation;
};
