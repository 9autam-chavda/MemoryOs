import { Music2 } from "lucide-react";

function AudioThumbnail({ duration }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_55%)]" />

      {/* Decorative Circles */}
      <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

      {/* Music Icon */}
      <Music2 className="h-24 w-24 text-white/90 drop-shadow-xl" strokeWidth={1.8} />

      {/* Duration */}
      {duration && (
        <div className="absolute bottom-4 left-4 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {duration}
        </div>
      )}

      {/* AUDIO Badge */}
      <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
        Audio
      </div>
    </div>
  );
}

export default AudioThumbnail;