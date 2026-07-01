function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/70 animate-pulse">
      <div className="h-48 bg-zinc-800/90" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded-full bg-zinc-800" />
        <div className="h-4 w-1/2 rounded-full bg-zinc-800" />
        <div className="h-4 w-2/3 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

function MemoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default MemoryGridSkeleton;