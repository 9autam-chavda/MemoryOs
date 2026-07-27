import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import OtpInput from "../components/auth/OtpInput";
import PasswordInput from "../components/ui/PasswordInput";
import authService from "../services/auth.service";

function ResetPassword() {
  const navigate = useNavigate(), location = useLocation(), email = location.state?.email;
  const [otp, setOtp] = useState(""), [password, setPassword] = useState(""), [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false), [showConfirm, setShowConfirm] = useState(false), [loading, setLoading] = useState(false), [seconds, setSeconds] = useState(60);
  useEffect(() => { document.title = "Reset password · MemoryOS"; }, []);
  useEffect(() => { if (!seconds) return undefined; const timer = setTimeout(() => setSeconds((value) => value - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  if (!email) return <Navigate to="/forgot-password" replace />;
  const submit = async (event) => { event.preventDefault(); if (otp.length !== 6) return toast.error("Enter the verification code."); if (password.length < 8) return toast.error("Password must contain at least 8 characters."); if (password !== confirm) return toast.error("Passwords do not match."); setLoading(true); try { await authService.resetPassword({ email, otp, newPassword: password }); toast.success("Password reset successfully."); navigate("/login", { replace: true }); } catch (error) { toast.error(error.response?.data?.message || "Unable to reset password."); } finally { setLoading(false); } };
  const resend = async () => { try { await authService.forgotPassword(email); toast.success("Verification code sent."); setSeconds(60); } catch (error) { toast.error(error.response?.data?.message || "Unable to resend code."); } };
  return <AuthLayout><h1 className="auth-title">Choose a new password</h1><p className="auth-description">Use the code sent to your email, then choose a secure password.</p><form onSubmit={submit} className="mt-7 space-y-4"><OtpInput value={otp} onChange={setOtp} /><div><label className="auth-label" htmlFor="password">New password</label><PasswordInput id="password" name="password" label="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" show={showPassword} onToggleShow={() => setShowPassword((value) => !value)} /></div><div><label className="auth-label" htmlFor="confirm">Confirm password</label><PasswordInput id="confirm" name="confirm" label="Repeat password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" show={showConfirm} onToggleShow={() => setShowConfirm((value) => !value)} invalid={Boolean(confirm && confirm !== password)} /></div><AuthButton disabled={loading}>{loading ? "Resetting…" : "Reset password"}</AuthButton></form><div className="mt-6 text-sm text-[var(--text-secondary)]">{seconds ? <>Resend code in {seconds}s</> : <button type="button" onClick={resend} className="auth-link inline-flex items-center gap-2"><RotateCw size={14} />Resend code</button>}</div><p className="mt-6 text-sm text-[var(--text-secondary)]"><Link to="/login" className="auth-link">Back to sign in</Link></p></AuthLayout>;
}
export default ResetPassword;
