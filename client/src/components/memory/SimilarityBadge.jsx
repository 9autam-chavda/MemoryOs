function SimilarityBadge({ score }) {
  if (score === undefined || score === null || Number.isNaN(Number(score))) return null;
  const safeScore = Number(score) || 0;

  const tone = safeScore >= 95
    ? { label: `${safeScore}% Match`, className: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20" }
    : safeScore >= 90
      ? { label: `${safeScore}% Match`, className: "bg-sky-500/15 text-sky-300 ring-sky-500/20" }
      : safeScore >= 80
        ? { label: `${safeScore}% Match`, className: "bg-violet-500/15 text-violet-300 ring-violet-500/20" }
        : safeScore >= 65
          ? { label: `${safeScore}% Match`, className: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/20" }
          : { label: "Low match", className: "bg-zinc-700/40 text-zinc-400 ring-zinc-600/30" };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${tone.className}`} title={`${safeScore}% semantic match`}>
      {tone.label}
    </span>
  );
}

export default SimilarityBadge;
