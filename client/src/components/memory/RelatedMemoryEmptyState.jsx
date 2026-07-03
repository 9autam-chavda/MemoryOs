function RelatedMemoryEmptyState({ onUploadClick }) {
  return (
    <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/[0.12] bg-white/[0.03] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5A2.5 2.5 0 0 1 6.5 4h5A2.5 2.5 0 0 1 14 6.5v2.75H6.5A2.5 2.5 0 0 0 4 11.75V18.5A2.5 2.5 0 0 0 6.5 21h5A2.5 2.5 0 0 0 14 18.5v-1.75" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 8.25h10A2.5 2.5 0 0 1 22.5 10.75v7.75A2.5 2.5 0 0 1 20 21h-10" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-100">No Related Memories Yet</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">Upload more files to improve AI recommendations and build a richer second brain.</p>
      <button
        type="button"
        onClick={onUploadClick}
        className="mt-5 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]"
      >
        Upload Memory
      </button>
    </div>
  );
}

export default RelatedMemoryEmptyState;
