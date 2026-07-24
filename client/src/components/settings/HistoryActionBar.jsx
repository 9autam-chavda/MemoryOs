import { FolderOpen, Pencil, Trash2 } from "lucide-react";

function HistoryActionBar({ renameDisabled, onOpen, onRename, onDelete }) {
  const stop = (e) => e.stopPropagation();

  return (
    <div className="relative z-10 flex h-[38px] items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-hover)] px-2 opacity-0 shadow-md shadow-black/20 transition-all duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          onOpen();
        }}
        title="Open"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-panel)] hover:text-[var(--text-primary)]"
      >
        <FolderOpen size={16} />
      </button>

      <button
        type="button"
        disabled={renameDisabled}
        onClick={(e) => {
          stop(e);
          onRename();
        }}
        title="Rename"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-panel)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          stop(e);
          onDelete();
        }}
        title="Delete"
        className="flex h-7 w-7 items-center justify-center rounded-full text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default HistoryActionBar;