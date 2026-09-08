import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(form);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_35%)]" />

          <div className="relative flex w-full flex-col justify-between p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="font-bold">FlowOps</p>
                <p className="text-xs text-slate-500">
                  Work smarter
                </p>
              </div>
            </div>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-medium text-slate-400">
                YOUR WORKSPACE, REIMAGINED
              </p>

              <h1 className="text-5xl font-bold leading-tight tracking-tight">
                Turn busy work into{" "}
                <span className="text-slate-400">
                  meaningful progress.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Manage projects, organize tasks, and use AI-powered
                insights to focus on the work that matters.
              </p>
            </div>

            <p className="text-xs text-slate-600">
              FlowOps · Intelligent productivity
            </p>
          </div>
        </div>

        {/* Login */}
        <div className="flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="font-bold">FlowOps</p>
                <p className="text-xs text-slate-500">
                  Work smarter
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Sign in to continue to your workspace.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-white transition hover:text-slate-300"
              >
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;