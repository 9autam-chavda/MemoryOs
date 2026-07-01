import { useAuth } from "../../contexts/AuthContext";
import { Command, Search } from "lucide-react";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/[0.06] bg-[var(--surface-sidebar)] px-4 sm:px-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-950 lg:hidden">
        M
      </div>

      <div className="hidden w-full max-w-xl items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-zinc-500 md:flex">
        <Search size={15} />
        <span className="flex-1">Search MemoryOS</span>
        <kbd className="inline-flex items-center gap-1 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-zinc-400">
          <Command size={11} /> K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5">
          <div className="h-2 w-2 rounded-full bg-[var(--success)]" />
          <span className="max-w-28 truncate text-sm text-zinc-300">{user?.name || "Workspace"}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
