import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import OtpInput from "../components/auth/OtpInput";
import authService from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";

function VerifyEmail() {
  const navigate = useNavigate(), location = useLocation(), { login } = useAuth();
  const email = location.state?.email;
  const [otp, setOtp] = useState(""), [loading, setLoading] = useState(false), [seconds, setSeconds] = useState(60);
  useEffect(() => { document.title = "Verify email · MemoryOS"; }, []);
  useEffect(() => { if (!seconds) return undefined; const timer = setTimeout(() => setSeconds((value) => value - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  if (!email) return <Navigate to="/register" replace />;
  const verify = async () => { if (otp.length !== 6) return toast.error("Enter the 6-digit verification code."); setLoading(true); try { const response = await authService.verifyEmail({ email, otp }); login(response.token, response.user); toast.success("Email verified successfully."); navigate("/dashboard", { replace: true }); } catch (error) { toast.error(error.response?.data?.message || "Verification failed."); } finally { setLoading(false); } };
  const resend = async () => { try { await authService.resendVerificationOtp(email); toast.success("Verification code sent."); setSeconds(60); } catch (error) { toast.error(error.response?.data?.message || "Unable to resend code."); } };
  return <AuthLayout><h1 className="auth-title">Verify your email</h1><p className="auth-description">Enter the code sent to <span className="text-[var(--text-primary)]">{email}</span>.</p><div className="mt-7"><OtpInput value={otp} onChange={setOtp} /></div><AuthButton className="mt-7" onClick={verify} disabled={loading}>{loading ? "Verifying…" : "Verify email"}</AuthButton><div className="mt-6 text-sm text-[var(--text-secondary)]">{seconds ? <>Resend code in {seconds}s</> : <button type="button" onClick={resend} className="auth-link inline-flex items-center gap-2"><RotateCw size={14} />Resend code</button>}</div><p className="mt-6 text-sm text-[var(--text-secondary)]">Wrong email? <Link to="/register" className="auth-link">Register again</Link></p></AuthLayout>;
}
export default VerifyEmail;
