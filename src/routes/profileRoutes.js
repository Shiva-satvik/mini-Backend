const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;