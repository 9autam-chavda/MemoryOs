import { FileQuestion, SearchX } from "lucide-react";

import MemoryCard from "./MemoryCard";
import MemoryGridSkeleton from "./MemoryGridSkeleton";

function MemoryGrid({ memories, loading, search }) {
  if (loading) {
    return <MemoryGridSkeleton />;
  }

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-zinc-300">
          {search ? <SearchX size={20} /> : <FileQuestion size={20} />}
        </div>

        <h2 className="mt-5 text-xl font-semibold text-zinc-100">
          {search ? "No matching memories found" : "Your library is empty"}
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
          {search
            ? "Try a broader query or switch filters to surface more relevant context."
            : "Upload your first file and let MemoryOS extract and organize it for future recall."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}

export default MemoryGrid;
