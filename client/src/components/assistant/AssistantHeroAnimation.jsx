import { Bot } from "lucide-react";

export default function AssistantHeroAnimation() {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Glow */}
        <div className="absolute h-16 w-16 rounded-full bg-[var(--accent-soft)] blur-2xl animate-ai-float" />

        {/* Main Circle */}
        <div
          className="
            relative
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-[var(--border-subtle)]
            bg-[var(--surface-elevated)]
            shadow-lg
            animate-ai-float
          "
        >
          <Bot
            size={20}
            strokeWidth={2}
            className="text-[var(--accent)]"
          />
        </div>
      </div>
    </div>
  );
}