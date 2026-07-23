import { Send } from "lucide-react";

function AssistantComposer({ value, onChange, onSubmit, loading }) {
  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSubmit(); }
  };
  return <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-panel)] p-2 shadow-2xl shadow-black/10">
    <textarea value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={onKeyDown} rows={2} disabled={loading} placeholder="Ask about anything in your memories…" aria-label="Ask MemoryOS Assistant" className="min-h-16 w-full resize-none bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] disabled:opacity-60" />
    <div className="flex items-center justify-between px-2 pb-1"><span className="text-xs text-[var(--text-tertiary)]">Enter to send · Shift + Enter for a new line</span><button type="button" onClick={onSubmit} disabled={loading || !value.trim()} aria-label="Send question" className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white transition hover:brightness-110 disabled:opacity-40"><Send size={16} /></button></div>
  </div>;
}

export default AssistantComposer;
