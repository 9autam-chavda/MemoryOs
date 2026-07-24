import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import HistoryActionBar from "./HistoryActionBar";

function ConversationCard({
  session,
  isEditing,
  onOpen,
  onStartRename,
  onCancelRename,
  onSaveRename,
  onDelete,
}) {
  const [draftTitle, setDraftTitle] = useState(session.title);
  const inputRef = useRef(null);

  // Reset the draft and focus+select whenever this card ENTERS edit mode.
  // Runs only on the isEditing transition, not on every keystroke.
  useEffect(() => {
    if (isEditing) {
      setDraftTitle(session.title);
      // Wait a tick so the input is mounted before we focus it.
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isEditing, session.title]);

  const handleInfoClick = () => {
    if (isEditing) return; // don't navigate while editing
    onOpen(session._id);
  };

  const handleInfoKeyDown = (e) => {
    if (isEditing) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(session._id);
    }
  };

  const commit = () => {
    const trimmed = draftTitle.trim();

    if (!trimmed) {
      // Empty -> restore previous title, no API call
      onCancelRename();
      return;
    }

    if (trimmed === session.title) {
      // Unchanged -> just exit edit mode, no API call
      onCancelRename();
      return;
    }

    onSaveRename(session, trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur(); // triggers commit via onBlur
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDraftTitle(session.title);
      onCancelRename();
    }
  };

  return (
    <div
      className="group flex w-full items-center justify-between rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface-panel)] py-4 pl-5 pr-4 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-[var(--accent)]/60 hover:shadow-lg hover:shadow-black/10"
    >
      <div
        role={isEditing ? undefined : "button"}
        tabIndex={isEditing ? -1 : 0}
        onClick={handleInfoClick}
        onKeyDown={handleInfoKeyDown}
        className={`flex min-w-0 flex-1 items-center gap-3 outline-none ${
          isEditing ? "" : "cursor-pointer"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
          <MessageSquare size={18} />
        </div>

        <div className="min-w-0 flex-1 text-left">
          {isEditing ? (
            <input
              ref={inputRef}
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              onBlur={commit}
              className="w-full origin-left animate-[renameIn_150ms_ease-out] rounded-lg border border-transparent bg-transparent px-1 -ml-1 text-base font-semibold text-[var(--text-primary)] outline-none transition-colors duration-150 focus:border-[var(--accent)]/60"
            />
          ) : (
            <p className="truncate text-base font-semibold text-[var(--text-primary)]">
              {session.title}
            </p>
          )}

          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            {new Date(session.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <HistoryActionBar
        renameDisabled={isEditing}
        onOpen={() => onOpen(session._id)}
        onRename={() => onStartRename(session._id)}
        onDelete={() => onDelete(session)}
      />
    </div>
  );
}

export default ConversationCard;