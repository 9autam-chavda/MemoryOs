import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UploadManager from "../upload/UploadManager";

function AppLayout({
  children,
  hideNavigation = false,
  hideUploadManager = false,
}) {
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia("(min-width: 1024px)").matches
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const closeDrawer = () => setIsSidebarOpen(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateViewport = (event) => {
      setIsDesktop(event.matches);

      if (event.matches) {
        setIsSidebarOpen(false);
      }
    };

    updateViewport(mediaQuery);

    mediaQuery.addEventListener("change", updateViewport);

    return () =>
      mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (isDesktop || !isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDrawer();
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    drawerRef.current?.querySelector("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [isDesktop, isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-canvas)] text-[var(--text-primary)]">

      {/* Desktop Sidebar */}

      {!hideNavigation && isDesktop && <Sidebar />}

      {/* Right Section */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {!hideNavigation && (
          <Navbar
            isDesktop={isDesktop}
            onMenuClick={() => setIsSidebarOpen(true)}
            menuButtonRef={menuButtonRef}
            menuOpen={isSidebarOpen}
          />
        )}

        <main className="premium-scrollbar flex-1 overflow-y-auto bg-[var(--surface-canvas)]">
          <div
            className={`mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-4 py-5 sm:px-6 lg:px-8 ${
              hideNavigation ? "pt-10" : ""
            }`}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}

      {!hideNavigation && !isDesktop && (
        <div
          className={`fixed inset-0 z-50 ${
            isSidebarOpen
              ? "pointer-events-auto"
              : "pointer-events-none"
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <button
            type="button"
            tabIndex={isSidebarOpen ? 0 : -1}
            aria-label="Close navigation menu"
            onClick={closeDrawer}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            id="navigation-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className={`absolute inset-y-0 left-0 transition-transform duration-200 ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >
            <Sidebar
              variant="drawer"
              onNavigate={closeDrawer}
            />
          </div>
        </div>
      )}

      {!hideUploadManager && <UploadManager />}
    </div>
  );
}

export default AppLayout;