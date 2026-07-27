import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import InputField from "../components/ui/InputField";
import PasswordInput from "../components/ui/PasswordInput";
import authService from "../services/auth.service";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function FieldError({ message }) {
  return message ? <p className="mt-2 text-xs text-[var(--danger)]" role="alert">{message}</p> : null;
}
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false), [showConfirm, setShowConfirm] = useState(false), [loading, setLoading] = useState(false), [touched, setTouched] = useState({});
  useEffect(() => { document.title = "Create account · MemoryOS"; }, []);
  const errors = useMemo(() => ({ name: !form.name.trim() ? "Name is required" : form.name.trim().length < 2 ? "Name must be at least 2 characters" : "", email: !form.email ? "Email is required" : !emailRegex.test(form.email) ? "Enter a valid email" : "", password: form.password.length < 8 ? "Use at least 8 characters" : "", confirm: form.confirm !== form.password ? "Passwords do not match" : "" }), [form]);
  const isValid = !Object.values(errors).some(Boolean);
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const blur = (event) => setTouched((current) => ({ ...current, [event.target.name]: true }));
  const submit = async (event) => { event.preventDefault(); if (!isValid) return toast.error("Please fix the highlighted fields."); setLoading(true); try { const response = await authService.register({ name: form.name.trim(), email: form.email.trim(), password: form.password }); toast.success(response.message || "Registration successful. Please verify your email."); navigate("/verify-email", { replace: true, state: { email: form.email.trim() } }); } catch (error) { toast.error(error.response?.data?.message || (!error.response ? "Network error — check your connection." : "Registration failed.")); } finally { setLoading(false); } };
  return <AuthLayout split title="A calmer home for your knowledge."><h1 className="auth-title">Create your account</h1><p className="auth-description">Start building your personal memory library.</p><form onSubmit={submit} noValidate className="mt-7 space-y-4"><div><label className="auth-label" htmlFor="name">Full name</label><InputField id="name" name="name" label="Your full name" value={form.name} onChange={change} onBlur={blur} autoComplete="name" disabled={loading} required invalid={touched.name && Boolean(errors.name)} /><FieldError message={touched.name && errors.name} /></div><div><label className="auth-label" htmlFor="email">Email</label><InputField id="email" type="email" name="email" label="you@example.com" value={form.email} onChange={change} onBlur={blur} autoComplete="email" disabled={loading} required invalid={touched.email && Boolean(errors.email)} /><FieldError message={touched.email && errors.email} /></div><div><label className="auth-label" htmlFor="password">Password</label><PasswordInput id="password" name="password" label="At least 8 characters" value={form.password} onChange={change} onBlur={blur} autoComplete="new-password" disabled={loading} show={showPassword} onToggleShow={() => setShowPassword((value) => !value)} invalid={touched.password && Boolean(errors.password)} /><FieldError message={touched.password && errors.password} /></div><div><label className="auth-label" htmlFor="confirm">Confirm password</label><PasswordInput id="confirm" name="confirm" label="Repeat password" value={form.confirm} onChange={change} onBlur={blur} autoComplete="new-password" disabled={loading} show={showConfirm} onToggleShow={() => setShowConfirm((value) => !value)} invalid={touched.confirm && Boolean(errors.confirm)} /><FieldError message={touched.confirm && errors.confirm} /></div><AuthButton disabled={!isValid || loading}>{loading ? "Creating account…" : "Create account"}</AuthButton></form><p className="mt-6 text-sm text-[var(--text-secondary)]">Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p></AuthLayout>;
}
export default Register;
