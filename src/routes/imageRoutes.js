const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  generateImageController,
  saveImageController,
  getImagesController,
  deleteImageController,
  updateImageController,
  refineImageController,
  getPromptHistoryController,
  clearPromptHistoryController,
  deletePromptHistoryController,
} = require(
  "../controllers/imageController"
);

router.post(
  "/generate",
  authMiddleware,
  generateImageController
);

router.post(
  "/save",
  authMiddleware,
  saveImageController
);
router.get(
  "/",
  authMiddleware,
  getImagesController
);

router.post(
  "/refine",
  authMiddleware,
  refineImageController
);

router.get(
  "/history",
  authMiddleware,
  getPromptHistoryController
);
router.delete(
  "/history",
  authMiddleware,
  clearPromptHistoryController
);

router.delete(
  "/history/:id",
  authMiddleware,
  deletePromptHistoryController
);

router.delete(
  "/:id",
  authMiddleware,
  deleteImageController
);

router.patch(
  "/:id",
  authMiddleware,
  updateImageController
);

module.exports = router;