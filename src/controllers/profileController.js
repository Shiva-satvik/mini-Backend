const User = require("../models/User");
const Image = require("../models/Image");
const PromptHistory = require("../models/PromptHistory");
const Collection = require("../models/Collection");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const generatedImages = await Image.countDocuments({
      userId,
    });

    const collections = await Collection.countDocuments({
      userId,
    });

    const promptHistory = await PromptHistory.countDocuments({
      userId,
    });

    const latestImages = await Image.find({
      userId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const recentActivity = latestImages.map((image) => ({
      id: image._id,
      prompt: image.prompt,
      imageUrl: image.imageUrl,
      style: image.style,
      createdAt: image.createdAt,
    }));

    res.status(200).json({
      user,
      stats: {
        generatedImages,
        collections,
        savedImages: generatedImages,
        promptHistory,
      },
      recentActivity,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required.",
      });
    }

    name = name.trim();

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};