import { ArrowUpRight } from "lucide-react";
import Card from "../ui/Card";
function SuggestionCard({ children, onClick }) { return <Card as="button" interactive onClick={onClick} className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"><span className="truncate text-sm text-[var(--text-secondary)]">{children}</span><ArrowUpRight size={14} className="shrink-0 text-[var(--text-tertiary)]" /></Card>; }
export default SuggestionCard;
