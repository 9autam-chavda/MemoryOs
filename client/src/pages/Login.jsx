import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import InputField from "../components/ui/InputField";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../contexts/AuthContext";
import authService from "../services/auth.service";

function Login() {
  const navigate = useNavigate(); const { login } = useAuth(); const [formData, setFormData] = useState({ email: "", password: "" }); const [submitting, setSubmitting] = useState(false); const [showPassword, setShowPassword] = useState(false);
  useEffect(() => { document.title = "Login · MemoryOS"; }, []);
  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => { event.preventDefault(); if (!formData.email || !formData.password) { toast.error("Enter your email and password."); return; } setSubmitting(true); try { const response = await authService.login(formData); login(response.token, response.user); navigate("/dashboard"); } catch (error) { const message = error.response?.data?.message || "Login failed"; toast.error(message); if (message === "Please verify your email before logging in.") navigate("/verify-email", { state: { email: formData.email } }); } finally { setSubmitting(false); } };
  return <AuthLayout split title="A better place for your knowledge."><h2 className="auth-title">Sign in to MemoryOS</h2><p className="auth-description">Welcome back.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4"><div><label className="auth-label" htmlFor="email">Email</label><InputField id="email" type="email" name="email" label="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" /></div><div><div className="flex items-center justify-between"><label className="auth-label" htmlFor="password">Password</label><Link to="/forgot-password" className="auth-link">Forgot password?</Link></div><PasswordInput id="password" name="password" label="Password" value={formData.password} onChange={handleChange} autoComplete="current-password" show={showPassword} onToggleShow={() => setShowPassword((value) => !value)} /></div><AuthButton disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</AuthButton></form><p className="mt-6 text-sm text-[var(--text-secondary)]">New to MemoryOS? <Link to="/register" className="auth-link">Create an account</Link></p></AuthLayout>;
}
export default Login;
