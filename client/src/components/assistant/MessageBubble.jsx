import { Bot, LoaderCircle } from "lucide-react";
import MarkdownAnswer from "./MarkdownAnswer";
import SourceCard from "./SourceCard";

function MessageBubble({ message, onOpenSource }) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[88%] rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm leading-6 text-white">
        {message.content}
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
        {message.content}
      </div>
    );
  }

  if (message.role === "loading") {
    return (
      <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
        <LoaderCircle size={17} className="animate-spin text-[var(--accent)]" />
        Searching your memories and writing an answer…
      </div>
    );
  }

  return (
    <article className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Bot size={16} />
        </span>
        <span className="text-sm font-medium text-[var(--text-primary)]">MemoryOS</span>
      </div>

      <MarkdownAnswer content={message.content} />

      {message.sources?.length > 0 && (
        <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            Sources
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {message.sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                onOpen={() => {
  console.log("Clicked source:", source);
  onOpenSource(source.id);
}}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default MessageBubble;