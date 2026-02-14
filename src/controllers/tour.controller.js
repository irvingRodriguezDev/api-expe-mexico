const { uploadToS3 } = require("../middlewares/uploadMedia");
const { Tour, TourMedia } = require("../models");
const { Op } = require("sequelize");

/**
 * =========================
 * CREATE TOUR (ADMIN)
 * POST /api/tours
 * =========================
 */
exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    return res.status(201).json(tour);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el tour" });
  }
};

/**
 * =========================
 * GET ALL TOURS (PUBLIC)
 * GET /api/tours
 * =========================
 */

exports.getTours = async (req, res) => {
  try {
    const {
      search,
      location,
      category,
      min_price,
      max_price,
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const where = {
      status: "published",
    };

    // 🔍 Búsqueda general
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }

    // 📍 Filtros simples
    if (location) where.location = location;
    if (category) where.category = category;

    // 💰 Rango de precios
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    // 📄 Paginación
    const offset = (page - 1) * limit;

    const { rows: tours, count } = await Tour.findAndCountAll({
      where,
      include: [
        {
          model: TourMedia,
          as: "media",
          separate: true,
          order: [
            ["is_cover", "DESC"],
            ["order", "ASC"],
          ],
        },
      ],
      order: [["created_at", order.toUpperCase()]],
      limit: parseInt(limit),
      offset,
    });

    return res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      tours,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener tours" });
  }
};

/**
 * =========================
 * GET TOUR BY ID (PUBLIC)
 * GET /api/tours/:id
 * =========================
 */
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      where: {
        id: req.params.id,
        status: "published",
      },
      include: [
        {
          model: TourMedia,
          as: "media",
        },
      ],
    });

    if (!tour) {
      return res.status(404).json({ msg: "Tour no encontrado" });
    }

    return res.json(tour);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el tour" });
  }
};

/**
 * =========================
 * GET TOUR BY SLUG (PUBLIC)
 * GET /api/tours/:slug
 * =========================
 */
exports.getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      where: {
        slug: req.params.slug,
        status: "published",
      },
      include: [
        {
          model: TourMedia,
          as: "media",
          order: [
            ["is_cover", "DESC"],
            ["order", "ASC"],
          ],
        },
      ],
    });

    if (!tour) {
      return res.status(404).json({ msg: "Tour no encontrado" });
    }

    return res.json(tour);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el tour" });
  }
};

/**
 * =========================
 * UPDATE TOUR (ADMIN)
 * PUT /api/tours/:id
 * =========================
 */
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ msg: "Tour no encontrado" });
    }

    await tour.update(req.body);

    return res.json(tour);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el tour" });
  }
};

/**
 * =========================
 * DELETE TOUR (ADMIN)
 * DELETE /api/tours/:id
 * =========================
 */
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ msg: "Tour no encontrado" });
    }

    await tour.destroy();

    return res.json({ msg: "Tour eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar el tour" });
  }
};

/**
 * =========================
 * ADD MEDIA TO TOUR (ADMIN)
 * POST /api/tours/:id/media
 * =========================
 */
exports.addMediaToTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { cover_index = 0 } = req.body;

    // 1️⃣ Validar tour
    const tour = await Tour.findByPk(id);
    if (!tour) {
      return res.status(404).json({ msg: "Tour no encontrado" });
    }

    // 2️⃣ Validar archivos
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ msg: "Debe subir al menos una imagen" });
    }

    if (files.length > 4) {
      return res.status(400).json({ msg: "Máximo 4 imágenes permitidas" });
    }

    // 3️⃣ Desactivar portadas previas
    await TourMedia.update({ is_cover: false }, { where: { tour_id: id } });

    // 4️⃣ Subir a S3 + preparar registros
    const mediaData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileUrl = await uploadToS3("tours", file, id);

      if (!fileUrl) {
        return res.status(500).json({ msg: "Error al subir imagen a S3" });
      }

      mediaData.push({
        tour_id: id,
        type: "image",
        url: fileUrl,
        is_cover: Number(cover_index) === i,
        order: i,
      });
    }

    // 5️⃣ Guardar en BD
    const media = await TourMedia.bulkCreate(mediaData);

    return res.status(201).json({
      msg: "Imágenes agregadas correctamente",
      media,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al agregar multimedia" });
  }
};

/**
 * =========================
 * DELETE MEDIA FROM TOUR (ADMIN)
 * DELETE /api/tours/:tourId/media/:mediaId
 * =========================
 */
exports.deleteMediaFromTour = async (req, res) => {
  try {
    const { tourId, mediaId } = req.params;

    const media = await TourMedia.findOne({
      where: {
        id: mediaId,
        tour_id: tourId,
      },
    });

    if (!media) {
      return res.status(404).json({ msg: "Media no encontrada" });
    }

    await media.destroy();

    return res.json({ msg: "Media eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar multimedia" });
  }
};
