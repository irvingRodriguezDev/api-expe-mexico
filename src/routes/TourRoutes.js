const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tour.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const { upload } = require("../middlewares/uploadMedia");
// PUBLIC
router.get("/", tourController.getTours);
router.get("/:slug", tourController.getTourBySlug);
router.get("/:id", tourController.getTourById);
// ADMIN
router.post("/", authMiddleware, tourController.createTour);
router.put("/:id", authMiddleware, tourController.updateTour);
router.delete("/:id", authMiddleware, tourController.deleteTour);

router.post(
  "/:id/media",
  authMiddleware,
  upload.single("file"),
  tourController.addMediaToTour
);

router.delete(
  "/:tourId/media/:mediaId",
  authMiddleware,
  tourController.deleteMediaFromTour
);

module.exports = router;
