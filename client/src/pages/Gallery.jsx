import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, Clock3, FileAudio, FileImage, FileText, Film, Folder, LoaderCircle, Search, Upload } from "lucide-react";

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
  const firstLoadRef = useRef(true);
  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = localStorage.getItem("memoryos-recent-searches");
    return stored ? JSON.parse(stored) : [];
  });

  const filters = [
    { value: "all", label: "All", icon: Folder },
    { value: "image", label: "Images", icon: FileImage },
    { value: "pdf", label: "PDFs", icon: FileText },
    { value: "audio", label: "Audio", icon: FileAudio },
    { value: "video", label: "Video", icon: Film },
    { value: "text", label: "Text", icon: FileText },
  ];

  const suggestedSearches = [
    "What decisions did I save this week?",
    "Find research about onboarding",
    "Summarize recent meeting transcripts",
    "Show documents related to invoices",
  ];

  const loadMemories = useCallback(async (query = "", initialLoad = false) => {
    try {
      if (initialLoad) {
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
  }, [fileType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMemories(search, firstLoadRef.current);
      firstLoadRef.current = false;
    }, 300);

    return () => clearTimeout(timer);
  }, [search, loadMemories]);

  const saveRecentSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const next = [trimmed, ...recentSearches.filter((item) => item !== trimmed)].slice(0, 5);
    setRecentSearches(next);
    localStorage.setItem("memoryos-recent-searches", JSON.stringify(next));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      saveRecentSearch(trimmed);
    }
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    saveRecentSearch(value);
  };

  const handleUploadSuccess = () => {
    setIsUploadOpen(false);
    loadMemories(search);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-96 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] px-6">
          <div className="flex items-center gap-3 text-zinc-300">
            <LoaderCircle size={20} className="animate-spin text-[var(--accent)]" />
            <div>
              <p className="font-medium">Preparing your memory library</p>
              <p className="text-sm text-zinc-500">Loading summaries, extracted text, and semantic metadata...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="rounded-lg border border-white/[0.07] bg-[var(--surface-panel)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--accent)]">Semantic search</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">Ask your memories anything.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Search by meaning across OCR, transcripts, summaries, tags, categories, and embeddings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              <Upload size={16} />
              Upload memory
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="mt-6">
            <div className="flex items-center gap-3 rounded-lg border border-white/[0.1] bg-zinc-950 px-4 py-3 transition focus-within:border-[var(--accent)]/70">
              <Search size={20} className="text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ask in natural language: What did I save about product strategy?"
                className="min-w-0 flex-1 bg-transparent text-base text-zinc-100 outline-none placeholder:text-zinc-600"
              />
              {searchLoading && <LoaderCircle size={17} className="animate-spin text-[var(--accent)]" />}
              <button type="submit" className="hidden rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 sm:inline-flex">
                Search
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedSearches.map((item) => (
              <button key={item} type="button" onClick={() => handleSuggestionClick(item)} className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-sm text-zinc-400 transition hover:border-white/[0.14] hover:text-zinc-100">
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_18rem]">
          <div>
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-1 rounded-lg border border-white/[0.07] bg-white/[0.035] p-1">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setFileType(filter.value)}
                      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                        fileType === filter.value ? "bg-white text-zinc-950" : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                      }`}
                    >
                      <Icon size={15} />
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Clock3 size={15} />
                <span>{searchLoading ? "Searching semantically..." : search ? `Results for "${search}"` : "Browsing all indexed memories"}</span>
              </div>
            </div>

            {search && (
              <div className="mb-4 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4">
                <div className="flex items-start gap-3">
                  <Brain size={18} className="mt-0.5 text-blue-200" />
                  <div>
                    <p className="text-sm font-medium text-blue-100">AI answer preview</p>
                    <p className="mt-1 text-sm leading-6 text-blue-100/70">
                      MemoryOS found {memories.length} candidate {memories.length === 1 ? "memory" : "memories"}. A synthesized RAG answer can be generated here when chat is enabled.
                    </p>
                  </div>
                  <span className="ml-auto rounded-md bg-blue-500/20 px-2 py-1 text-xs text-blue-100">High confidence</span>
                </div>
              </div>
            )}

            <MemoryGrid memories={memories} loading={searchLoading} search={search} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-zinc-100">Recent searches</p>
              <div className="mt-3 space-y-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((item) => (
                    <button key={item} type="button" onClick={() => handleSuggestionClick(item)} className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200">
                      <span className="truncate">{item}</span>
                      <ArrowRight size={14} />
                    </button>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-zinc-500">Search history appears here after your first query.</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-zinc-100">Shortcuts</p>
              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <div className="flex items-center justify-between"><span>Command menu</span><kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 text-xs">Ctrl K</kbd></div>
                <div className="flex items-center justify-between"><span>Focus search</span><kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 text-xs">/</kbd></div>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploadSuccess={handleUploadSuccess} />
    </AppLayout>
  );
}

export default Gallery;