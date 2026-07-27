import { FileText, Image as ImageIcon, Music4, Play, Video } from "lucide-react";
import { useState } from "react";

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
    return <div className={`flex flex-col justify-between bg-[#111216] ${compact ? "p-2" : "p-5"} ${className}`}><div className="flex items-center justify-between"><Music4 size={compact ? 16 : 20} className="text-zinc-300" /><span className="text-[10px] uppercase text-zinc-400">Audio</span></div><div className="flex items-end gap-1">{[35, 62, 44, 78, 52, 86, 48, 68].map((height, index) => <span key={index} className="h-8 flex-1 rounded-full bg-[var(--accent)]/70" style={{ height: `${height}%` }} />)}</div></div>;
  }

  if (!canRenderImage) {
    return <div className={`flex items-center justify-center bg-[var(--surface-muted)] text-[var(--text-tertiary)] ${className}`}><Icon size={compact ? 18 : 30} /></div>;
  }

  return <div className={`relative overflow-hidden bg-[var(--surface-muted)] ${className}`}><img src={thumbnailUrl} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />{type === "video" && <span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-950"><Play size={15} fill="currentColor" /></span></span>}{type === "pdf" && <span className="absolute left-3 top-3 rounded-md bg-zinc-950/85 px-2 py-1 text-[11px] font-medium uppercase text-white">PDF</span>}</div>;
}

export default MediaThumbnail;
