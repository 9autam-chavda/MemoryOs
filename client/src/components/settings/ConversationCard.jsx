import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import HistoryActionBar from "./HistoryActionBar";

function ConversationCard({ session, isEditing, onOpen, onStartRename, onCancelRename, onSaveRename, onDelete }) {
  const [draftTitle, setDraftTitle] = useState(session.title); const inputRef = useRef(null);
  useEffect(() => { if (isEditing) { 
    setDraftTitle(session.title); requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select(); }); } }, [isEditing, session.title]);
  const commit = () => { const title = draftTitle.trim(); if (!title || title === session.title) { onCancelRename(); return; } onSaveRename(session, title); };
  const open = () => { if (!isEditing) onOpen(session._id); };
  return <div className="group flex min-h-16 items-center gap-3 border-b border-[var(--border-subtle)] px-2 py-3 transition-colors duration-150 last:border-b-0 hover:bg-[var(--surface-overlay)]"><button type="button" onClick={open} aria-label={`Open conversation ${session.title}`} className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-muted)] text-[var(--text-secondary)]"><MessageSquare size={16} /></span><span className="min-w-0 flex-1">{isEditing ? <input ref={inputRef} value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); inputRef.current?.blur(); } if (event.key === "Escape") { setDraftTitle(session.title); onCancelRename(); } }} onBlur={commit} className="ui-input h-8 px-2 text-sm font-medium" /> : <span className="block truncate text-[15px] font-medium text-[var(--text-primary)]">{session.title}</span>}<span className="mt-1 block text-[13px] text-[var(--text-tertiary)]">{new Date(session.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></span></button><HistoryActionBar renameDisabled={isEditing} onOpen={() => onOpen(session._id)} onRename={() => onStartRename(session._id)} onDelete={() => onDelete(session)} /></div>;
}
export default ConversationCard;
