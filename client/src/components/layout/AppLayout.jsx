import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UploadManager from "../upload/UploadManager";

function AppLayout({ children }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--surface-canvas)] text-zinc-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="premium-scrollbar flex-1 overflow-y-auto bg-[var(--surface-canvas)]">
          <div className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <UploadManager />
    </div>
  );
}

export default AppLayout;
