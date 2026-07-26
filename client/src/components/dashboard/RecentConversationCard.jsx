import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../ui/Card";

function RecentConversationCard({ session, preview }) {
  const navigate = useNavigate();
  const updatedAt = session.updatedAt
    ? new Date(session.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "Recently";

  return (
    <Card interactive className="overflow-hidden">
      <button
        type="button"
        onClick={() => navigate(`/assistant?session=${session._id}`)}
        className="flex w-full items-center gap-3 p-4 text-left focus:outline-none"
        aria-label={`Open assistant conversation ${preview || session.title || "Untitled conversation"}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]"><MessageSquare size={17} strokeWidth={1.8} /></span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--text-primary)]">{preview || session.title || "Untitled conversation"}</span>
          <span className="mt-1 block text-xs text-[var(--text-tertiary)]">Updated {updatedAt}</span>
        </span>
      </button>
    </Card>
  );
}

export default RecentConversationCard;
