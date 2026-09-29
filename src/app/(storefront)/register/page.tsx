"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { fetchUser } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please check your details.");
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
          <h1 className="font-serif text-3xl text-espresso font-light">Create an Account</h1>
          <p className="text-xs font-sans text-muted mt-2">Join us to save wishlists, track orders, and receive private journal updates.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 bg-error/10 border border-error/20 rounded-sm">
            <AlertCircle size={15} className="text-error flex-shrink-0" />
            <p className="text-xs font-sans text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans font-medium text-charcoal mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Priya"
                className="input-luxury"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-charcoal">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Sharma"
                className="input-luxury"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-charcoal mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="priya@example.com"
              className="input-luxury"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-charcoal mb-1.5">Phone Number (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="input-luxury"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-charcoal mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 8 chars (1 uppercase, 1 number)"
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
            className="btn-brass w-full justify-center py-3.5 mt-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Register Account <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-sand text-center">
          <p className="text-xs font-sans text-muted mb-3">Already have an account?</p>
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="btn-secondary w-full justify-center py-3"
          >
            Sign In Instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brass border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
