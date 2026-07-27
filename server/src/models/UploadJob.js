const mongoose = require("mongoose");

const uploadJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  status: { type: String, enum: ["queued", "processing", "completed", "failed"], default: "queued" },
  stage: { type: String, default: "queued" },
  message: { type: String, default: "Queued" },
  memoryId: { type: mongoose.Schema.Types.ObjectId, ref: "MemoryItem" },
  error: String,
}, { timestamps: true });

uploadJobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

module.exports = mongoose.model("UploadJob", uploadJobSchema);
