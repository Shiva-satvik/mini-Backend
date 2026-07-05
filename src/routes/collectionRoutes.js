const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createCollection,
    getCollections,
    renameCollection,
    deleteCollection,
    addImageToCollection,
    removeImage,
} = require("../controllers/collectionController");

router.post("/", authMiddleware, createCollection);

router.get("/", authMiddleware, getCollections);

router.put("/:id", authMiddleware, renameCollection);

router.delete("/:id", authMiddleware, deleteCollection);

router.post("/:id/add-image", authMiddleware, addImageToCollection);

router.delete("/:id/remove/:imageId", authMiddleware, removeImage);

module.exports = router;