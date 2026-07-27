const MemoryItem = require("../models/MemoryItem");
const extractService = require("./extract.service");
const aiService = require("./ai.service");

const processMemory = async (
  memoryId,
  file,
  onStage
) => {
  try {
    const memory = await MemoryItem.findById(memoryId);

    if (!memory) {
      throw new Error("Memory not found");
    }

    // ==========================================
    // Start Processing
    // ==========================================

    memory.processingStatus = "processing";
    memory.processingStep = "Extracting Text";
    memory.processingProgress = 10;
    memory.processingStartedAt = new Date();

    await memory.save();

    await onStage?.(
      "extracting",
      "Extracting text..."
    );

    // ==========================================
    // Extract Text
    // ==========================================

    const extractedData =
      await extractService.extractText(
        file,
        onStage
      );

    memory.extractedText =
      extractedData.extractedText;

    memory.wordCount =
      extractedData.wordCount || 0;

    memory.metadata = {
      pageCount:
        extractedData.pageCount || 0,
    };

    memory.processingStep =
      "Generating AI Analysis";

    memory.processingProgress = 45;

    await memory.save();

    await onStage?.(
      "analyzing",
      "Generating AI summary..."
    );

    // ==========================================
    // AI Analysis
    // ==========================================

    const ai =
      await aiService.analyzeText(
        extractedData.extractedText
      );

    memory.summary = ai.summary;
    memory.category = ai.category;
    memory.tags = ai.tags;
    memory.embedding = ai.embedding;

    memory.processingStep =
      "Saving Memory";

    memory.processingProgress = 90;

    await memory.save();

    await onStage?.(
      "saving",
      "Saving memory..."
    );

    // ==========================================
    // Complete
    // ==========================================

    memory.processingStatus =
      "completed";

    memory.processingStep =
      "Completed";

    memory.processingProgress = 100;

    memory.processingCompletedAt =
      new Date();

    await memory.save();

    await onStage?.(
      "completed",
      "Completed"
    );

    return memory;

  } catch (error) {

    console.error(
      "Processing Error:",
      error
    );

    await MemoryItem.findByIdAndUpdate(
      memoryId,
      {
        processingStatus: "failed",
        processingStep: "Failed",
        processingProgress: 100,
        processingError:
          error.message,
      }
    );

    await onStage?.(
      "failed",
      "Processing failed"
    );

    throw error;
  }
};

module.exports = {
  processMemory,
};