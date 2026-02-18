const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tour.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const { upload } = require("../middlewares/uploadMedia");
// PUBLIC
router.get("/", tourController.getTours);
router.get("/latest", tourController.getLatestTours);
router.get("/slug/:slug", tourController.getTourBySlug);
// ADMIN
router.post("/", authMiddleware, tourController.createTour);
router.post(
  "/media/:id",
  authMiddleware,
  upload.array("files", 4),
  tourController.addMediaToTour
);
router.get("/:id", tourController.getTourById);
router.put("/:id", authMiddleware, tourController.updateTour);
router.delete("/:id", authMiddleware, tourController.deleteTour);

router.delete(
  "/:tourId/media/:mediaId",
  authMiddleware,
  tourController.deleteMediaFromTour
);

module.exports = router;
