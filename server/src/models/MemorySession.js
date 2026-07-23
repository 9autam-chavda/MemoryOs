const mongoose = require("mongoose");

const memorySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New Memory Session",
      trim: true,
      maxlength: 100,
    },

    lastMessage: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

memorySessionSchema.index({
  userId: 1,
  updatedAt: -1,
});

module.exports = mongoose.model(
  "MemorySession",
  memorySessionSchema
);