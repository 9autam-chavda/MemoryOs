import { ArrowUpRight, FileText, Image as ImageIcon, Music4, Film, FileCode2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SimilarityBadge from "./SimilarityBadge";

const iconMap = {
  image: ImageIcon,
  pdf: FileText,
  audio: Music4,
  video: Film,
  text: FileCode2,
  other: FileText,
};

function RelatedMemoryCard({ memory }) {
  const navigate = useNavigate();
  const Icon = iconMap[memory.fileType] || FileText;
  const createdAt = memory.createdAt ? new Date(memory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently added";

  return (
    <button
      type="button"
      onClick={() => navigate(`/memory/${memory.id}`)}
      className="group relative overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] p-4 text-left shadow-[0_10px_50px_rgba(0,0,0,0.12)] transition duration-200 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_18px_60px_rgba(0,0,0,0.16)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
      aria-label={`Open related memory ${memory.fileName}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {memory.thumbnail ? (
            <img src={memory.thumbnail} alt="" className="h-12 w-12 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-zinc-950/70 text-zinc-300">
              <Icon size={18} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-100">{memory.fileName}</p>
            <p className="mt-1 truncate text-xs text-zinc-500">{memory.category || "Memory"}</p>
          </div>
        </div>
        <SimilarityBadge score={memory.similarity} />
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">{memory.summary || "This memory may contain context that complements the current one."}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {memory.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>{createdAt}</span>
        <span className="inline-flex items-center gap-1 text-zinc-400 transition group-hover:translate-x-0.5">
          Open <ArrowUpRight size={13} />
        </span>
      </div>
    </button>
  );
}

export default RelatedMemoryCard;
