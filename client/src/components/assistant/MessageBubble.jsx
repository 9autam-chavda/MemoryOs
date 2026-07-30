import { Copy, RotateCw } from "lucide-react";
import MarkdownAnswer from "./MarkdownAnswer";
import SourceCard from "./SourceCard";
import Button from "../ui/Button";

function MessageBubble({
  message,
  onOpenSource,
  onRetry,
  onRegenerate,
}) {
  if (message.role === "user") {
    return (
      <div
        className="
          ml-auto
          max-w-[90%]
          sm:max-w-[72%]

          rounded-3xl

          border
          border-[var(--border-subtle)]

          bg-[var(--surface-panel-raised)]

          px-5
          py-4

          text-[15px]
          leading-7

          text-[var(--text-primary)]

          shadow-sm
        "
      >
        {message.content}
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div
        className="
          max-w-xl

          rounded-3xl

          border
          border-red-500/25

          bg-red-500/10

          p-5
        "
      >
        <p className="text-sm text-[var(--danger)]">
          {message.content}
        </p>

        {onRetry && (
          <Button
            variant="ghost"
            onClick={onRetry}
            className="mt-4 min-h-9 px-3 text-[var(--danger)]"
          >
            <RotateCw size={14} />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <article className="group w-full max-w-4xl">

      <div className="mb-4 flex items-center">

        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[var(--text-tertiary)]
          "
        >
          Assistant
        </span>

        <div
          className="
            ml-auto
            flex
            gap-2

            opacity-60

            transition-all
            duration-200

            group-hover:opacity-100
          "
        >
          <Button
            variant="ghost"
            className="min-h-8 px-3 text-xs"
            onClick={() =>
              navigator.clipboard?.writeText(message.content)
            }
          >
            <Copy size={13} />
            Copy
          </Button>

          {onRegenerate && (
            <Button
              variant="ghost"
              className="min-h-8 px-3 text-xs"
              onClick={onRegenerate}
            >
              <RotateCw size={13} />
              Regenerate
            </Button>
          )}
        </div>

      </div>

      <div className="rounded-2xl">
        <MarkdownAnswer content={message.content} />
      </div>

            {message.sources?.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[var(--text-tertiary)]
              "
            >
              Sources
            </span>

            <span className="text-xs text-[var(--text-tertiary)]">
              {message.sources.length} reference
              {message.sources.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {message.sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                onOpen={() => onOpenSource(source.id)}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export default MessageBubble;