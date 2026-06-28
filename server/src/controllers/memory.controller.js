const memoryService =
  require(
    "../services/memory.service"
  );

const uploadMemory =
  async (req, res) => {
    try {

      const memory =
        await memoryService
          .uploadMemory(
            req.file,
            req.user.id
          );

      res.status(201).json({
        success: true,
        data: memory,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
};

const getMemories = async (req, res) => {

    try {

        const memories =
            await memoryService.getUserMemories(
                req.user.id,
                req.query.fileType
            );

        res.status(200).json({
            success: true,
            count: memories.length,
            data: memories
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

        res.status(400).json({
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

module.exports = {
  uploadMemory,
  getMemories,
  deleteMemory,
  searchMemories,
  getMemoryDetails,
};