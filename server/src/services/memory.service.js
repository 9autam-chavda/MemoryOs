const imagekitService = require("./imagekit.service");
const extractService = require("./extract.service");
const MemoryItem = require("../models/MemoryItem");

const toMemoryCard = (memory) => {
  const text = memory.extractedText || "";

  return {
    id: memory._id,
    fileName: memory.fileName,
    fileUrl: memory.fileUrl,
    fileType: memory.fileType,
    category: memory.category,
    wordCount: memory.wordCount,
    createdAt: memory.createdAt,
    preview:
      text.length > 120
        ? text.substring(0, 120) + "..."
        : text,
  };
};

const getFileType = (mimeType) => {

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (
    mimeType === "text/plain" ||
    mimeType === "text/markdown"
  ) {
    return "text";
  }

  return "other";
};

const uploadMemory = async (file, userId) => {

  const uploadResult = await imagekitService.uploadFile(file);

  const extractedData = await extractService.extractText(file);

  const memory = await MemoryItem.create({
    userId,

    fileName: file.originalname,

    fileUrl: uploadResult.fileUrl,

    imageKitFileId: uploadResult.fileId,

    fileType: getFileType(file.mimetype),

    extractedText: extractedData.extractedText,

    wordCount: extractedData.wordCount,

    summary: extractedData.summary,

    category: extractedData.category,

    tags: extractedData.tags,

    metadata: {
      size: file.size,
      mimeType: file.mimetype,
    },

    isProcessed: true,
  });

  return memory;
};

const getUserMemories = async (userId, fileType) => {

  const filter = {
    userId,
  };

  if (fileType && fileType !== "all") {
    filter.fileType = fileType;
  }

  const memories = await MemoryItem.find(filter).sort({
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

const searchMemories = async (userId, query, fileType) => {

  const filter = {
    userId,
    extractedText: {
      $regex: query,
      $options: "i",
    },
  };

  if (fileType && fileType !== "all") {
    filter.fileType = fileType;
  }

  const memories = await MemoryItem.find(filter).sort({
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

    fileType: memory.fileType,

    extractedText: memory.extractedText,

    wordCount: memory.wordCount,

    summary: memory.summary,

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