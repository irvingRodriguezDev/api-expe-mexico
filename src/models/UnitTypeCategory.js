const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UnitTypeCategory = sequelize.define(
    "UnitTypeCategory",
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
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "unit_type_categories",
      underscored: true,
      timestamps: true,
    }
  );

  UnitTypeCategory.associate = (models) => {
    UnitTypeCategory.hasMany(models.UnitType, {
      foreignKey: "categoryId",
      as: "unitTypes",
    });
  };

  return UnitTypeCategory;
};
