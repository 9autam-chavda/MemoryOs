import { useEffect, useMemo, useState } from "react";
import { Brain, Sparkles, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import PasswordInput from "../components/ui/PasswordInput";
import authService from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwChecks = {
  length: (s) => s.length >= 8,
  upper: (s) => /[A-Z]/.test(s),
  lower: (s) => /[a-z]/.test(s),
  number: (s) => /[0-9]/.test(s),
  special: (s) => /[^A-Za-z0-9]/.test(s),
};

function PasswordStrength({ password }) {
  const passed = useMemo(() => Object.values(pwChecks).map((fn) => fn(password)), [password]);
  const score = passed.filter(Boolean).length;

  const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-500"];

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-1.5 w-full rounded ${i < score ? colors[score - 1] : "bg-zinc-800"}`} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span className={`flex items-center gap-1 ${pwChecks.length(password) ? "text-green-300" : "text-zinc-500"}`}><Check size={14} />8+ chars</span>
        <span className={`flex items-center gap-1 ${pwChecks.upper(password) ? "text-green-300" : "text-zinc-500"}`}>Uppercase</span>
        <span className={`flex items-center gap-1 ${pwChecks.lower(password) ? "text-green-300" : "text-zinc-500"}`}>Lowercase</span>
        <span className={`flex items-center gap-1 ${pwChecks.number(password) ? "text-green-300" : "text-zinc-500"}`}>Number</span>
        <span className={`flex items-center gap-1 ${pwChecks.special(password) ? "text-green-300" : "text-zinc-500"}`}>Special</span>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    document.title = "Register · MemoryOS";
  }, []);

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";

    if (!form.email) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email";

    const pw = form.password || "";
    const pwFails = Object.entries(pwChecks).filter(([k, fn]) => !fn(pw)).map(([k]) => k);
    if (pwFails.length) e.password = "Password does not meet requirements";

    if (form.confirm !== form.password) e.confirm = "Passwords do not match";

    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0 && form.name && form.email && form.password && form.confirm, [errors, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    try {
      const payload = { name: form.name.trim(), email: form.email.trim(), password: form.password };
      const response = await authService.register(payload);

      // If backend returns token + user, log user in
      if (response.token && response.user) {
        login(response.token, response.user);
        toast.success("Welcome to MemoryOS — redirecting…");
        navigate("/dashboard");
        return;
      }

      toast.success(response.message || "Registration successful. Please login.");
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || "Registration failed";
      if (status === 409) toast.error(msg || "User already exists");
      else if (status === 400) toast.error(msg || "Invalid input");
      else if (!err.response) toast.error("Network error — check your connection");
      else toast.error(msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_20%),#06070a] px-4 py-10 text-zinc-100">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-zinc-800/80 bg-zinc-950/80 shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between border-b border-zinc-800/80 bg-gradient-to-br from-slate-900/60 to-zinc-950/60 p-8 sm:p-10 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                <Brain size={22} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-zinc-50">MemoryOS</h1>
                <p className="text-xs text-zinc-400">Your AI Second Brain</p>
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Create your account</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
              Bring your knowledge into one place — upload, extract, and retrieve memories with the power of semantic AI.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Sparkles size={16} className="text-blue-300" /> Intelligent memory retrieval
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Upload files, extract signal, and search your knowledge with AI.</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-300">Get started</p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-50">Create a MemoryOS account</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="mb-2 block text-sm text-zinc-400" htmlFor="name">Full name</label>
              <InputField id="name" name="name" label="Your full name" value={form.name} onChange={handleChange} onBlur={handleBlur} autoComplete="name" disabled={loading} required invalid={touched.name && !!errors.name} />
              {touched.name && errors.name && <p className="mt-2 text-xs text-red-400" role="alert">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400" htmlFor="email">Email</label>
              <InputField id="email" name="email" label="you@example.com" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" disabled={loading} required invalid={touched.email && !!errors.email} />
              {touched.email && errors.email && <p className="mt-2 text-xs text-red-400" role="alert">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400" htmlFor="password">Password</label>
              <PasswordInput id="password" name="password" label="Create a password" value={form.password} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" show={showPwd} onToggleShow={() => setShowPwd((s) => !s)} disabled={loading} invalid={touched.password && !!errors.password} />
              <PasswordStrength password={form.password} />
              {touched.password && errors.password && <p className="mt-2 text-xs text-red-400" role="alert">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400" htmlFor="confirm">Confirm password</label>
              <PasswordInput id="confirm" name="confirm" label="Repeat password" value={form.confirm} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" show={showConfirm} onToggleShow={() => setShowConfirm((s) => !s)} disabled={loading} invalid={touched.confirm && !!errors.confirm} />
              {touched.confirm && errors.confirm && <p className="mt-2 text-xs text-red-400" role="alert">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-white transition ${
                !isValid || loading ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
            <div>Already have an account?</div>
            <Link to="/" className="font-medium text-blue-300 transition hover:text-blue-200">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;