const memoryService =
  require(
    "../services/memory.service"
  );
const UploadJob = require("../models/UploadJob");

const updateUploadJob = (jobId, updates) => UploadJob.findByIdAndUpdate(jobId, updates).exec();

const uploadMemory =
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "A supported file is required",
        });
      }

      const job = await UploadJob.create({
        userId: req.user.id,
        status: "queued",
        stage: "queued",
        message: "Queued",
      });

      res.status(202).json({
        success: true,
        data: { jobId: job._id, status: job.status },
      });

      setImmediate(async () => {
        const onStage = async (stage, message) => {
          const updates = {
              stage,
              message,
          };

          if (stage === "completed") {
              updates.status = "completed";
          } else if (stage === "failed") {
              updates.status = "failed";
          } else {
              updates.status = "processing";
          }

          await updateUploadJob(job._id, updates);
      };

        try {
          const onMemoryCreated = async (memory) => {
              await updateUploadJob(job._id, {
                  memoryId: memory._id,
              });
          };

          const memory = await memoryService.uploadMemory(
              req.file,
              req.user.id,
              onStage,
              onMemoryCreated
          );
          await updateUploadJob(job._id, { status: "completed", stage: "completed", message: "Completed", memoryId: memory._id });
        } catch (error) {
          console.error("Memory upload job failed", error.message);
          await updateUploadJob(job._id, { status: "failed", stage: "failed", message: "Upload failed", error: error.message });
        }
      });

    } catch (error) {

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message,
      });

    }
};

const getUploadStatus = async (req, res) => {
  try {
    const job = await UploadJob.findOne({ _id: req.params.jobId, userId: req.user.id }).lean();
    if (!job) return res.status(404).json({ success: false, message: "Upload job not found" });

    return res.status(200).json({
      success: true,
      data: {
        id: job._id,
        status: job.status,
        stage: job.stage,
        message: job.message,
        memoryId: job.memoryId,
        error: job.error,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMemories = async (req, res) => {

    try {

        const result =
            await memoryService.getUserMemories(
                req.user.id,
                req.query.fileType,
                req.query.limit
            );

        res.status(200).json({
            success: true,
            count: result.memories.length,
            totalCount: result.totalCount,
            favoriteCount: result.favoriteCount,
            categoryCount: result.categoryCount,
            data: result.memories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteMemory = async (req, res) => {

    try {

        const result =
            await memoryService.deleteMemory(
                req.params.id,
                req.user.id
            );

        res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });

    }

};

const searchMemories = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const memories = await memoryService.searchMemories(
      req.user.id,
      q.trim(),
      req.query.fileType
    );

    res.status(200).json({
      success: true,
      count: memories.length,
      data: memories,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMemoryDetails = async (req, res) => {
  try {
    const memory = await memoryService.getMemoryById(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: memory,
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getRelatedMemories = async (req, res) => {
  try {
    const memories = await memoryService.getRelatedMemories(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      count: memories.length,
      data: memories,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const memory = await memoryService.toggleFavorite(req.params.id, req.user.id);

    res.status(200).json({ success: true, data: memory });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

const createShare = async (req, res) => {
  try {
    const result = await memoryService.createShare(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

const disableShare = async (req, res) => {
  try {
    const memory = await memoryService.disableShare(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: memory });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadMemory,
  getUploadStatus,
  getMemories,
  deleteMemory,
  searchMemories,
  getMemoryDetails,
  getRelatedMemories,
  toggleFavorite,
  createShare,
  disableShare,
};
