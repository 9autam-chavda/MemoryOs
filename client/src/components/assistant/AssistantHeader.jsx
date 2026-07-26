import { Plus } from "lucide-react";
import Button from "../ui/Button";

function AssistantHeader({ onNewSession }) {
  return <header className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3"><div><p className="text-sm font-medium text-[var(--text-primary)]">Assistant</p><p className="mt-0.5 text-xs text-[var(--text-tertiary)]">Connected to memory library</p></div><Button variant="ghost" onClick={onNewSession} className="min-h-8 px-2.5 text-xs"><Plus size={14} />New session</Button></header>;
}
export default AssistantHeader;
