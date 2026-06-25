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

        imageKitFileId: 
          result.fileId,

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

const deleteMemory = async (memoryId, userId) => {

    const memory = await MemoryItem.findById(memoryId);

    if (!memory) {
        throw new Error("Memory not found");
    }

    if (memory.userId.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    await imagekit.deleteFile(memory.imageKitFileId);

    await MemoryItem.findByIdAndDelete(memoryId);

    return {
        message: "Memory deleted successfully"
    };
};

module.exports = {
  uploadMemory,
  getUserMemories,
  deleteMemory,
};