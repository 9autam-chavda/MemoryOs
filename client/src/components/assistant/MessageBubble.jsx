import { Bot, Copy, RotateCw } from "lucide-react";
import MarkdownAnswer from "./MarkdownAnswer";
import SourceCard from "./SourceCard";
import Button from "../ui/Button";
function MessageBubble({ message, onOpenSource, onRetry, onRegenerate }) {
  if (message.role === "user") return <div className="ml-auto max-w-[82%] rounded-[var(--radius-md)] bg-[var(--surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-primary)] sm:max-w-[65%]">{message.content}</div>;
  if (message.role === "error") return <div className="max-w-xl rounded-[var(--radius-md)] border border-red-500/25 bg-red-500/10 p-4 text-sm text-[var(--danger)]"><p>{message.content}</p>{onRetry && <Button variant="ghost" className="mt-2 min-h-8 px-2 text-[var(--danger)]" onClick={onRetry}><RotateCw size={14} />Retry</Button>}</div>;
  return <article className="group max-w-3xl"><div className="mb-3 flex items-center gap-2"><Bot size={15} className="text-[var(--text-tertiary)]" /><span className="text-sm font-medium text-[var(--text-primary)]">Assistant</span><div className="ml-auto flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100"><Button variant="ghost" className="min-h-7 px-2 text-xs" onClick={() => navigator.clipboard?.writeText(message.content)}> <Copy size={13} />Copy</Button>{onRegenerate && <Button variant="ghost" className="min-h-7 px-2 text-xs" onClick={onRegenerate}><RotateCw size={13} />Regenerate</Button>}</div></div><MarkdownAnswer content={message.content} />{message.sources?.length > 0 && <div className="mt-6"><p className="mb-2 text-xs font-medium text-[var(--text-tertiary)]">Referenced memories</p><div className="space-y-2">{message.sources.map((source) => <SourceCard key={source.id} source={source} onOpen={() => onOpenSource(source.id)} />)}</div></div>}</article>;
}
export default MessageBubble;
