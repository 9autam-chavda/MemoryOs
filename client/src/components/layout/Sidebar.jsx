import { NavLink, useNavigate } from "react-router-dom";
import { Home, Library, LogOut, Search, Settings } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white text-zinc-950"
        : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
    }`;

  return (
    <aside className="hidden w-60 flex-col border-r border-white/[0.06] bg-[var(--surface-sidebar)] px-3 py-4 lg:flex">
      <div className="mb-8 px-2">
        <p className="text-sm font-semibold text-zinc-100">MemoryOS</p>
        <p className="mt-1 text-xs text-zinc-600">AI second brain</p>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Primary">
        <NavLink to="/dashboard" className={linkClass}>
          <Home size={17} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/gallery" className={linkClass}>
          <Search size={17} />
          <span>Search</span>
        </NavLink>

        <NavLink to="/library" className={linkClass}>
          <Library size={17} />
          <span>Library</span>
        </NavLink>
      </nav>

      <div className="mt-auto space-y-1">
        <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200">
          <Settings size={16} />
          Settings
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
