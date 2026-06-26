const imagekitService = require("./imagekit.service");
const MemoryItem = require("../models/MemoryItem");

const uploadMemory = async (file, userId) => {
  const uploadResult = await imagekitService.uploadFile(file);

  const memory = await MemoryItem.create({
    userId,
    fileName: file.originalname,
    fileUrl: uploadResult.fileUrl,
    imageKitFileId: uploadResult.fileId,
    type: "screenshot",
  });

  return memory;
};

const getUserMemories = async (userId) => {
  return await MemoryItem.find({ userId }).sort({
    createdAt: -1,
  });
};

const deleteMemory = async (memoryId, userId) => {
  const memory = await MemoryItem.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await imagekitService.deleteFile(memory.imageKitFileId);

  await MemoryItem.findByIdAndDelete(memoryId);

  return {
    message: "Memory deleted successfully",
  };
};

module.exports = {
  uploadMemory,
  getUserMemories,
  deleteMemory,
};