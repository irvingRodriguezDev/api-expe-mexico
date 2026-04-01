const { DataTypes } = require("sequelize");

const STATUSES = ["confirmed", "in_progress", "completed", "cancelled"];

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM(...STATUSES),
        defaultValue: "confirmed",
      },
      confirmedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      quotationId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: "quotations", key: "id" },
      },
    },
    {
      tableName: "orders",
      underscored: true,
      timestamps: true,
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.Quotation, {
      foreignKey: "quotationId",
      as: "quotation",
    });
  };

  return Order;
};
