const mediaService = require("./media.service");
const extractService = require("./extract.service");
const MemoryItem = require("../models/MemoryItem");
const aiService = require("./ai.service");
const cosineSimilarity = require("../utils/cosineSimilarity");
const processingService = require("./processing.service");

const toMediaResponse = (memory) => mediaService.toClientMedia(memory.media, memory.fileType);

const toMemoryCard = (memory) => {
  const text = memory.extractedText || "";

  return {
    id: memory._id,
    fileName: memory.fileName,
    fileType: memory.fileType,
    media: toMediaResponse(memory),
    duration: memory.media?.duration,
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

const uploadMemory = async (file, userId, onStage, onMemoryCreated) => {
  const fileType = mediaService.getFileType(file.mimetype);
  await onStage?.("cloudinary", "Uploading to cloud...");
  const uploadedMedia = await mediaService.upload(file, fileType);

  try {
    await onStage?.("cloudinary_complete", "Cloud upload complete. Processing file...");
      const memory = await MemoryItem.create({

      userId,

      fileName: file.originalname,

      media: uploadedMedia,

      fileType,

      extractedText: "",

      wordCount: 0,

      summary: "",

      category: "uncategorized",

      tags: [],

      embedding: [],

      metadata: {},

      processingStatus: "queued",

      processingStep: "Queued",

      processingProgress: 0,

      isFavorite: false,
  });

  await onMemoryCreated?.(memory);

  processingService
    .processMemory(
        memory._id,
        file,
        onStage
    )
    .catch((error) => {
        console.error(
            "Background processing failed:",
            error
        );
    });

    return memory;
  } catch (error) {
    try {
      await mediaService.deleteFile(uploadedMedia, fileType);
    } catch (cleanupError) {
      console.error("Unable to clean up failed media upload", cleanupError.message);
    }
    throw error;
  }
};

const getUserMemories = async (userId, fileType, limit) => {

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

  const query = MemoryItem.find(filter).sort({ createdAt: -1 });
  const requestedLimit = Number.parseInt(limit, 10);
  if (Number.isInteger(requestedLimit) && requestedLimit > 0) {
    query.limit(Math.min(requestedLimit, 50));
  }
  const [memories, totalCount, favoriteCount, categories] = await Promise.all([
    query,
    MemoryItem.countDocuments({ userId }),
    MemoryItem.countDocuments({ userId, isFavorite: true }),
    MemoryItem.distinct("category", { userId }),
  ]);

  return {
    memories: memories.map(toMemoryCard),
    totalCount,
    favoriteCount,
    categoryCount: categories.filter(Boolean).length,
  };
};

const deleteMemory = async (memoryId, userId) => {

  const memory = await MemoryItem.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await mediaService.deleteFile(memory.media, memory.fileType);

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

  // ==========================================
  // Lazy Summary Generation
  // ==========================================

  if (!memory.summary?.trim()) {
    try {
      if (memory.wordCount <= 30) {
        memory.summary = memory.extractedText;
      } else {
        memory.summary =
          await aiService.generateSummary(
            memory.extractedText
          );
      }

      await memory.save();
    } catch (error) {
      console.error(
        "Summary generation failed:",
        error.message
      );

      // Don't fail the request if summary generation fails.
      memory.summary = "";
    }
  }

  return {
    id: memory._id,

    fileName: memory.fileName,

    fileType: memory.fileType,

    media: toMediaResponse(memory),

    extractedText: memory.extractedText,

    wordCount: memory.wordCount,

    summary: memory.summary,

    category: memory.category,

    tags: memory.tags,

    embedding: memory.embedding,

    isFavorite: !!memory.isFavorite,

    shareEnabled: !!memory.shareEnabled,

    shareToken: memory.shareToken,

    metadata: {
      ...(memory.metadata?.toObject?.() ||
        memory.metadata ||
        {}),

      size: memory.media?.bytes,

      mimeType: memory.media?.mimeType,

      width: memory.media?.width,

      height: memory.media?.height,

      duration: memory.media?.duration,

      format: memory.media?.format,
    },

    createdAt: memory.createdAt,

    updatedAt: memory.updatedAt,
  };
};

const getRelatedMemories = async (memoryId, userId) => {
  const memory = await MemoryItem.findById(memoryId);

  if (!memory) {
    const err = new Error("Memory not found");
    err.status = 404;
    throw err;
  }

  if (memory.userId.toString() !== userId) {
    const err = new Error("Unauthorized");
    err.status = 403;
    throw err;
  }

  if (!Array.isArray(memory.embedding) || memory.embedding.length === 0) {
    return [];
  }

  const relatedMemories = await MemoryItem.find(
    {
      userId,
      _id: { $ne: memoryId },
    },
    {
      _id: 1,
      fileName: 1,
      summary: 1,
      category: 1,
      tags: 1,
      fileType: 1,
      media: 1,
      createdAt: 1,
      embedding: 1,
    }
  ).lean();

  const scoredMemories = relatedMemories
    .filter(
      (candidate) =>
        Array.isArray(candidate.embedding) &&
        candidate.embedding.length > 0
    )
    .map((candidate) => ({
      candidate,
      similarity: cosineSimilarity(
        memory.embedding,
        candidate.embedding
      ),
    }))
    .filter(
      ({ similarity }) =>
        Number.isFinite(similarity) &&
        similarity >= 0.30
    )
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map(({ candidate, similarity }) => ({
      id: candidate._id,
      fileName: candidate.fileName,
      filename: candidate.fileName,
      summary: candidate.summary || "",
      category: candidate.category || "uncategorized",
      tags: Array.isArray(candidate.tags) ? candidate.tags : [],
      fileType: candidate.fileType,
      media: mediaService.toClientMedia(
        candidate.media,
        candidate.fileType
      ),
      duration: candidate.media?.duration,
      createdAt: candidate.createdAt,
      similarity: Math.round(similarity * 100),
    }));

  return scoredMemories;
}

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
    fileType: memory.fileType,
    media: toMediaResponse(memory),
    summary: memory.summary,
    extractedText: memory.extractedText,
    tags: memory.tags,
    metadata: {
      ...(memory.metadata?.toObject?.() || memory.metadata || {}),
      size: memory.media?.bytes,
      mimeType: memory.media?.mimeType,
      duration: memory.media?.duration,
    },
    createdAt: memory.createdAt,
  };
};

module.exports = {
  uploadMemory,
  getUserMemories,
  deleteMemory,
  searchMemories,
  getMemoryById,
  getRelatedMemories,   
  toggleFavorite,
  createShare,
  disableShare,
  getSharedByToken,
};
