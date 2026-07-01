import { useEffect, useState } from "react";
import { ArrowRight, Search, Upload } from "lucide-react";
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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 py-4 sm:py-6">
        <section className="rounded-[2rem] border border-white/[0.06] bg-[var(--surface-panel)] px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--accent)]">AI second brain</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">What should I continue?</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Pick up from the latest memory, note, or document without losing context.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]"
            >
              <Upload size={16} />
              Upload
            </button>
          </div>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/[0.07] bg-zinc-950/70 px-4 py-3">
              <Search size={18} className="text-zinc-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search across notes, documents, screenshots, and audio"
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
              Search
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-500">
            {[
              "What did I save about onboarding?",
              "Find recent invoices",
              "Summarize the meeting notes",
            ].map((item) => (
              <button key={item} type="button" onClick={() => navigate(`/gallery?q=${encodeURIComponent(item)}`)} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 transition hover:border-white/[0.12] hover:text-zinc-200">
                {item}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-[1.5rem] border border-white/[0.05] bg-white/[0.03]" />
            ))}
          </div>
        ) : (
          <>
            {continueMemory && (
              <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <button type="button" onClick={() => navigate(`/memory/${continueMemory.id}`)} className="group rounded-[1.75rem] border border-white/[0.06] bg-[var(--surface-panel)] p-5 text-left transition hover:border-white/[0.12]">
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>Continue working</span>
                    <span className="transition group-hover:text-zinc-200">Open</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">{continueMemory.fileName}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{continueMemory.summary || "Open this memory to review the extracted context and continue from where you left off."}</p>
                  <div className="mt-5 flex items-center gap-3 text-sm text-zinc-500">
                    <span>{continueMemory.category || "Memory"}</span>
                    <span>•</span>
                    <span>{continueMemory.createdAt ? new Date(continueMemory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Today"}</span>
                  </div>
                </button>

                <div className="rounded-[1.75rem] border border-white/[0.06] bg-[var(--surface-panel)] p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-zinc-100">Pinned memories</h2>
                    <button type="button" onClick={() => navigate("/gallery")} className="text-sm text-zinc-500 transition hover:text-zinc-200">
                      View all
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {(pinnedMemories.length ? pinnedMemories : recentMemories.slice(0, 3)).map((memory) => (
                      <button
                        key={memory.id}
                        type="button"
                        onClick={() => navigate(`/memory/${memory.id}`)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white/[0.04]"
                      >
                        <span className="truncate text-zinc-300">{memory.fileName}</span>
                        <span className="text-zinc-500">{memory.category || memory.fileType || "Memory"}</span>
                      </button>
                    ))}
                    {memories.length === 0 && <p className="px-3 py-2 text-sm text-zinc-500">Upload a memory to begin.</p>}
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-[1.75rem] border border-white/[0.06] bg-[var(--surface-panel)] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-100">Recent uploads</h2>
                <button type="button" onClick={() => navigate("/gallery")} className="text-sm text-zinc-500 transition hover:text-zinc-200">
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
