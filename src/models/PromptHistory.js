const mongoose = require("mongoose");

const promptHistorySchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },

    style: {
      type: String,
      default: "Photorealistic",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PromptHistory",
  promptHistorySchema
);