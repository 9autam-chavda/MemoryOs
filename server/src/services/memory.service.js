const imagekitService = require("./imagekit.service");
const extractService = require("./extract.service");
const MemoryItem = require("../models/MemoryItem");
const aiService = require("./ai.service");
const cosineSimilarity = require("../utils/cosineSimilarity");

const toMemoryCard = (memory) => {
  const text = memory.extractedText || "";

  return {
    id: memory._id,
    fileName: memory.fileName,
    fileUrl: memory.fileUrl,
    fileType: memory.fileType,
    category: memory.category,
    isFavorite: !!memory.isFavorite,
    shareEnabled: !!memory.shareEnabled,
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

    embedding: extractedData.embedding,

    metadata: {
      size: file.size,
      mimeType: file.mimetype,
    },

    isProcessed: true,
    isFavorite: false,
  });

  return memory;
};

const getUserMemories = async (userId, fileType) => {

  const filter = {
    userId,
  };

  if (fileType && fileType !== "all") {
    if (fileType === "favorites") {
      filter.isFavorite = true;
    } else {
      filter.fileType = fileType;
    }
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

  const queryEmbedding =
    await aiService.generateEmbedding(query);

  const filter = {
    userId,
  };

  if (fileType && fileType !== "all") {
    filter.fileType = fileType;
  }

  const memories = await MemoryItem.find(filter);

  const scoredMemories = memories

  .filter((memory) => {
    return (
      memory.embedding &&
      memory.embedding.length > 0
    );
  })

  .map((memory) => {

    const score = cosineSimilarity(
      queryEmbedding,
      memory.embedding
    );

    return {
      memory,
      score,
    };

  });

  scoredMemories.sort((a, b) => {
  return b.score - a.score;
});

  return scoredMemories
  .slice(0, 5)
  .map((item) => ({
    ...toMemoryCard(item.memory),
    score: item.score,
  }));
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

    embedding: memory.embedding,

    isFavorite: !!memory.isFavorite,
    shareEnabled: !!memory.shareEnabled,
    shareToken: memory.shareToken,

    createdAt: memory.createdAt,
  };
};

// exports moved to bottom after function definitions

const toggleFavorite = async (memoryId, userId) => {
  const memory = await MemoryItem.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.userId.toString() !== userId) {
    const err = new Error("Unauthorized");
    err.status = 403;
    throw err;
  }

  memory.isFavorite = !memory.isFavorite;
  await memory.save();

  return memory;
};

const createShare = async (memoryId, userId) => {
  const memory = await MemoryItem.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.userId.toString() !== userId) {
    const err = new Error("Unauthorized");
    err.status = 403;
    throw err;
  }

  // generate secure random token
  const token = require("crypto").randomBytes(16).toString("hex");

  memory.shareEnabled = true;
  memory.shareToken = token;
  memory.sharedAt = new Date();

  await memory.save();

  return {
    ...toMemoryCard(memory),
    shareToken: token,
  };
};

const disableShare = async (memoryId, userId) => {
  const memory = await MemoryItem.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.userId.toString() !== userId) {
    const err = new Error("Unauthorized");
    err.status = 403;
    throw err;
  }

  memory.shareEnabled = false;
  memory.shareToken = undefined;
  memory.sharedAt = undefined;

  await memory.save();

  return memory;
};

const getSharedByToken = async (token) => {
  const memory = await MemoryItem.findOne({ shareToken: token, shareEnabled: true });

  if (!memory) {
    const err = new Error("Shared memory not found");
    err.status = 404;
    throw err;
  }

  return {
    id: memory._id,
    fileName: memory.fileName,
    fileUrl: memory.fileUrl,
    fileType: memory.fileType,
    summary: memory.summary,
    tags: memory.tags,
    metadata: memory.metadata,
    createdAt: memory.createdAt,
  };
};

module.exports = {
  uploadMemory,
  getUserMemories,
  deleteMemory,
  searchMemories,
  getMemoryById,
  toggleFavorite,
  createShare,
  disableShare,
  getSharedByToken,
};