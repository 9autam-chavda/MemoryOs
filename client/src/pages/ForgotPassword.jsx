import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import InputField from "../components/ui/InputField";
import authService from "../services/auth.service";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { document.title = "Forgot password · MemoryOS"; }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email.");
    setLoading(true);
    try { await authService.forgotPassword(email.trim()); toast.success("Password reset code sent."); navigate("/reset-password", { state: { email: email.trim() } }); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to send reset code."); }
    finally { setLoading(false); }
  };
  return <AuthLayout><h1 className="auth-title">Reset your password</h1><p className="auth-description">Enter your email and we’ll send a verification code.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4"><div><label htmlFor="email" className="auth-label">Email</label><InputField id="email" type="email" name="email" label="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" disabled={loading} required /></div><AuthButton disabled={loading}>{loading ? "Sending…" : "Send reset code"}</AuthButton></form><p className="mt-6 text-sm text-[var(--text-secondary)]"><Link to="/login" className="auth-link">Back to sign in</Link></p></AuthLayout>;
}
export default ForgotPassword;
