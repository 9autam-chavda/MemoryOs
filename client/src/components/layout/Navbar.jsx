import { useAuth } from "../../contexts/AuthContext";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/branding/mos.svg";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/gallery": "Search",
  "/assistant": "Assistant",
  "/settings": "Settings",
};

function Navbar({
  isDesktop,
  onMenuClick,
  menuButtonRef,
  menuOpen,
}) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const pageTitle = pathname.startsWith("/memory/")
    ? "Memory Details"
    : pageTitles[pathname] || "Workspace";

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 sm:px-6 lg:h-14">

      <div className="flex items-center gap-3">

        {!isDesktop && (
          <>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={onMenuClick}
              className="ui-icon-button"
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              aria-controls="navigation-drawer"
              aria-expanded={menuOpen}
            >
              <Menu size={20} />
            </button>

            <img
              src={logo}
              alt="MemoryOS"
              className="h-8 w-8 object-contain"
            />
          </>
        )}

      </div>

      {!isDesktop && (
        <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-[var(--text-primary)]">
          {pageTitle}
        </p>
      )}

      {isDesktop && (
        <p className="text-sm text-[var(--text-tertiary)]">
          {pageTitle}
        </p>
      )}

      <div className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-overlay)] px-3 py-1.5">
        <div className="h-2 w-2 rounded-full bg-[var(--success)]" />
        <span className="max-w-28 truncate text-sm text-[var(--text-secondary)]">
          {user?.name || "Workspace"}
        </span>
      </div>
    </header>
  );
}

export default Navbar;