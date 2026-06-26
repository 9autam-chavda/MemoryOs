const imagekit = require("../config/imagekit");

const uploadFile = async (file) => {
  const result = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
  });

  return {
    fileUrl: result.url,
    fileId: result.fileId,
    fileName: result.name,
  };
};

const deleteFile = async (fileId) => {
  await imagekit.deleteFile(fileId);
};

module.exports = {
  uploadFile,
  deleteFile,
};