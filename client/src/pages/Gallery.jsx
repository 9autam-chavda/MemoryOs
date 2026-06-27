import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import MemoryCard from "../components/memory/MemoryCard";
import UploadModal from "../components/upload/UploadModal";
import memoryService from "../services/memory.service";

function Gallery() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMemories();
  }, [search]);

  const loadMemories = async () => {
    try {
      setLoading(true);

      const response = search.trim()
        ? await memoryService.searchMemories(search)
        : await memoryService.getMemories();

      setMemories(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadOpen(false);
    loadMemories();
  };

  if (loading) {
    return (
      <AppLayout>
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold">
          Gallery
        </h1>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition"
        >
          + Upload Memory
        </button>

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search OCR text..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          mb-8
          p-3
          rounded-lg
          bg-zinc-900
          border
          border-zinc-700
          focus:outline-none
          focus:border-blue-500
        "
      />

      {/* Empty State */}
      {memories.length === 0 ? (

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

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
            />
          ))}

        </div>

      )}

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

    </AppLayout>
  );
}

export default Gallery;