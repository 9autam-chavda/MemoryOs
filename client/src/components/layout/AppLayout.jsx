import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UploadManager from "../upload/UploadManager";

function AppLayout({ children, hideNavigation = false, hideUploadManager = false }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeDrawer();
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    drawerRef.current?.querySelector("a, button")?.focus();
    const menuButton = menuButtonRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [drawerOpen]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {!hideNavigation && <Navbar onMenuClick={() => setDrawerOpen(true)} menuButtonRef={menuButtonRef} menuOpen={drawerOpen} />}

      <div className="flex flex-1 overflow-hidden">
        {!hideNavigation && <><div className="hidden xl:flex"><Sidebar /></div><div className="hidden lg:flex xl:hidden"><Sidebar variant="collapsed" /></div></>}

        <main className="premium-scrollbar flex-1 overflow-y-auto bg-[var(--surface-canvas)]">
          <div className={`mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-4 py-5 sm:px-6 lg:px-8 ${hideNavigation ? "pt-10" : ""}`}>
            {children}
          </div>
        </main>
      </div>

      {!hideNavigation && <div className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!drawerOpen} inert={drawerOpen ? undefined : ""}>
        <button type="button" tabIndex={drawerOpen ? 0 : -1} aria-label="Close navigation menu" onClick={closeDrawer} className={`absolute inset-0 bg-black/20 transition-opacity duration-[180ms] ${drawerOpen ? "opacity-100" : "opacity-0"}`} />
        <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Navigation menu" className={`absolute inset-y-0 left-0 transition-transform duration-[180ms] ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar variant="drawer" onNavigate={closeDrawer} />
        </div>
      </div>}

      {!hideUploadManager && <UploadManager />}
    </div>
  );
}

export default AppLayout;
