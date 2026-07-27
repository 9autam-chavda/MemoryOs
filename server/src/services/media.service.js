const path = require("path");
const { cloudinary, assertCloudinaryConfigured } = require("../config/cloudinary");

const FOLDERS = {
  image: "memoryos/images",
  pdf: "memoryos/pdfs",
  video: "memoryos/videos",
  audio: "memoryos/audio",
  document: "memoryos/documents",
};

const createMediaError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const detectResourceType = (file) => {
  const mimeType = (file?.mimetype || "").toLowerCase();

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
};

const getCloudinaryResourceType = (resourceType) => {
  if (resourceType === "image" || resourceType === "pdf") return "image";
  if (resourceType === "video" || resourceType === "audio") return "video";
  return "raw";
};

const getFolder = (resourceType) => FOLDERS[resourceType] || FOLDERS.document;

const getImageUrl = (media, options = {}) => {
  if (!media?.publicId) return media?.secureUrl || media?.url || null;
  if (media.resourceType !== "image") {
    return media.secureUrl || media.url || null;
  }

  const transformation = {
    quality: "auto",
    fetch_format: "auto",
    width: options.width || 1200,
    crop: "limit",
  };

  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "image",
    transformation,
  });
};

const getPdfThumbnail = (media, options = {}) => {
  if (!media?.publicId || media.resourceType !== "pdf") return null;

  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "image",
    transformation: {
      quality: "auto",
      fetch_format: "auto",
      width: options.width || 640,
      crop: "limit",
      page: 1,
    },
  });
};

const getVideoUrl = (media) => {
  if (!media?.publicId || media.resourceType !== "video") return null;

  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "video",
    format: "mp4",
    transformation: {
      quality: "auto",
      video_codec: "auto",
    },
  });
};

const getVideoThumbnail = (media, options = {}) => {
  if (!media?.publicId || media.resourceType !== "video") return null;

  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "video",
    format: "jpg",
    transformation: {
      quality: "auto",
      width: options.width || 640,
      crop: "limit",
      start_offset: "auto",
    },
  });
};

const generateThumbnail = (media) => {
  if (media?.resourceType === "image") return getImageUrl(media, { width: 640 });
  if (media?.resourceType === "pdf") return getPdfThumbnail(media, { width: 640 });
  if (media?.resourceType === "video") return getVideoThumbnail(media, { width: 640 });
  return null;
};

const getPreviewUrl = (media) => generateThumbnail(media);

const getDownloadUrl = (media) => {
  if (!media?.publicId) return media?.secureUrl || media?.url || null;

  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: getCloudinaryResourceType(media.resourceType),
    flags: "attachment",
  });
};

const upload = async (file) => {
  if (!file?.buffer || !file.originalname) throw createMediaError("A file is required for upload", 400);

  assertCloudinaryConfigured();
  const resourceType = detectResourceType(file);
  const cloudinaryResourceType = getCloudinaryResourceType(resourceType);

  let result;
  try {
    result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: getFolder(resourceType),
          resource_type: "auto",
          use_filename: true,
          unique_filename: true,
          filename_override: file.originalname,
          timeout: 60000,
        },
        (error, uploadResult) => (error ? reject(error) : resolve(uploadResult))
      );
      stream.end(file.buffer);
    });
  } catch (error) {
    throw createMediaError(`Cloudinary upload failed: ${error.message}`, 502);
  }

  const media = {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    resourceType,
    format: result.format || path.extname(file.originalname).slice(1).toLowerCase(),
    bytes: result.bytes || file.size,
    width: result.width,
    height: result.height,
    duration: result.duration,
    originalFilename: file.originalname,
    mimeType: file.mimetype,
    provider: "cloudinary",
  };

  return {
    ...media,
    previewUrl: getPreviewUrl(media),
    playbackUrl: getVideoUrl(media),
    downloadUrl: getDownloadUrl(media),
  };
};

const deleteFile = async (publicId, resourceType) => {
  if (!publicId) return { result: "not_found" };
  assertCloudinaryConfigured();

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: getCloudinaryResourceType(resourceType),
      invalidate: true,
    });

    // Cloudinary reports an already-removed asset as `not found`; deletion is idempotent.
    return result;
  } catch (error) {
    console.error("Cloudinary asset deletion failed", {
      publicId,
      resourceType,
      message: error.message,
    });
    throw createMediaError("Unable to delete the Cloudinary asset", 502);
  }
};

module.exports = {
  upload,
  deleteFile,
  detectResourceType,
  generateThumbnail,
  getImageUrl,
  getVideoUrl,
  getVideoThumbnail,
  getPdfThumbnail,
  getDownloadUrl,
  getPreviewUrl,
};
