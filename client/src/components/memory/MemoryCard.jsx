import { useNavigate } from "react-router-dom";
import { Bookmark, Brain, CalendarDays, Eye, FileText, MoreHorizontal, Network, Sparkles } from "lucide-react";

import ImagePreview from "./previews/ImagePreview";
import PdfPreview from "./previews/PdfPreview";
import AudioPreview from "./previews/AudioPreview";
import VideoPreview from "./previews/VideoPreview";
import TextPreview from "./previews/TextPreview";

function MemoryCard({ memory }) {
  const navigate = useNavigate();
  const createdDate = memory.createdAt
    ? new Date(memory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "Today";
  const tags = memory.tags?.slice(0, 3) || [];
  const status = memory.processingStatus || "completed";
  const summary = memory.summary || memory.extractedText || "AI summary will appear after the memory is processed.";

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
    <article className="group overflow-hidden rounded-lg border border-white/[0.07] bg-[var(--surface-panel)] text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[var(--surface-panel-raised)]">
      <button type="button" onClick={() => navigate(`/memory/${memory.id}`)} className="block w-full text-left">
        <div className="relative overflow-hidden">
          {renderPreview()}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium uppercase text-white backdrop-blur">
              {memory.category || "Memory"}
            </span>
            <span className="rounded-md border border-white/10 bg-black/55 px-2 py-1 text-[11px] uppercase text-white/80">
              {status}
            </span>
          </div>
          <div className="absolute right-3 top-3 flex translate-y-1 gap-1 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur" title="Quick preview">
              <Eye size={15} />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur" title="Bookmark">
              <Bookmark size={15} />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur" title="More actions">
              <MoreHorizontal size={15} />
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-base font-semibold leading-6 text-zinc-100">{memory.fileName}</h2>
            <span className="shrink-0 rounded-md border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-2 py-1 text-[11px] font-medium text-blue-200">
              <Sparkles size={12} className="mr-1 inline" />
              AI
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{summary}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} className="rounded-md bg-white/[0.045] px-2 py-1 text-xs text-zinc-400">
                  {tag}
                </span>
              ))
            ) : (
              <span className="rounded-md bg-white/[0.045] px-2 py-1 text-xs text-zinc-500">tags pending</span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {createdDate}</span>
            <span className="flex items-center gap-1.5"><FileText size={13} /> {memory.wordCount || 0}</span>
            <span className="flex items-center gap-1.5"><Network size={13} /> Related</span>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-md bg-white/[0.035] px-2.5 py-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><Brain size={13} /> Semantic score</span>
            <span className="font-medium text-zinc-300">Ready</span>
          </div>
        </div>
      </button>
    </article>
  );
}

export default MemoryCard;
