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
        "document",
      ],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    media: {
      url: String,
      secureUrl: { type: String, required: true },
      publicId: { type: String, required: true },
      resourceType: {
        type: String,
        enum: ["image", "pdf", "audio", "video", "document"],
        required: true,
      },
      // Provider implementation detail. Do not use this to determine UI or
      // content behavior; `fileType` is the application-level source of truth.
      cloudinaryResourceType: {
        type: String,
        enum: ["image", "video", "raw"],
      },
      format: String,
      bytes: Number,
      width: Number,
      height: Number,
      duration: Number,
      originalFilename: String,
      mimeType: String,
      provider: { type: String, enum: ["cloudinary"], required: true },
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
      pageCount: {
        type: Number,
      },
    },

    processingStatus: {
      type: String,
      enum: [
        "queued",
        "processing",
        "completed",
        "failed",
      ],
      default: "queued",
    },

    processingStep: {
      type: String,
      default: "Queued",
    },

    processingProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    processingError: {
      type: String,
      default: "",
    },

    processingStartedAt: {
      type: Date,
    },

    processingCompletedAt: {
      type: Date,
    },
    
    isFavorite: {
      type: Boolean,
      default: false,
    },

    // Sharing fields
    shareEnabled: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
    },
    sharedAt: {
      type: Date,
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
