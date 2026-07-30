function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-[subtle-pulse_1.2s_ease-in-out_infinite]" />

        <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-[subtle-pulse_1.2s_ease-in-out_180ms_infinite]" />

        <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-[subtle-pulse_1.2s_ease-in-out_360ms_infinite]" />
      </div>

      <span className="text-sm text-[var(--text-secondary)]">
        Searching your memories...
      </span>
    </div>
  );
}

export default TypingIndicator;