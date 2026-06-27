import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login(formData);

      login(
            response.token,
            response.user
        );

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="text-4xl font-bold mb-6">
          MemoryOS Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
        />

        <button
          type="submit"
          className="bg-blue-600 p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

    </div>
  );
}

export default Login;