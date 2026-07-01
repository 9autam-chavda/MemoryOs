import { Play } from "lucide-react";

function VideoPreview({ fileUrl, fileName, memory }) {
  const duration = memory?.metadata?.duration ? `${Math.round(memory.metadata.duration)}s` : "Video";

  return (
    <div className="relative h-48 overflow-hidden bg-zinc-950">
      {fileUrl ? (
        <video src={fileUrl} className="h-full w-full object-cover opacity-85" preload="metadata" muted playsInline />
      ) : (
        <div className="h-full w-full bg-zinc-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
      <div className="absolute left-4 bottom-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950">
          <Play size={15} fill="currentColor" />
        </span>
        <span className="max-w-48 truncate text-sm font-medium text-white">{fileName || "Video memory"}</span>
      </div>
      <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-[11px] uppercase text-white">{duration}</span>
    </div>
  );
}

export default VideoPreview;
