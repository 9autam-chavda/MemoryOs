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
                req.user.id
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

module.exports = {
  uploadMemory,
  getMemories,
};