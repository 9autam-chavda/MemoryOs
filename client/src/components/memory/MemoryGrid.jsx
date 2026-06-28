import MemoryCard from "./MemoryCard";
import MemoryGridSkeleton from "./MemoryGridSkeleton";

function MemoryGrid({ memories, loading, search }) {

  if (loading) {
    return (
        <MemoryGridSkeleton />
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-20">

        <div className="text-7xl mb-4">
          📂
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          {search
            ? "No matching memories found"
            : "No memories yet"}
        </h2>

        <p className="text-gray-400">
          {search
            ? "Try a different search keyword."
            : "Upload your first memory to get started."}
        </p>

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
        />
      ))}

    </div>
  );
}

export default MemoryGrid;