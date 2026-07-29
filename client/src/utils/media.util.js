const TYPE_ALIASES = { text: "document", other: "document" };

// fileType is the application's source of truth. In particular, Cloudinary
// stores audio as a video resource, which must never make it render as video.
export const getMediaType = (memory) => TYPE_ALIASES[memory?.fileType] || memory?.fileType || "document";

const getMedia = (memory) => memory?.media || {};

// During a rolling deploy, older API instances may still return `fileUrl`.
// This fallback is URL-shape compatibility only; fileType remains the sole
// rendering discriminator.
export const getOriginalUrl = (memory) => getMedia(memory).originalUrl || memory?.fileUrl || null;
export const getDownloadUrl = (memory) => getMedia(memory).downloadUrl || getOriginalUrl(memory);
export const getImageUrl = (memory) => getMediaType(memory) === "image" ? getOriginalUrl(memory) : null;
export const getVideoUrl = (memory) => getMediaType(memory) === "video" ? getMedia(memory).streamUrl || getOriginalUrl(memory) : null;
export const getVideoThumbnail = (memory) => getMediaType(memory) === "video" ? getMedia(memory).thumbnailUrl || null : null;
export const getPdfThumbnail = (memory) => getMediaType(memory) === "pdf" ? getMedia(memory).thumbnailUrl || null : null;
export const getThumbnailUrl = (memory) => {
  const type = getMediaType(memory);
  if (type === "image") return getImageUrl(memory);
  if (type === "video") return getVideoThumbnail(memory);
  if (type === "pdf") return getPdfThumbnail(memory);
  return null;
};
export const getFileIcon = getMediaType;
