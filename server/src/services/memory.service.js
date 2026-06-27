const imagekitService = require("./imagekit.service");
const ocrService = require("./ocr.service");
const MemoryItem = require("../models/MemoryItem");

const toMemoryCard = (memory) => {
  const text = memory.extractedText || "";

  return {
    id: memory._id,
    fileName: memory.fileName,
    fileUrl: memory.fileUrl,
    category: memory.category,
    wordCount: memory.wordCount,
    createdAt: memory.createdAt,
    preview:
      text.length > 120
        ? text.substring(0, 120) + "..."
        : text,
  };
};



const uploadMemory = async (file, userId) => {


  const uploadResult = await imagekitService.uploadFile(file);
  const ocrResult = await ocrService.extractText(file.buffer);

  const memory = await MemoryItem.create({
    userId,

    fileName: file.originalname,

    fileUrl: uploadResult.fileUrl,

    imageKitFileId: uploadResult.fileId,

    type: "screenshot",

    extractedText: ocrResult.extractedText,

    wordCount: ocrResult.wordCount,
  });

  return memory;
};

const getUserMemories = async (userId) => {

  const memories = await MemoryItem.find({
    userId,
  }).sort({
    createdAt: -1,
  });

  return memories.map(toMemoryCard);
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

const searchMemories = async (userId, query) => {
  const memories = await MemoryItem.find({
    userId,
    extractedText: {
      $regex: query,
      $options: "i",
    },
  }).sort({
    createdAt: -1,
  });

  return memories.map(toMemoryCard);
};

const getMemoryById = async (memoryId, userId) => {

  const memory = await MemoryItem.findOne({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new Error("Memory not found");
  }

  return {
    id: memory._id,

    fileName: memory.fileName,

    fileUrl: memory.fileUrl,

    extractedText: memory.extractedText,

    wordCount: memory.wordCount,

    category: memory.category,

    tags: memory.tags,

    createdAt: memory.createdAt,
  };
};

module.exports = {
  uploadMemory,
  getUserMemories,
  deleteMemory,
  searchMemories,
  getMemoryById,
};