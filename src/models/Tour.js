const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const slugify = require("slugify");
const Tour = sequelize.define(
  "Tour",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
    },

    short_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    duration: {
      type: DataTypes.STRING(50),
      allowNull: true, // ej: "3 horas", "1 día"
    },

    location: {
      type: DataTypes.TEXT,
      allowNull: false, // ej: "Trosten", "CDMX"
    },

    category: {
      type: DataTypes.STRING(80),
      allowNull: true, // ej: aventura, cultural, naturaleza
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    tags: {
      type: DataTypes.JSON,
      allowNull: true, // ej: ["familia", "fotografía", "naturaleza"]
    },

    whatsapp_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Borrador", "Publicado"),
      defaultValue: "Borrador",
    },
  },
  {
    tableName: "tours",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeValidate: async (tour) => {
        if (!tour.slug && tour.title) {
          const baseSlug = slugify(tour.title, {
            lower: true,
            strict: true,
            locale: "es",
          });

          let slug = baseSlug;
          let count = 1;

          while (
            await Tour.findOne({
              where: { slug },
            })
          ) {
            slug = `${baseSlug}-${count}`;
            count++;
          }

          tour.slug = slug;
        }
      },
    },
  }
);

module.exports = Tour;
