const mongoose = require("mongoose");

const memoryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileType: {
      type: String,
      enum: [
        "image",
        "pdf",
        "audio",
        "video",
        "text",
        "other",
      ],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    imageKitFileId: {
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

    summary: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "uncategorized",
    },

    tags: [
      {
        type: String,
      },
    ],

    embedding: {
      type: [Number],
      default: [],
    },

    metadata: {
      size: {
        type: Number,
      },

      mimeType: {
        type: String,
      },

      width: {
        type: Number,
      },

      height: {
        type: Number,
      },

      duration: {
        type: Number,
      },

      pageCount: {
        type: Number,
      },
    },

    processingStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
      ],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MemoryItem",
  memoryItemSchema
);