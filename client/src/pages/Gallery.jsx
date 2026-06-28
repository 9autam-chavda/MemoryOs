import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import MemoryGrid from "../components/memory/MemoryGrid";
import UploadModal from "../components/upload/UploadModal";
import memoryService from "../services/memory.service";

function Gallery() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMemories(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fileType]);

  const loadMemories = async (query = "") => {
    try {

      if (loading) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }

      const response = query.trim()
        ? await memoryService.searchMemories( query,fileType)
        : await memoryService.getMemories(fileType);

      setMemories(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
      setSearchLoading(false);

    }
  };

  const handleUploadSuccess = () => {
    setIsUploadOpen(false);
    loadMemories(search);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-96">
          <h1 className="text-3xl font-bold">
            Loading memories...
          </h1>
        </div>
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

      {/* File Type Filters */}
      <div className="flex gap-3 mb-6">

        {["all", "image", "pdf"].map((type) => (

          <button
            key={type}
            onClick={() => setFileType(type)}
            className={`
              px-4
              py-2
              rounded-full
              transition
              ${
                fileType === type
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }
            `}
          >
            {type === "all" && "All"}
            {type === "image" && "🖼 Images"}
            {type === "pdf" && "📄 PDFs"}
          </button>

        ))}

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search OCR text..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          p-3
          rounded-lg
          bg-zinc-900
          border
          border-zinc-700
          focus:outline-none
          focus:border-blue-500
        "
      />

      {/* Search Status */}
      <div className="h-6 mt-2 mb-6">

        {searchLoading && (
          <p className="text-sm text-blue-400">
            Searching...
          </p>
        )}

      </div>

      {/* Memory Grid */}
      <MemoryGrid
        memories={memories}
        loading={searchLoading}
        search={search}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

    </AppLayout>
  );
}

export default Gallery;