import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut, Search, Settings, Sparkles } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

function Sidebar({ variant = "desktop", onNavigate }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isCollapsed = variant === "collapsed";
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

  const labelClass = isCollapsed ? "sr-only" : "";
  const navigationLink = (to, Icon, label) => (
    <NavLink to={to} className={linkClass} onClick={onNavigate} title={isCollapsed ? label : undefined}>
      <Icon size={17} aria-hidden="true" className="shrink-0" />
      <span className={labelClass}>{label}</span>
    </NavLink>
  );

  return (
    <aside className={`${isDrawer ? "h-full w-[280px] rounded-r-2xl shadow-2xl" : isCollapsed ? "w-[72px]" : "w-60"} flex shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 py-4`}>
      <div className={`${isCollapsed ? "mb-8 flex justify-center px-0" : "mb-8 px-2"}`}>
        <p className={`font-semibold text-[var(--text-primary)] ${isCollapsed ? "text-sm" : "text-sm"}`}>{isCollapsed ? "M" : "MemoryOS"}</p>
        {!isCollapsed && <p className="mt-1 text-xs text-[var(--text-tertiary)]">AI second brain</p>}
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
          title={isCollapsed ? "Settings" : undefined}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
        >
          <Settings size={16} aria-hidden="true" className="shrink-0" />
          <span className={labelClass}>Settings</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} aria-hidden="true" className="shrink-0" />
          <span className={labelClass}>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
