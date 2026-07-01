import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

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
    </article>
  );
}

export default MemoryCard;
