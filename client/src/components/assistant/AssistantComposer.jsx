import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Button from "../ui/Button";

function AssistantComposer({
  value,
  onChange,
  onSubmit,
  loading,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      180
    )}px`;
  }, [value]);

  return (
    <div
      className="
        rounded-[28px]

        border
        border-[var(--border-subtle)]

        bg-[var(--surface-panel)]

        p-4

        transition-all
        duration-200

        hover:border-[var(--border-strong)]
        focus-within:border-[var(--accent)]
      "
    >
      <textarea
        ref={textareaRef}
        value={value}
        disabled={loading}
        rows={1}
        aria-label="Ask MemoryOS Assistant"
        placeholder="Search your memories or ask anything..."

        onChange={(e) => onChange(e.target.value)}

        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}

        className="
          min-h-16
          max-h-44

          w-full

          resize-none

          bg-transparent

          px-1
          py-1

          text-[15px]
          leading-7

          text-[var(--text-primary)]

          placeholder:text-[var(--text-tertiary)]

          outline-none
        "
      />

      <div className="mt-4 flex items-center justify-between">

        <span
          className="
            text-xs
            text-[var(--text-tertiary)]
          "
        >
          Press Enter to send
        </span>

        <Button
          type="button"
          disabled={loading || !value.trim()}
          onClick={onSubmit}
          aria-label="Send"

          className="
            h-12
            w-12

            rounded-2xl

            p-0
          "
        >
          <Send size={18} />
        </Button>

      </div>
    </div>
  );
}

export default AssistantComposer;