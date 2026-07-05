const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Get logged-in user's profile
router.get(
  "/",
  authMiddleware,
  getProfile
);

// Update profile
router.put(
  "/",
  authMiddleware,
  updateProfile
);

// Upload profile image
router.put(
  "/upload",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;