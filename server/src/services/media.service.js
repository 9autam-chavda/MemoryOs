const path = require("path");
const { cloudinary, assertCloudinaryConfigured } = require("../config/cloudinary");

const FOLDERS = {
  image: "memoryos/images",
  pdf: "memoryos/pdfs",
  video: "memoryos/videos",
  audio: "memoryos/audio",
  text: "memoryos/text",
  document: "memoryos/documents",
};

const createMediaError = (message, status = 500) => Object.assign(new Error(message), { status });

// This is the application contract. Cloudinary's resource_type is deliberately
// derived from it and is never exposed as a UI/content classification.
const getFileType = (mimeType = "") => {
  const normalizedMimeType = mimeType.toLowerCase();
  if (normalizedMimeType.startsWith("image/")) return "image";
  if (normalizedMimeType === "application/pdf") return "pdf";
  if (normalizedMimeType.startsWith("audio/")) return "audio";
  if (normalizedMimeType.startsWith("video/")) return "video";
  if (normalizedMimeType === "text/plain" || normalizedMimeType === "text/markdown") return "text";
  return "document";
};

const getCloudinaryResourceType = (fileType) => {
  if (fileType === "image" || fileType === "pdf") return "image";
  if (fileType === "video" || fileType === "audio") return "video";
  return "raw";
};

const getStoredCloudinaryResourceType = (media, fileType) =>
  media?.cloudinaryResourceType || getCloudinaryResourceType(fileType || media?.resourceType);

const getFolder = (fileType) => FOLDERS[fileType] || FOLDERS.document;

const getImageUrl = (media, options = {}) => {
  if (!media?.publicId) return media?.secureUrl || media?.url || null;
  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "image",
    transformation: { quality: "auto", fetch_format: "auto", width: options.width || 1200, crop: "limit" },
  });
};

const getPdfThumbnail = (media, options = {}) => {
  if (!media?.publicId) return null;
  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "image",
    format: "jpg",
    transformation: { quality: "auto", width: options.width || 640, crop: "limit", page: 1 },
  });
};

const getVideoUrl = (media) => {
  if (!media?.publicId) return media?.secureUrl || media?.url || null;
  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "video",
    format: "mp4",
    transformation: { quality: "auto", video_codec: "auto" },
  });
};

const getVideoThumbnail = (media, options = {}) => {
  if (!media?.publicId) return null;
  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: "video",
    format: "jpg",
    transformation: { quality: "auto", width: options.width || 640, crop: "limit", start_offset: "auto" },
  });
};

const getThumbnailUrl = (media, fileType) => {
  if (fileType === "image") return getImageUrl(media, { width: 640 });
  if (fileType === "pdf") return getPdfThumbnail(media, { width: 640 });
  if (fileType === "video") return getVideoThumbnail(media, { width: 640 });
  return null;
};

const getDownloadUrl = (media, fileType) => {
  if (!media?.publicId) return media?.secureUrl || media?.url || null;
  return cloudinary.url(media.publicId, {
    secure: true,
    resource_type: getStoredCloudinaryResourceType(media, fileType),
    flags: "attachment",
  });
};

const toClientMedia = (media, fileType) => {
  if (!media) return null;
  const originalUrl = media.secureUrl || media.url || null;
  return {
    originalUrl,
    streamUrl: fileType === "video" ? getVideoUrl(media) : originalUrl,
    thumbnailUrl: getThumbnailUrl(media, fileType),
    downloadUrl: getDownloadUrl(media, fileType),
  };
};

const upload = async (file, fileType = getFileType(file?.mimetype)) => {
  if (!file?.buffer || !file.originalname) throw createMediaError("A file is required for upload", 400);
  assertCloudinaryConfigured();

  let result;
  try {
    result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        folder: getFolder(fileType),
        resource_type: getCloudinaryResourceType(fileType),
        use_filename: true,
        unique_filename: true,
        filename_override: file.originalname,
        timeout: 60000,
      }, (error, uploadResult) => (error ? reject(error) : resolve(uploadResult)));
      stream.end(file.buffer);
    });
  } catch (error) {
    throw createMediaError(`Cloudinary upload failed: ${error.message}`, 502);
  }

  

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    // Kept only to delete pre-refactor records. New records use the explicitly
    // provider-scoped field below.
    resourceType: fileType,
    cloudinaryResourceType: result.resource_type || getCloudinaryResourceType(fileType),
    format: result.format || path.extname(file.originalname).slice(1).toLowerCase(),
    bytes: result.bytes || file.size,
    width: result.width,
    height: result.height,
    duration: result.duration,
    originalFilename: file.originalname,
    mimeType: file.mimetype,
    provider: "cloudinary",
  };
};

const deleteFile = async (media, fileType) => {
  if (!media?.publicId) return { result: "not_found" };
  assertCloudinaryConfigured();
  try {
    return await cloudinary.uploader.destroy(media.publicId, {
      resource_type: getStoredCloudinaryResourceType(media, fileType),
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloudinary asset deletion failed", { publicId: media.publicId, message: error.message });
    throw createMediaError("Unable to delete the Cloudinary asset", 502);
  }
};

module.exports = { upload, deleteFile, getFileType, getCloudinaryResourceType, getImageUrl, getVideoUrl, getVideoThumbnail, getPdfThumbnail, getThumbnailUrl, getDownloadUrl, toClientMedia };
