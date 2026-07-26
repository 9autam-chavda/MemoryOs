import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Button from "../ui/Button";

function AssistantComposer({ value, onChange, onSubmit, loading }) {
  const textareaRef = useRef(null);
  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`; } }, [value]);
  return <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-2 transition-colors focus-within:border-[var(--border-strong)]"><textarea ref={textareaRef} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSubmit(); } }} rows={1} disabled={loading} placeholder="Ask about your memories..." aria-label="Ask MemoryOS Assistant" className="min-h-14 max-h-45 w-full resize-none bg-transparent px-3 py-3 text-sm leading-6 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] disabled:opacity-60" /><div className="flex items-center justify-between gap-3 px-2 pb-1"><span className="text-xs text-[var(--text-tertiary)]">Enter to send · Shift + Enter for newline</span><Button onClick={onSubmit} disabled={loading || !value.trim()} aria-label="Send question" className="h-8 min-h-8 w-8 rounded-full p-0"><Send size={14} /></Button></div></div>;
}
export default AssistantComposer;
