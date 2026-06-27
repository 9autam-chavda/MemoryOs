import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-zinc-800"
    }`;

  return (
    <aside className="w-64 bg-zinc-950 border-r border-gray-800 p-4 flex flex-col">

      <nav className="flex-1 space-y-2">

        <NavLink
          to="/dashboard"
          className={linkClass}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/gallery"
          className={linkClass}
        >
          🖼 Gallery
        </NavLink>

      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 hover:bg-red-700 rounded-lg py-3"
      >
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;