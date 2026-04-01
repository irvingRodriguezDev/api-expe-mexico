const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UnitType = sequelize.define(
    "UnitType",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "unit_type_categories", key: "id" },
      },
    },
    {
      tableName: "unit_types",
      underscored: true,
      timestamps: true,
    }
  );

  UnitType.associate = (models) => {
    UnitType.hasMany(models.Quotation, {
      foreignKey: "unitTypeId",
      as: "quotations",
    });
    UnitType.belongsTo(models.UnitTypeCategory, {
      foreignKey: "categoryId",
      as: "category",
    });
  };

  return UnitType;
};
