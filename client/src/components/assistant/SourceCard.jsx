import { ArrowUpRight, FileText } from "lucide-react";

function SourceCard({ source, onOpen }) {
  return <button type="button" onClick={onOpen} className="group flex w-full items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-white/[0.02] p-3 text-left transition hover:border-[var(--border-strong)] hover:bg-white/[0.05]">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"><FileText size={16} /></span>
    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-[var(--text-primary)]">{source.fileName}</span><span className="mt-0.5 block text-xs text-[var(--text-tertiary)]">{Math.round(Number(source.similarity || 0) * 100)}% relevant</span></span>
    <ArrowUpRight size={15} className="text-[var(--text-tertiary)] transition group-hover:text-[var(--text-primary)]" />
  </button>;
}

export default SourceCard;
