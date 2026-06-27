import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-gray-800 bg-zinc-950 flex items-center justify-between px-6">

      <h1 className="text-xl font-bold text-blue-500">
        MemoryOS
      </h1>

      <div className="text-sm text-gray-300">
        Welcome, {user?.name}
      </div>

    </header>
  );
}

export default Navbar;