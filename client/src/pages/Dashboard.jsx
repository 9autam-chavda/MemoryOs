import { useEffect, useState } from "react";
import { Search, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import MemoryCard from "../components/memory/MemoryCard";
import UploadModal from "../components/upload/UploadModal";
import memoryService from "../services/memory.service";

function Dashboard() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await memoryService.getMemories();
        setMemories(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const recentMemories = memories.slice(0, 6);
  const pinnedMemories = memories.filter((memory) => memory.isPinned).slice(0, 3);
  const continueMemory = recentMemories[0];

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/gallery${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  const refreshMemories = async () => {
    const response = await memoryService.getMemories();
    setMemories(response.data);
  };

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-6xl space-y-12 py-8">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">What should you continue?</h1>
          <form onSubmit={handleSearch} className="mt-8">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-5 py-4 transition focus-within:bg-white/[0.08]">
              <Search size={20} className="text-zinc-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notes, screenshots, PDFs, audio..."
                className="min-w-0 flex-1 bg-transparent text-base text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </div>
          </form>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100"
            >
              <Upload size={16} />
              Upload
            </button>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        ) : (
          <>
            {continueMemory && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-100">Continue Working</h2>
                  <button type="button" onClick={() => navigate("/gallery")} className="text-sm text-zinc-500 transition hover:text-zinc-200">
                    View all
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
                  {recentMemories.slice(0, 3).map((memory) => (
                    <MemoryCard key={memory.id} memory={memory} />
                  ))}
                </div>
              </section>
            )}

            <section className="grid gap-10 xl:grid-cols-[1fr_2fr]">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Pinned Memories</h2>
                <div className="mt-4 space-y-3">
                  {(pinnedMemories.length ? pinnedMemories : recentMemories.slice(0, 3)).map((memory) => (
                    <button
                      key={memory.id}
                      type="button"
                      onClick={() => navigate(`/memory/${memory.id}`)}
                      className="block w-full rounded-lg px-1 py-2 text-left transition hover:bg-white/[0.04]"
                    >
                      <p className="truncate text-sm font-medium text-zinc-200">{memory.fileName}</p>
                      <p className="mt-1 text-xs text-zinc-600">{memory.category || memory.fileType || "Memory"}</p>
                    </button>
                  ))}
                  {memories.length === 0 && <p className="text-sm text-zinc-500">Upload a memory to begin.</p>}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Recent Uploads</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {recentMemories.slice(3, 7).map((memory) => (
                    <MemoryCard key={memory.id} memory={memory} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploadSuccess={refreshMemories} />
    </AppLayout>
  );
}

export default Dashboard;
