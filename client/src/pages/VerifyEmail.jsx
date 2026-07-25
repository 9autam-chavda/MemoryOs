import { useEffect, useState } from "react";
import { Brain, Mail, RotateCw } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authService from "../services/auth.service";
import OtpInput from "../components/auth/OtpInput";
import { useAuth } from "../contexts/AuthContext";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    document.title = "Verify Email · MemoryOS";
  }, []);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyEmail({
        email,
        otp,
      });

      login(response.token, response.user);

      toast.success("Email verified successfully.");

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendVerificationOtp(email);

      toast.success("Verification code sent.");

      setSeconds(60);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to resend OTP."
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
          Verify your email
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-zinc-400">
          We've sent a verification code to
        </p>

        <div className="mt-2 flex items-center justify-center gap-2 text-blue-300">
          <Mail size={16} />
          <span>{email}</span>
        </div>

        <div className="mt-8">
          <OtpInput
            value={otp}
            onChange={setOtp}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="mt-6 text-center">

          {seconds > 0 ? (
            <p className="text-sm text-zinc-500">
              Resend code in{" "}
              <span className="font-medium text-zinc-300">
                {seconds}s
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-300 transition hover:text-blue-200"
            >
              <RotateCw size={16} />
              Resend Code
            </button>
          )}

        </div>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Wrong email?{" "}
          <Link
            to="/register"
            className="text-blue-300 hover:text-blue-200"
          >
            Register again
          </Link>
        </div>

      </div>

    </div>
  );
}

export default VerifyEmail;