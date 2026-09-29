"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { fetchUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }

      await fetchUser();
      router.push(redirect);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-cream p-8 md:p-10 border border-sand shadow-luxury"
      >
        <div className="text-center mb-8">
          <p className="label-uppercase mb-2">Mello Metallo</p>
          <h1 className="font-serif text-3xl text-espresso font-light">Welcome Back</h1>
          <p className="text-xs font-sans text-muted mt-2">Sign in to access your orders, wishlist, and profile.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 bg-error/10 border border-error/20 rounded-sm">
            <AlertCircle size={15} className="text-error flex-shrink-0" />
            <p className="text-xs font-sans text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-charcoal mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="input-luxury pl-4"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-sans font-medium text-charcoal">Password</label>
              <a href="#" className="text-[11px] font-sans text-muted hover:text-brass transition-colors">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-luxury pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-sand text-center">
          <p className="text-xs font-sans text-muted mb-3">Don&apos;t have an account yet?</p>
          <Link
            href={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="btn-secondary w-full justify-center py-3"
          >
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brass border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
