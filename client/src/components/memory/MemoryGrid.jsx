import { FileQuestion, SearchX } from "lucide-react";

import MemoryCard from "./MemoryCard";
import MemoryGridSkeleton from "./MemoryGridSkeleton";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

function MemoryGrid({ memories, loading, search, onUpload }) {
  if (loading) {
    return <MemoryGridSkeleton />;
  }

  if (memories.length === 0) {
    return <EmptyState compact icon={search ? SearchX : FileQuestion} title={search ? "No matching memories" : "Your library is empty"} description={search ? "Try another search or adjust the file type filter." : "Upload a memory to make it available in your library."} action={!search && <Button variant="secondary" onClick={onUpload}>Upload memory</Button>} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}

export default MemoryGrid;
