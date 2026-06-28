import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;