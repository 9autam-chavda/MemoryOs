import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Heart } from "lucide-react";
import toast from "react-hot-toast";

import memoryService from "../../services/memory.service";

import ImagePreview from "./previews/ImagePreview";
import PdfPreview from "./previews/PdfPreview";
import AudioPreview from "./previews/AudioPreview";
import VideoPreview from "./previews/VideoPreview";
import TextPreview from "./previews/TextPreview";

function MemoryCard({ memory }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(!!memory.isFavorite);
  const [toggling, setToggling] = useState(false);
  const createdDate = memory.createdAt
    ? new Date(memory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "Today";
  const summary = memory.summary || memory.extractedText || "Open to review the full context.";

  const renderPreview = () => {
    switch (memory.fileType) {
      case "image":
        return <ImagePreview fileUrl={memory.fileUrl} fileName={memory.fileName} />;
      case "pdf":
        return <PdfPreview fileUrl={memory.fileUrl} fileName={memory.fileName} />;
      case "audio":
        return <AudioPreview memory={memory} />;
      case "video":
        return <VideoPreview fileUrl={memory.fileUrl} fileName={memory.fileName} memory={memory} />;
      case "text":
        return <TextPreview memory={memory} />;
      default:
        return <TextPreview memory={memory} />;
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open memory ${memory.fileName}`}
      onClick={() => navigate(`/memory/${memory.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/memory/${memory.id}`);
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-panel)] text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-panel-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
    >
      <div className="relative">
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              if (toggling) return;
              setToggling(true);
              setIsFavorite((s) => !s);
              try {
                const res = await memoryService.toggleFavorite(memory.id);
                const nowFav = res.data?.isFavorite;
                toast.success(nowFav ? "Added to favorites" : "Removed from favorites");
              } catch (err) {
                setIsFavorite((s) => !s);
                toast.error(err.response?.data?.message || "Failed to update favorite");
              } finally {
                setToggling(false);
              }
            }}
            disabled={toggling}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] transition duration-200 ${isFavorite ? "scale-105 bg-red-600/20 text-red-300 shadow-md" : "bg-white/[0.04] text-zinc-300 hover:scale-105 hover:bg-white/[0.08]"} ${toggling ? "cursor-wait" : ""}`}
          >
            <Heart className={`transition-colors ${isFavorite ? "text-red-400" : "text-zinc-300"}`} size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="relative overflow-hidden">
          {renderPreview()}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-200">{memory.category || "Memory"}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 text-sm font-medium leading-6 text-[var(--text-primary)]">{memory.fileName}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-tertiary)]">{summary}</p>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5"><CalendarDays size={13} strokeWidth={1.8} /> {createdDate}</span>
            <span className="truncate">{memory.fileType || "file"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MemoryCard;
