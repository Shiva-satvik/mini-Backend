const Collection = require("../models/Collection");
const Image = require("../models/Image");


const createCollection = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Collection name is required.",
      });
    }

    name = name.trim();

    const exists = await Collection.findOne({
      userId: req.user.userId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (exists) {
      return res.status(400).json({
        message: "Collection already exists.",
      });
    }

    const collection = await Collection.create({
      name,
      userId: req.user.userId,
      images: [],
    });

    res.status(201).json(collection);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};


const getCollections = async (req, res) => {

  try {

    const collections = await Collection.find({
      userId: req.user.userId,
    })
      .populate("images")
      .sort({ createdAt: -1 });

    res.status(200).json(collections);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

const renameCollection = async (req, res) => {

  try {

    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Collection name is required.",
      });
    }

    name = name.trim();

    const duplicate = await Collection.findOne({
      userId: req.user.userId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(400).json({
        message: "A collection with this name already exists.",
      });
    }

    const collection = await Collection.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        name,
      },
      {
        new: true,
      }
    );

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found.",
      });
    }

    res.status(200).json(collection);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


const deleteCollection = async (req, res) => {

  try {

    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found.",
      });
    }

    await collection.deleteOne();

    res.status(200).json({
      message: "Collection deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


const addImageToCollection = async (req, res) => {

  try {

    const { imageId } = req.body;

    if (!imageId) {
      return res.status(400).json({
        message: "Image ID is required.",
      });
    }

    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found.",
      });
    }

    // Ensure the image belongs to the logged-in user
    const image = await Image.findOne({
      _id: imageId,
      userId: req.user.userId,
    });

    if (!image) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    const alreadyExists = collection.images.some(
      (img) => img.toString() === imageId
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Image already exists in this collection.",
      });
    }

    collection.images.push(imageId);

    await collection.save();

    await collection.populate("images");

    res.status(200).json({
      message: "Image added successfully.",
      collection,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


const removeImage = async (req, res) => {

  try {

    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found.",
      });
    }

    const exists = collection.images.some(
      (img) => img.toString() === req.params.imageId
    );

    if (!exists) {
      return res.status(404).json({
        message: "Image not found in this collection.",
      });
    }

    collection.images = collection.images.filter(
      (img) => img.toString() !== req.params.imageId
    );

    await collection.save();

    await collection.populate("images");

    res.status(200).json({
      message: "Image removed successfully.",
      collection,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  createCollection,
  getCollections,
  renameCollection,
  deleteCollection,
  addImageToCollection,
  removeImage,
};