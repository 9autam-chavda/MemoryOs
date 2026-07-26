import { Check, FolderOpen, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

function HistoryActionBar({ renameDisabled, onOpen, onRename, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const stop = (event) => event.stopPropagation();
  if (confirming) return <div className="flex items-center gap-1" onClick={stop}><button type="button" onClick={() => { onDelete(); setConfirming(false); }} className="flex h-7 items-center gap-1 rounded-md px-1.5 text-xs text-[var(--danger)] transition hover:bg-red-500/10" aria-label="Confirm delete"><Check size={14} />Delete</button><button type="button" onClick={() => setConfirming(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-tertiary)] transition hover:bg-[var(--surface-overlay)]" aria-label="Cancel delete"><X size={14} /></button></div>;
  return <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"><button type="button" onClick={(event) => { stop(event); onOpen(); }} title="Open" className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-tertiary)] transition hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"><FolderOpen size={15} /></button><button type="button" disabled={renameDisabled} onClick={(event) => { stop(event); onRename(); }} title="Rename" className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-tertiary)] transition hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)] disabled:opacity-40"><Pencil size={15} /></button><button type="button" onClick={(event) => { stop(event); setConfirming(true); }} title="Delete" className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-tertiary)] transition hover:bg-red-500/10 hover:text-[var(--danger)]"><Trash2 size={15} /></button></div>;
}
export default HistoryActionBar;
