import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ScanSearch,
  BrainCircuit,
  Settings2,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/branding/mos.svg";

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
    `group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[var(--text-primary)] text-[var(--surface-canvas)] shadow-sm"
        : "text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
    }`;

  const navigationLink = (to, Icon, label) => (
    <NavLink
      to={to}
      className={linkClass}
      onClick={onNavigate}
    >
      <Icon
        size={18}
        strokeWidth={2}
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside
      className={`${
        isDrawer ? "h-full w-[280px]" : "w-60"
      } flex shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 py-4`}
    >
      {/* Brand */}

      <div className="mb-8 px-2">
        <img
          src={logo}
          alt="MemoryOS"
          className="h-10 w-10 object-contain"
        />

        <h1 className="mt-4 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          MemoryOS
        </h1>
      </div>

      {/* Navigation */}

      <nav
        className="flex flex-col gap-1"
        aria-label="Primary"
      >
        {navigationLink(
          "/dashboard",
          LayoutGrid,
          "Dashboard"
        )}

        {navigationLink(
          "/gallery",
          ScanSearch,
          "Search"
        )}

        {navigationLink(
          "/assistant",
          BrainCircuit,
          "Assistant"
        )}
      </nav>

      {/* Footer */}

      <div className="mt-auto space-y-1">
        <button
          type="button"
          onClick={() => {
            navigate("/settings");
            onNavigate?.();
          }}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
        >
          <Settings2
            size={18}
            strokeWidth={2}
          />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut
            size={18}
            strokeWidth={2}
          />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;