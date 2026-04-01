const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { isEmail: true },
      },
      quotationId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: "quotations", key: "id" },
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "customers",
      underscored: true,
      timestamps: true,
    }
  );

  Customer.associate = (models) => {
    Customer.belongsTo(models.Quotation, {
      foreignKey: "quotationId",
      as: "quotation",
    });
  };

  return Customer;
};
