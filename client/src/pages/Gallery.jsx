import { useCallback, useEffect, useRef, useState } from "react";
import { Clock3 } from "lucide-react";

import GalleryToolbar from "../components/gallery/GalleryToolbar";
import GalleryToolbarSkeleton from "../components/gallery/GalleryToolbarSkeleton";
import AppLayout from "../components/layout/AppLayout";
import MemoryGrid from "../components/memory/MemoryGrid";
import UploadModal from "../components/upload/UploadModal";
import memoryService from "../services/memory.service";
import {subscribeMemoryUpdated} from "../utils/events";


const filters = [
  { value: "all", label: "All" },
  { value: "favorites", label: "Favorites" },
  { value: "image", label: "Images" },
  { value: "pdf", label: "PDFs" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "text", label: "Text" },
];

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

  useEffect(() => {
    document.title = search ? "Search · MemoryOS" : "Gallery · MemoryOS";
  }, [search]);
  

  const loadMemories = useCallback(async (query = "", initialLoad = false) => {
    try {
      if (initialLoad) setLoading(true);
      else setSearchLoading(true);
      const response = query.trim() ? await memoryService.searchMemories(query, fileType) : await memoryService.getMemories(fileType);
      setMemories(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [fileType]);

  useEffect(() => {
  const unsubscribe = subscribeMemoryUpdated(() => {
    loadMemories(search);
  });

  return unsubscribe;
}, [loadMemories, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMemories(search, firstLoadRef.current);
      firstLoadRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [search, loadMemories]);

  const saveRecentSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentSearches.filter((item) => item !== trimmed)].slice(0, 5);
    setRecentSearches(next);
    localStorage.setItem("memoryos-recent-searches", JSON.stringify(next));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    saveRecentSearch(search);
  };

  

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 py-3 sm:py-5">
        <header className="flex items-end justify-between gap-4">
          <div><h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">Gallery</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Your memory library</p></div>
          {!loading && <div className="hidden items-center gap-1.5 text-sm text-[var(--text-tertiary)] sm:flex"><Clock3 size={15} strokeWidth={1.8} />{searchLoading ? "Searching" : `${memories.length} ${memories.length === 1 ? "memory" : "memories"}`}</div>}
        </header>

        {loading ? <GalleryToolbarSkeleton /> : <GalleryToolbar search={search} onSearchChange={setSearch} onSubmit={handleSearchSubmit} fileType={fileType} filters={filters} onFilterChange={setFileType} searching={searchLoading} onUpload={() => setIsUploadOpen(true)} recentSearches={recentSearches} onRecentSearch={(value) => { setSearch(value); saveRecentSearch(value); }} />}

        <MemoryGrid memories={memories} loading={loading || searchLoading} search={search} onUpload={() => setIsUploadOpen(true)} />
      </div>
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </AppLayout>
  );
}

export default Gallery;
