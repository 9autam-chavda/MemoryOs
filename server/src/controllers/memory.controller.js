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

module.exports = {
  uploadMemory,
};