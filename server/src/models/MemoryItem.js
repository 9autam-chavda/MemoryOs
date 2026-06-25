const mongoose = require("mongoose");

const memoryItemSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "screenshot",
          "image",
          "pdf",
          "note",
        ],
        default: "screenshot",
      },

      fileName: {
        type: String,
        required: true,
      },

      fileUrl: {
        type: String,
        required: true,
      },

      extractedText: {
        type: String,
        default: "",
      },

      wordCount: {
        type: Number,
        default: 0,
      },

      category: {
        type: String,
        default: "uncategorized",
      },

      imageKitFileId: {
        type: String,
        required: true,
      },

      tags: [
        {
          type: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "MemoryItem",
    memoryItemSchema
  );