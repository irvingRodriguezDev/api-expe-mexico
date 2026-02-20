const multer = require("multer");
const { Upload } = require("@aws-sdk/lib-storage");
const s3Client = require("../config/s3");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // ✅ 20 MB por imagen
    files: 4, // ✅ máximo 4 imágenes
  },
  fileFilter: (req, file, cb) => {
    // ✅ solo imágenes
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo imágenes")
      );
    }
    cb(null, true);
  },
});

const uploadToS3 = async (folder, file, id) => {
  const extension = path.extname(file.originalname); // .jpg, .png, etc.
  const environment = process.env.AWS_S3_ENVIROMENT || "local";

  // 🔐 Key única (puedes agregar extensión si quieres)
  const key = `${environment}/${folder}/${id}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  await upload.done();

  return `/${key}`; // path relativo
};

module.exports = { upload, uploadToS3 };
