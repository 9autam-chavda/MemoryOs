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
    <article className="group overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-[var(--surface-panel)] text-left transition hover:border-white/[0.12]">
      <div className="relative">
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation();
            // navigate when clicking card body below; this button is just wrapper top area
          }}
          className="block h-full w-full text-left"
        >
          <div className="absolute right-3 top-3 z-10">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (toggling) return;
                setToggling(true);
                // optimistic
                setIsFavorite((s) => !s);
                try {
                  const res = await memoryService.toggleFavorite(memory.id);
                  toast.success(res.message || (res.data?.isFavorite ? "Added to favorites" : "Removed from favorites"));
                } catch (err) {
                  // revert on error
                  setIsFavorite((s) => !s);
                  toast.error(err.response?.data?.message || "Failed to update favorite");
                } finally {
                  setToggling(false);
                }
              }}
              aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform ${isFavorite ? "bg-red-600/20 text-red-300 shadow-md scale-105" : "bg-white/[0.03] text-zinc-300 hover:scale-105"}`}
            >
              <Heart className={`transition-colors ${isFavorite ? "text-red-400" : "text-zinc-300"}`} size={18} />
            </button>
          </div>
        </button>

        <button type="button" onClick={() => navigate(`/memory/${memory.id}`)} className="block h-full w-full text-left">
        <div className="relative overflow-hidden">
          {renderPreview()}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-200">{memory.category || "Memory"}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 text-sm font-medium leading-6 text-zinc-100">{memory.fileName}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">{summary}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {createdDate}</span>
            <span>{memory.fileType || "file"}</span>
          </div>
        </div>
        </button>
      </div>
    </article>
  );
}

export default MemoryCard;
