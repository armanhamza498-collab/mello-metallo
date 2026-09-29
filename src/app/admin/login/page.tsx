"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--admin-bg)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "var(--admin-accent)" }}>
            <span className="text-white font-serif text-xl">L</span>
          </div>
          <h1 className="font-serif text-2xl font-light tracking-widest uppercase" style={{ color: "var(--admin-text)" }}>
            Mello Metallo
          </h1>
          <p className="text-xs font-sans mt-1" style={{ color: "var(--admin-text-muted)" }}>Admin Panel</p>
        </div>

        {/* Form */}
        <div className="p-8 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <h2 className="text-base font-sans font-semibold mb-6" style={{ color: "var(--admin-text)" }}>Sign in to admin</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-4 bg-error/10 border border-error/20">
              <AlertCircle size={14} className="text-error flex-shrink-0" />
              <p className="text-xs font-sans text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-sans font-medium mb-1.5" style={{ color: "var(--admin-text-muted)" }}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@mellometallo.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm font-sans outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--admin-accent)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--admin-border)"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-sans font-medium mb-1.5" style={{ color: "var(--admin-text-muted)" }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-muted)" }} />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm font-sans outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--admin-surface-2)",
                    borderColor: "var(--admin-border)",
                    color: "var(--admin-text)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--admin-accent)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--admin-border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-sans font-semibold text-white transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--admin-accent)" }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: "var(--admin-border)" }}>
            <p className="text-[10px] font-sans" style={{ color: "var(--admin-text-muted)" }}>
              Default: admin@mellometallo.com / Admin@123456
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] font-sans mt-6" style={{ color: "var(--admin-text-muted)" }}>
          © 2026 Mello Metallo. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
