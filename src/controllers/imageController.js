const {
  generateImage,
  refineImage,
} = require("../services/imageService");

const Image = require("../models/Image");
const PromptHistory = require("../models/PromptHistory");
const User = require("../models/User");

const {
  sendImageGeneratedEmail,
} = require("../services/emailService");


const generateImageController = async (req, res) => {
  try {
    const { prompt, style, ratio, numImages } = req.body;

    // Validation
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required.",
      });
    }

    // Save prompt history
    await PromptHistory.create({
      prompt: prompt.trim(),
      style,
      userId: req.user.userId,
    });

    // Generate image
    const result = await generateImage(
      prompt.trim(),
      style,
      ratio,
      numImages
    );

    // Fetch logged in user
    const user = await User.findById(req.user.userId);

    // Safe background email processing
    if (user && user.email && result?.images?.length > 0) {
      sendImageGeneratedEmail(
        user.email,
        user.name,
        prompt,
        style,
        ratio,
        result.images[0].image
      )
        .then(() => console.log("Image email sent."))
        .catch((err) => console.error("Email Error:", err.message)); // Safe catch
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


const saveImageController = async (req, res) => {
  try {
    const { imageUrl, prompt, style } = req.body;

    if (!imageUrl || !imageUrl.trim() || !prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Image URL and prompt are required.",
      });
    }

    const image = await Image.create({
      imageUrl: imageUrl.trim(),
      prompt: prompt.trim(),
      style,
      userId: req.user.userId,
    });

    return res.status(201).json(image);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


const getImagesController = async (req, res) => {
  try {
    const images = await Image.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(images);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


const deleteImageController = async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!image) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    await image.deleteOne();

    return res.status(200).json({
      message: "Image deleted successfully.",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


const updateImageController = async (req, res) => {
  try {
    const { prompt, style, imageUrl } = req.body;

    // Prevent mass assignment vulnerability by sanitising body update keys
    const updateData = {};
    if (prompt !== undefined) updateData.prompt = prompt.trim();
    if (style !== undefined) updateData.style = style;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();

    const image = await Image.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId, // Ensures owner isolation
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!image) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    return res.status(200).json(image);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


const refineImageController = async (req, res) => {
  try {
    const { originalPrompt, refinementPrompt, style } = req.body;

    if (
      !originalPrompt ||
      !originalPrompt.trim() ||
      !refinementPrompt ||
      !refinementPrompt.trim()
    ) {
      return res.status(400).json({
        message: "Original prompt and refinement prompt are required.",
      });
    }

    const result = await refineImage(
      originalPrompt.trim(),
      refinementPrompt.trim(),
      style
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getPromptHistoryController = async (req, res) => {
  try {
    const prompts = await PromptHistory.find({
      userId: req.user.userId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(20);

    return res.status(200).json(prompts);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


const clearPromptHistoryController = async (req, res) => {
  try {
    await PromptHistory.deleteMany({
      userId: req.user.userId,
    });

    return res.status(200).json({
      message: "Prompt history cleared successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


const deletePromptHistoryController = async (req, res) => {
  try {
    const prompt = await PromptHistory.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!prompt) {
      return res.status(404).json({
        message: "Prompt not found.",
      });
    }

    await prompt.deleteOne();

    return res.status(200).json({
      message: "Prompt deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  generateImageController,
  saveImageController,
  getImagesController,
  deleteImageController,
  updateImageController,
  refineImageController,
  getPromptHistoryController,
  clearPromptHistoryController,
  deletePromptHistoryController,
};