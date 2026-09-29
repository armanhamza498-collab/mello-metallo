"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-charcoal" ref={ref}>
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="max-w-xl mx-auto text-center"
        >
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-brass-light mb-6 font-medium">
            The Journal
          </p>
          <h2 className="font-serif font-light text-ivory mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Objects worth keeping.
          </h2>
          <p className="font-sans text-ivory/60 text-base leading-relaxed mb-10 max-w-md mx-auto">
            Join the Mello Metallo journal for new collections, craftsmanship stories, care guides and private offers.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <div className="w-8 h-8 bg-brass rounded-full flex items-center justify-center">
                <Check size={16} className="text-ivory" />
              </div>
              <p className="font-sans text-ivory font-medium">
                You&apos;re on the list. Welcome to Mello Metallo.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-transparent border border-ivory/20 px-5 py-4 font-sans text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-brass transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-brass flex items-center gap-2 justify-center py-4 px-6 whitespace-nowrap disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Join the Journal <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          )}

          {error && <p className="text-error text-xs font-sans mt-3">{error}</p>}

          <p className="text-[10px] font-sans text-ivory/30 mt-4 tracking-wide">
            No spam. Unsubscribe any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
