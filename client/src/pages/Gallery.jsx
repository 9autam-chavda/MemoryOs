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

  const filters = [
    { value: "all", label: "All" },
    { value: "image", label: "🖼 Images" },
    { value: "pdf", label: "📄 PDFs" },
    { value: "audio", label: "🎵 Audio" },
    { value: "video", label: "🎬 Videos" },
    { value: "text", label: "📝 Text" },
  ];

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
        ? await memoryService.searchMemories(query, fileType)
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
      <div className="flex flex-col gap-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-extrabold tracking-tight">
              Gallery
            </h1>

            <p className="text-gray-400 mt-2">
              Search and manage all your memories.
            </p>

          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="
              bg-blue-600
              hover:bg-blue-700
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
              shadow-lg
              shadow-blue-500/20
            "
          >
            + Upload Memory
          </button>

        </div>

        {/* Search */}

        <div className="relative">

          <input
            type="text"
            placeholder="🔍 Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              px-5
              py-4
              text-lg
              focus:border-blue-500
              focus:outline-none
            "
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-3">

          {filters.map((filter) => (

            <button
              key={filter.value}
              onClick={() => setFileType(filter.value)}
              className={`
                px-5
                py-3
                rounded-full
                font-medium
                transition-all
                duration-300
                ${
                  fileType === filter.value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }
              `}
            >
              {filter.label}
            </button>

          ))}

        </div>

        {/* Search Status */}

        <div className="h-5">

          {searchLoading && (
            <p className="text-sm text-blue-400">
              Searching...
            </p>
          )}

        </div>

      </div>

      {/* Memories */}

      <div className="mt-6">

        <MemoryGrid
          memories={memories}
          loading={searchLoading}
          search={search}
        />

      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

    </AppLayout>
  );
}

export default Gallery;