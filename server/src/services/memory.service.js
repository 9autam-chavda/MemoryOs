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

const getUserMemories = async (userId) => {
    return await MemoryItem.find({
        userId
    })
    .sort({
        createdAt: -1
    });
};

module.exports = {
  uploadMemory,
  getUserMemories,
};