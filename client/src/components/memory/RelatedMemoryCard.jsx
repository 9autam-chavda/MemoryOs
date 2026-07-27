import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SimilarityBadge from "./SimilarityBadge";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import MediaThumbnail from "./MediaThumbnail";

function RelatedMemoryCard({ memory }) {
  const navigate = useNavigate();
  const createdAt = memory.createdAt ? new Date(memory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently added";

  return (
    <Card
      as="button"
      interactive
      type="button"
      onClick={() => navigate(`/memory/${memory.id}`)}
      className="group w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
      aria-label={`Open related memory ${memory.fileName}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <MediaThumbnail memory={memory} className="h-12 w-12 rounded-2xl" compact />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{memory.fileName}</p>
            <p className="mt-1 truncate text-xs text-[var(--text-tertiary)]">{createdAt}</p>
          </div>
        </div>
        <SimilarityBadge score={memory.similarity} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2"><Badge>{memory.fileType || memory.category || "Memory"}</Badge><ArrowUpRight size={14} className="text-[var(--text-tertiary)]" /></div>
    </Card>
  );
}

export default RelatedMemoryCard;
