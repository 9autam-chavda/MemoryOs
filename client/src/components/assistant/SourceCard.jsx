import { ArrowUpRight, FileText, Image as ImageIcon, Music4, Video } from "lucide-react";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { getFileIcon } from "../../utils/media.util";

const iconMap = { image: ImageIcon, audio: Music4, video: Video, pdf: FileText, document: FileText };

function SourceCard({ source, onOpen }) { const match = Number(source.similarity); const Icon = iconMap[getFileIcon(source)] || FileText; return <Card as="button" interactive type="button" onClick={onOpen} className="group flex w-full items-center gap-3 rounded-[var(--radius-md)] p-3 text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--surface-muted)] text-[var(--text-secondary)]"><Icon size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-[var(--text-primary)]">{source.title}</span><span className="mt-1 flex flex-wrap items-center gap-1.5">{source.category && <Badge>{source.category}</Badge>}{Number.isFinite(match) && <span className="text-xs text-[var(--text-tertiary)]">Matched {Math.round(match * 100)}%</span>}</span></span><span className="inline-flex items-center gap-1 text-xs text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]">Open <ArrowUpRight size={13} /></span></Card>; }
export default SourceCard;
