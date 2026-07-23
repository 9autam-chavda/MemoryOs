import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import MemoryDetails from "./pages/MemoryDetails";
import SharedMemory from "./pages/SharedMemory";
import Settings from "./pages/Settings";
import Assistant from "./pages/Assistant";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #3f3f46",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shared/:token" element={<SharedMemory />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/memory/:id" element={<MemoryDetails />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />

      </Routes>
    </>
  );
}

export default App;
