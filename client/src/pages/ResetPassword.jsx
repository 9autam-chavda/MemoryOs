import { useEffect, useState } from "react";
import { Brain, RotateCw } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import authService from "../services/auth.service";
import OtpInput from "../components/auth/OtpInput";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    document.title = "Reset Password · MemoryOS";
  }, []);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the verification code.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        otp,
        newPassword: password,
      });

      toast.success("Password reset successfully.");

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await authService.forgotPassword(email);

      toast.success("Verification code sent.");

      setSeconds(60);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to resend code."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_20%),#06070a] px-4">

      <div className="w-full max-w-md rounded-[30px] border border-zinc-800 bg-zinc-950/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">

        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <Brain size={24} />
          </div>
        </div>

        <h1 className="mt-6 text-center text-3xl font-semibold text-white">
          Reset Password
        </h1>

        <p className="mt-3 text-center text-sm text-zinc-400">
          Enter the verification code and choose a new password.
        </p>

        <div className="mt-8">
          <OtpInput
            value={otp}
            onChange={setOtp}
          />
        </div>

        <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-zinc-400">
                New Password
            </label>

            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a new password"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-3 pl-4 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                >
                {showPassword ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
                </button>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                className={`h-full rounded-full transition-all duration-300 ${
                    password.length >= 8
                    ? "w-full bg-emerald-500"
                    : password.length >= 5
                    ? "w-2/3 bg-yellow-500"
                    : password.length > 0
                    ? "w-1/3 bg-red-500"
                    : "w-0"
                }`}
                />
            </div>

            <p className="mt-2 text-xs text-zinc-500">
                Use at least 8 characters for a stronger password.
            </p>
            </div>

            <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-zinc-400">
                Confirm Password
            </label>

            <div className="relative">
                <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full rounded-2xl border bg-zinc-900/80 py-3 pl-4 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-200 ${
                    confirmPassword.length === 0
                    ? "border-zinc-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                    : password === confirmPassword
                    ? "border-emerald-500"
                    : "border-red-500"
                }`}
                />

                <button
                type="button"
                onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                >
                {showConfirmPassword ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
                </button>
            </div>

            {confirmPassword.length > 0 && (
                <p
                className={`mt-2 text-xs ${
                    password === confirmPassword
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
                >
                {password === confirmPassword
                    ? "✓ Passwords match"
                    : "Passwords do not match"}
                </p>
            )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="mt-6 text-center">

          {seconds > 0 ? (
            <p className="text-sm text-zinc-500">
              Resend code in{" "}
              <span className="text-zinc-300">
                {seconds}s
              </span>
            </p>
          ) : (
            <button
              onClick={resendOtp}
              className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"
            >
              <RotateCw size={16} />
              Resend Code
            </button>
          )}

        </div>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-sm text-blue-300 hover:text-blue-200"
          >
            Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
}

export default ResetPassword;