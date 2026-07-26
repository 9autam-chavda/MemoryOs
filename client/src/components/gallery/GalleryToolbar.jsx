import { FileAudio, FileImage, FileText, Folder, Heart, LoaderCircle, Search, Upload } from "lucide-react";

import Button from "../ui/Button";

const filterIcons = {
  all: Folder,
  favorites: Heart,
  image: FileImage,
  pdf: FileText,
  audio: FileAudio,
  video: FileText,
  text: FileText,
};

function GalleryToolbar({ search, onSearchChange, onSubmit, fileType, filters, onFilterChange, searching, onUpload, recentSearches, onRecentSearch }) {
  return (
    <div className="space-y-3">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row" aria-label="Search memories">
        <div className="relative min-w-0 flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your memories"
            aria-label="Search memories"
            className="ui-input h-11 pl-11 pr-10 text-sm"
          />
          {searching && <LoaderCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[var(--accent)]" aria-label="Searching" />}
        </div>
        <Button type="button" variant="secondary" onClick={onUpload} className="shrink-0"><Upload size={16} strokeWidth={1.8} />Upload memory</Button>
      </form>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 premium-scrollbar" aria-label="Memory type filters">
        {filters.map((filter) => {
          const Icon = filterIcons[filter.value] || FileText;
          const active = fileType === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              aria-pressed={active}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition duration-200 ${active ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--surface-canvas)]" : "border-[var(--border-subtle)] bg-[var(--surface-overlay)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"}`}
            >
              <Icon size={14} strokeWidth={1.8} />{filter.label}
            </button>
          );
        })}
      </div>

      {recentSearches.length > 0 && !search && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs premium-scrollbar">
          <span className="shrink-0 text-[var(--text-tertiary)]">Recent</span>
          {recentSearches.slice(0, 4).map((item) => <button key={item} type="button" onClick={() => onRecentSearch(item)} className="shrink-0 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">{item}</button>)}
        </div>
      )}
    </div>
  );
}

export default GalleryToolbar;
