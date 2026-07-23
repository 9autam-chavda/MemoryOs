import { Plus, MessageSquare, Trash2 } from "lucide-react";

function AssistantSidebar({ sessions, currentSession, onSelectSession, onNewSession , onDeleteSession }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-panel)]">
      <div className="p-3">
        <button
          type="button"
          onClick={onNewSession}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {sessions.map((session) => {
          const isActive = currentSession?._id === session._id;

          return (
            <button
              key={session._id}
              type="button"
              onClick={() => onSelectSession(session)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.05] hover:text-[var(--text-primary)]"
              }`}
            >
              <MessageSquare size={15} className="shrink-0" />
              <div className="flex flex-1 items-center justify-between gap-2">
                <span className="truncate">
                    {session.title || "Untitled session"}
                </span>

                <Trash2
                    size={15}
                    className="opacity-60 transition hover:opacity-100"
                    onClick={(event) => {
                    event.stopPropagation();
                    onDeleteSession(session);
                    }}
                />
                </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default AssistantSidebar;