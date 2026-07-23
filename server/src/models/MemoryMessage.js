const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
    {
        id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MemoryItem",
        required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    similarity: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  {
    _id: false,
  }
);

const memoryMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MemorySession",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sources: {
      type: [sourceSchema],
      default: [],
    },

    metadata: {
      model: {
        type: String,
        default: "",
      },

      responseTime: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

memoryMessageSchema.index({
  sessionId: 1,
  createdAt: 1,
});

module.exports = mongoose.model(
  "MemoryMessage",
  memoryMessageSchema
);