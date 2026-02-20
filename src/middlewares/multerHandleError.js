// middlewares/multerErrorHandler.js
const multer = require("multer");

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        msg: "Cada imagen debe pesar máximo 20MB",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        msg: "Máximo 4 imágenes permitidas",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        msg: "Solo se permiten archivos de imagen",
      });
    }
  }

  next(err);
};

module.exports = multerErrorHandler;
