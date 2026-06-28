function SkeletonCard() {
  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        overflow-hidden
        animate-pulse
      "
    >
      {/* Image */}
      <div className="h-56 bg-zinc-800"></div>

      {/* Content */}
      <div className="p-4">

        <div className="h-5 w-3/4 bg-zinc-800 rounded mb-4"></div>

        <div className="h-4 w-1/2 bg-zinc-800 rounded mb-2"></div>

        <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>

      </div>
    </div>
  );
}

function MemoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {[...Array(6)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}

    </div>
  );
}

export default MemoryGridSkeleton;