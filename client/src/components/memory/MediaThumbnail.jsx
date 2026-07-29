import { FileText, Image as ImageIcon, Music4, Play, Video } from "lucide-react";
import { useState } from "react";
import AudioThumbnail from "./AudioThumbnail";

import { getFileIcon, getMediaType, getThumbnailUrl } from "../../utils/media.util";

const iconMap = {
  image: ImageIcon,
  pdf: FileText,
  audio: Music4,
  video: Video,
  document: FileText,
};

function MediaThumbnail({ memory, className = "h-48", compact = false }) {
  const [failed, setFailed] = useState(false);
  const type = getMediaType(memory);
  const thumbnailUrl = getThumbnailUrl(memory);
  const Icon = iconMap[getFileIcon(memory)] || FileText;
  const canRenderImage = thumbnailUrl && !failed;

  if (type === "audio") {
    const duration = memory?.metadata?.duration || memory?.duration;

    const formattedDuration = duration
      ? `${Math.floor(duration / 60)}:${String(Math.round(duration % 60)).padStart(2, "0")}`
      : null;

    return (
      <div className={className}>
        <AudioThumbnail duration={formattedDuration} />
      </div>
    );
  }

  if (!canRenderImage) {
    return <div className={`flex items-center justify-center bg-[var(--surface-muted)] text-[var(--text-tertiary)] ${className}`}><Icon size={compact ? 18 : 30} /></div>;
  }

  return <div className={`relative overflow-hidden bg-[var(--surface-muted)] ${className}`}><img src={thumbnailUrl} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />{type === "video" && <span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-950"><Play size={15} fill="currentColor" /></span></span>}{type === "pdf" && <span className="absolute left-3 top-3 rounded-md bg-zinc-950/85 px-2 py-1 text-[11px] font-medium uppercase text-white">PDF</span>}</div>;
}

export default MediaThumbnail;
