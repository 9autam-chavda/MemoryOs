import { useEffect, useState } from "react";
import { Brain, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import authService from "../services/auth.service";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password · MemoryOS";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email.trim());

      toast.success("Password reset code sent.");

      navigate("/reset-password", {
        state: {
          email: email.trim(),
        },
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send reset code."
      );
    } finally {
      setLoading(false);
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
          Forgot Password
        </h1>

        <p className="mt-3 text-center text-sm text-zinc-400">
          Enter your email and we'll send you a password reset code.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-400"
            >
                Email Address
            </label>

            <div className="relative">
                <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-3 pl-12 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading
              ? "Sending..."
              : "Send Reset Code"}
          </button>
        </form>

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

export default ForgotPassword;