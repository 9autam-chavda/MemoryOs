import { useEffect, useState } from "react";
import { ArrowRight, Clock3, Files, Heart, Pin, Search, Sparkles, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import MemoryCard from "../components/memory/MemoryCard";
import StatCard from "../components/ui/StatCard";
import UploadModal from "../components/upload/UploadModal";
import memoryService from "../services/memory.service";

function Dashboard() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Dashboard - MemoryOS";
  }, []);

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
  const favoriteCount = memories.filter((memory) => memory.isFavorite).length;
  const pinnedCount = memories.filter((memory) => memory.isPinned).length;
  const searchableTypes = new Set(memories.map((memory) => memory.fileType || memory.category).filter(Boolean)).size;
  const displayPinnedMemories = pinnedMemories.length ? pinnedMemories : recentMemories.slice(0, 3);

  
  const refreshMemories = async () => {
    const response = await memoryService.getMemories();
    setMemories(response.data);
  };

  return (
    <AppLayout>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 py-3 sm:gap-6 sm:py-5">
        

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-[1.5rem] border border-[var(--border-subtle)] bg-white/[0.03]" />
            ))}
          </div>
        ) : (
          <>
            {continueMemory && (
              <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <button
                  type="button"
                  onClick={() => navigate(`/memory/${continueMemory.id}`)}
                  className="group min-h-72 rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-panel-raised)] sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                      <Clock3 size={15} strokeWidth={1.8} />
                      Continue working
                    </span>
                    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--text-secondary)] transition group-hover:border-[var(--border-strong)] group-hover:text-[var(--text-primary)]">
                      Open
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </span>
                  </div>
                  <h2 className="mt-5 line-clamp-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">{continueMemory.fileName}</h2>
                  <p className="mt-3 line-clamp-4 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{continueMemory.summary || "Open this memory to review the extracted context and continue from where you left off."}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[var(--text-tertiary)]">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-white/[0.03] px-3 py-1">{continueMemory.category || "Memory"}</span>
                    <span>{continueMemory.createdAt ? new Date(continueMemory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Today"}</span>
                  </div>
                </button>

                <div className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">Pinned memories</h2>
                    <button type="button" onClick={() => navigate("/gallery")} className="text-sm font-medium text-[var(--text-tertiary)] transition duration-200 hover:text-[var(--text-primary)]">
                      View all
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {displayPinnedMemories.map((memory) => (
                      <button
                        key={memory.id}
                        type="button"
                        onClick={() => navigate(`/memory/${memory.id}`)}
                        className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-sm transition duration-200 hover:border-[var(--border-subtle)] hover:bg-white/[0.04]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-[var(--text-primary)]">{memory.fileName}</span>
                          <span className="mt-1 block text-xs text-[var(--text-tertiary)]">{memory.createdAt ? new Date(memory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Today"}</span>
                        </span>
                        <span className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-white/[0.03] px-2.5 py-1 text-xs text-[var(--text-secondary)]">{memory.category || memory.fileType || "Memory"}</span>
                      </button>
                    ))}
                    {memories.length === 0 && <p className="px-3 py-2 text-sm text-[var(--text-tertiary)]">Upload a memory to begin.</p>}
                  </div>
                </div>
              </section>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total memories" value={memories.length} detail="Indexed and ready to search" icon={Files} />
              <StatCard title="Favorites" value={favoriteCount} detail={favoriteCount === 0 ? "No saved favorites yet" : "Quick-access memories"} icon={Heart} />
              <StatCard title="Pinned" value={pinnedCount} detail={pinnedCount === 0 ? "Recent memories shown instead" : "Kept close on the dashboard"} icon={Pin} />
              <StatCard title="Memory types" value={searchableTypes} detail="Formats represented in your library" icon={Sparkles} />
            </section>

            <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Recent uploads</h2>
                <button type="button" onClick={() => navigate("/gallery")} className="text-sm font-medium text-[var(--text-tertiary)] transition duration-200 hover:text-[var(--text-primary)]">
                  Open library
                </button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recentMemories.slice(0, 3).map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
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
