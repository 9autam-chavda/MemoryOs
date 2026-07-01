import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import authService from "../services/auth.service";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await authService.login(formData);
      login(response.token, response.user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_25%),#06070a] px-4 py-10 text-zinc-100">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-zinc-800/80 bg-zinc-950/80 shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between border-b border-zinc-800/80 bg-zinc-900/70 p-8 sm:p-10 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
              <Brain size={22} />
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Your AI second brain.</h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
              Capture files, extract signal, and retrieve memories with semantic search built for modern knowledge work.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Sparkles size={16} className="text-blue-300" /> Intelligent memory retrieval
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Upload images, PDFs, audio, video, and text. MemoryOS turns them into searchable, AI-structured knowledge.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-300">Welcome back</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Sign in to MemoryOS</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400" htmlFor="email">Email</label>
              <input id="email" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-blue-500/40" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400" htmlFor="password">Password</label>
              <input id="password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-blue-500/40" />
            </div>

            <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
              Sign in
            </button>
          </form>

          <div className="mt-6 text-sm text-zinc-500">
            New to MemoryOS? <Link to="/register" className="font-medium text-blue-300 transition hover:text-blue-200">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;