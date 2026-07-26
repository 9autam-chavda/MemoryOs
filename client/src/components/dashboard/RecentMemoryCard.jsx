import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Badge from "../ui/Badge";
import Card from "../ui/Card";

function RecentMemoryCard({ memory }) {
  const navigate = useNavigate();
  const date = memory.createdAt
    ? new Date(memory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "Today";

  return (
    <Card interactive className="group overflow-hidden">
      <button
        type="button"
        onClick={() => navigate(`/memory/${memory.id}`)}
        className="block w-full text-left focus:outline-none"
        aria-label={`Open memory ${memory.fileName}`}
      >
        <div className="relative flex min-h-32 items-end overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
          {memory.fileType === "image" && memory.fileUrl && <img src={memory.fileUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-200 group-hover:scale-[1.02]" />}
          <Badge className="bg-[var(--surface-panel)]">{memory.fileType || memory.category || "Memory"}</Badge>
        </div>
        <div className="p-4">
          <h3 className="truncate text-sm font-medium text-[var(--text-primary)]">{memory.fileName}</h3>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]"><CalendarDays size={13} strokeWidth={1.8} />{date}</div>
        </div>
      </button>
    </Card>
  );
}

export default RecentMemoryCard;
