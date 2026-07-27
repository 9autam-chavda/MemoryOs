import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut, Search, Settings, Sparkles } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

function Sidebar({ variant = "desktop", onNavigate }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isDrawer = variant === "drawer";

  const handleLogout = () => {
    logout();
    navigate("/");
    onNavigate?.();
  };

  const linkClass = ({ isActive }) =>
    `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-[var(--text-primary)] text-[var(--surface-canvas)]"
        : "text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
    }`;

  const navigationLink = (to, Icon, label) => (
    <NavLink to={to} className={linkClass} onClick={onNavigate}>
      <Icon size={17} aria-hidden="true" className="shrink-0" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className={`${isDrawer ? "h-full w-[280px]" : "w-60"} flex shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 py-4`}>
      <div className="mb-8 px-2">
        <p className="text-sm font-semibold text-[var(--text-primary)]">MemoryOS</p>
        <p className="mt-1 text-xs text-[var(--text-tertiary)]">AI second brain</p>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Primary">
        {navigationLink("/dashboard", Home, "Dashboard")}
        {navigationLink("/gallery", Search, "Search")}
        {navigationLink("/assistant", Sparkles, "Assistant")}
      </nav>

      <div className="mt-auto space-y-1">
        <button
          type="button"
          onClick={() => { navigate("/settings"); onNavigate?.(); }}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
        >
          <Settings size={16} aria-hidden="true" className="shrink-0" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} aria-hidden="true" className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
