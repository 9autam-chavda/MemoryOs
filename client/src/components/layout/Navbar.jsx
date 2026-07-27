import { useAuth } from "../../contexts/AuthContext";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/gallery": "Search",
  "/assistant": "Assistant",
  "/settings": "Settings",
};

function Navbar({ isDesktop, onMenuClick, menuButtonRef, menuOpen }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const pageTitle = pathname.startsWith("/memory/") ? "Memory details" : pageTitles[pathname] || "Workspace";

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 sm:px-6 lg:h-14 lg:pl-72">
      <div className="flex min-w-0 items-center gap-2">
        {!isDesktop && <button ref={menuButtonRef} type="button" onClick={onMenuClick} className="ui-icon-button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-controls="navigation-drawer" aria-expanded={menuOpen}>
          <Menu size={20} aria-hidden="true" />
        </button>}
        {!isDesktop && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--text-primary)] text-sm font-semibold text-[var(--surface-canvas)]">M</div>}
        {isDesktop && <p className="text-sm text-[var(--text-tertiary)]">Workspace</p>}
      </div>

      {!isDesktop && <p className="pointer-events-none absolute left-1/2 max-w-[45%] -translate-x-1/2 truncate text-sm font-medium text-[var(--text-primary)]">{pageTitle}</p>}

      <div className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-overlay)] px-2.5 py-1.5">
        <div className="h-2 w-2 rounded-full bg-[var(--success)]" />
        <span className="max-w-28 truncate text-sm text-[var(--text-secondary)]">{user?.name || "Workspace"}</span>
      </div>
    </header>
  );
}

export default Navbar;
