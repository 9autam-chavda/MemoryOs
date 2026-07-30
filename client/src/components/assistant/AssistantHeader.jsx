import { MessageSquarePlus } from "lucide-react";
import Button from "../ui/Button";

function AssistantHeader({ onNewSession }) {
  return (
    <header
      className="
        sticky
        top-0
        z-30

        -mx-4
        mb-6

        flex
        items-center
        justify-between

        border-b
        border-[var(--border-subtle)]

        bg-[color:color-mix(in_srgb,var(--surface-canvas)_82%,transparent)]
        px-4
        py-4

        backdrop-blur-xl
        supports-[backdrop-filter]:bg-[color:color-mix(in_srgb,var(--surface-canvas)_72%,transparent)]
      "
    >
      <div>
        <h1
          className="
            text-lg
            font-semibold
            tracking-tight
            text-[var(--text-primary)]
          "
        >
          MemoryOS Assistant
        </h1>

      </div>

      <Button
        variant="secondary"
        onClick={onNewSession}
        className="
          min-h-10

          rounded-xl

          px-4

          text-sm
          font-medium
        "
      >
        <MessageSquarePlus size={16} />
        New Session
      </Button>
    </header>
  );
}

export default AssistantHeader;