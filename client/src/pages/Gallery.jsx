import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Clock3, FileAudio, FileImage, FileText, Film, Folder, LoaderCircle, Search, Upload } from "lucide-react";

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
        <div className="flex h-96 items-center justify-center rounded-[2rem] border border-white/[0.06] bg-white/[0.02] px-6">
          <div className="flex items-center gap-3 text-zinc-300">
            <LoaderCircle size={18} className="animate-spin text-[var(--accent)]" />
            <div>
              <p className="font-medium">Preparing your memory library</p>
              <p className="text-sm text-zinc-500">Loading summaries, extracted text, and semantic metadata.</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-5">
        <section className="rounded-[2rem] border border-white/[0.06] bg-[var(--surface-panel)] px-5 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-[var(--accent)]">Search</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">What are you looking for?</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">Search by meaning across extracted text, summaries, and metadata.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="mx-auto mt-7 max-w-3xl">
            <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/[0.08] bg-zinc-950/80 px-4 py-4">
              <Search size={18} className="text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="What did I save about machine learning?"
                className="min-w-0 flex-1 bg-transparent text-base text-zinc-100 outline-none placeholder:text-zinc-600"
              />
              {searchLoading && <LoaderCircle size={17} className="animate-spin text-[var(--accent)]" />}
              <button type="submit" className="hidden rounded-full bg-white px-3.5 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 sm:inline-flex">
                Search
              </button>
            </div>
          </form>

          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
            {suggestedSearches.map((item) => (
              <button key={item} type="button" onClick={() => handleSuggestionClick(item)} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-400 transition hover:border-white/[0.12] hover:text-zinc-200">
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setFileType(filter.value)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      fileType === filter.value ? "bg-white text-zinc-950" : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <Icon size={14} />
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock3 size={15} />
              <span>{searchLoading ? "Searching..." : search ? `Results for “${search}”` : "Browsing all indexed memories"}</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 4).map((item) => (
                <button key={item} type="button" onClick={() => handleSuggestionClick(item)} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-zinc-500 transition hover:border-white/[0.12] hover:text-zinc-200">
                  {item}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setIsUploadOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]">
              <Upload size={15} />
              Upload memory
            </button>
          </div>

          <MemoryGrid memories={memories} loading={searchLoading} search={search} />
        </section>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploadSuccess={handleUploadSuccess} />
    </AppLayout>
  );
}

export default Gallery;