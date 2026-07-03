import RelatedMemoryCard from "./RelatedMemoryCard";
import RelatedMemoryEmptyState from "./RelatedMemoryEmptyState";

function RelatedMemoryList({ memories, loading, onUploadClick }) {
  if (loading) {
    return (
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] p-4">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.06]" />
            <div className="mt-4 h-3 w-24 rounded-full bg-white/[0.06]" />
            <div className="mt-3 h-3 w-full rounded-full bg-white/[0.06]" />
            <div className="mt-2 h-3 w-4/5 rounded-full bg-white/[0.06]" />
          </div>
        ))}
      </div>
    );
  }

  if (!memories?.length) {
    return <RelatedMemoryEmptyState onUploadClick={onUploadClick} />;
  }

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {memories.map((memory) => (
        <RelatedMemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}

export default RelatedMemoryList;
