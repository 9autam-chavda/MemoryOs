import { AudioLines } from "lucide-react";

function AudioPreview({ memory }) {
  const bars = [38, 62, 48, 74, 42, 88, 58, 66, 34, 72, 52, 84, 46, 64, 40, 58, 78, 50];
  const duration = memory?.metadata?.duration ? `${Math.round(memory.metadata.duration)}s` : "Audio";

  return (
    <div className="flex h-48 flex-col justify-between bg-[#111216] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-300">
          <AudioLines size={20} />
        </div>
        <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[11px] uppercase text-zinc-400">{duration}</span>
      </div>
      <div className="flex h-20 items-end gap-1">
        {bars.map((height, index) => (
          <span
            key={index}
            className="w-full rounded-full bg-[var(--accent)]/70"
            style={{ height: `${height}%`, animation: index % 3 === 0 ? "subtle-pulse 2.4s ease-in-out infinite" : undefined }}
          />
        ))}
      </div>
      <p className="truncate text-sm font-medium text-zinc-300">{memory?.fileName || "Audio memory"}</p>
    </div>
  );
}

export default AudioPreview;
