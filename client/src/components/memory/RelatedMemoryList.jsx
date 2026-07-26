import RelatedMemoryCard from "./RelatedMemoryCard";
import RelatedMemoryEmptyState from "./RelatedMemoryEmptyState";
import Skeleton from "../ui/Skeleton";

function RelatedMemoryList({ memories, loading }) {
  if (loading) {
    return (
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3">
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!memories?.length) {
    return <RelatedMemoryEmptyState />;
  }

  return (
    <div className="mt-3 space-y-2">
      {memories.map((memory) => (
        <RelatedMemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}

export default RelatedMemoryList;
