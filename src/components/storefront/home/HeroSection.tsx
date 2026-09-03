"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const [heroData, setHeroData] = useState({
    heading: "Objects with a Legacy.",
    subheading: "Handcrafted brass and copper pieces designed for modern living. Made slowly. Designed to stay.",
    ctaText: "Shop Brass",
    ctaUrl: "/shop?material=brass",
    image: "/hero-brass.png",
  });

  useEffect(() => {
    fetch("/api/admin/content/homepage")
      .then((r) => r.json())
      .then((data) => {
        if (data.sections) {
          const heroSec = data.sections.find((s: any) => s.type === "hero");
          if (heroSec?.content) {
            setHeroData((prev) => ({
              heading: heroSec.content.heading || prev.heading,
              subheading: heroSec.content.subheading || prev.subheading,
              ctaText: heroSec.content.ctaText || prev.ctaText,
              ctaUrl: heroSec.content.ctaUrl || prev.ctaUrl,
              image: heroSec.content.image || prev.image,
            }));
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-end overflow-hidden bg-[#1A1714]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroData.image}
          alt="Handcrafted brass and copper objects"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback to local image if db custom image fails to load
            (e.currentTarget as HTMLImageElement).src = "/hero-brass.png";
          }}
        />
        
        {/* Production-Grade Dark Gradient Overlays for 100% Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1714]/95 via-[#1A1714]/70 to-[#1A1714]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-site pb-16 md:pb-24 pt-32">
        <div className="max-w-2xl">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C4AB8A]/30 bg-[#1A1714]/60 backdrop-blur-md mb-6"
          >
            <Sparkles size={12} className="text-[#C4AB8A]" />
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-semibold text-[#C4AB8A]">
              Handcrafted in India
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif font-light text-[#F8F5EF] leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)" }}
          >
            {heroData.heading}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-sans text-[#D4CFC5] text-base md:text-lg leading-relaxed mb-10 max-w-xl font-normal"
          >
            {heroData.subheading}
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href={heroData.ctaUrl}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#8B7355] hover:bg-[#6B5640] text-[#F8F5EF] font-sans text-xs font-semibold tracking-widest uppercase rounded-none transition-all duration-300 shadow-luxury hover:shadow-brass group"
            >
              {heroData.ctaText}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#D4CFC5]/40 hover:border-[#F8F5EF] text-[#F8F5EF] hover:bg-[#F8F5EF] hover:text-[#1A1714] font-sans text-xs font-semibold tracking-widest uppercase rounded-none transition-all duration-300 backdrop-blur-sm"
            >
              Explore the Collection
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-[#F8F5EF]/20 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-1/2 bg-[#8B7355]"
          />
        </div>
        <span className="font-sans text-[10px] tracking-widest uppercase text-[#F8F5EF]/50 rotate-90 origin-center mt-3">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
