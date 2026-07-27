const TYPE_ALIASES = {
  text: "document",
  other: "document",
};

export const getMediaType = (media) => TYPE_ALIASES[media?.resourceType || media?.fileType] || media?.resourceType || media?.fileType || "document";

export const getImageUrl = (media) => getMediaType(media) === "image" ? media?.previewUrl || media?.thumbnail || null : null;
export const getVideoUrl = (media) => getMediaType(media) === "video" ? media?.playbackUrl || media?.fileUrl || null : null;
export const getVideoThumbnail = (media) => getMediaType(media) === "video" ? media?.previewUrl || media?.thumbnail || null : null;
export const getPdfThumbnail = (media) => getMediaType(media) === "pdf" ? media?.previewUrl || media?.thumbnail || null : null;
export const getDownloadUrl = (media) => media?.downloadUrl || media?.fileUrl || null;
export const getOriginalUrl = (media) => media?.fileUrl || null;

export const getThumbnailUrl = (media) => {
  const type = getMediaType(media);
  if (type === "image") return getImageUrl(media);
  if (type === "video") return getVideoThumbnail(media);
  if (type === "pdf") return getPdfThumbnail(media);
  return null;
};

export const getFileIcon = (media) => getMediaType(media);
