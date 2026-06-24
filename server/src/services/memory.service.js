const imagekit = require(
  "../config/imagekit"
);

const MemoryItem = require(
  "../models/MemoryItem"
);

const uploadMemory =
  async (file, userId) => {

    const result =
      await imagekit.upload({
        file:
          file.buffer,
        fileName:
          file.originalname,
      });

    const memory =
      await MemoryItem.create({
        userId,

        fileName:
          file.originalname,

        fileUrl:
          result.url,

        type:
          "screenshot",
      });

    return memory;
};

module.exports = {
  uploadMemory,
};