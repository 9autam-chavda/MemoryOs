import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/[0.06] bg-[var(--surface-sidebar)] px-4 sm:px-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-950 lg:hidden">
        M
      </div>

      <div className="text-sm text-zinc-500">Workspace</div>

      <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5">
        <div className="h-2 w-2 rounded-full bg-[var(--success)]" />
        <span className="max-w-28 truncate text-sm text-zinc-300">{user?.name || "Workspace"}</span>
      </div>
    </header>
  );
}

export default Navbar;
