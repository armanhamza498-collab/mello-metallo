"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";

const STATS = [
  { value: "15+", label: "Years of Craft" },
  { value: "200+", label: "Artisan Designs" },
  { value: "50K+", label: "Happy Homes" },
];

export default function HeroSection() {
  const [heroData, setHeroData] = useState({
    heading: "Objects with\na Legacy.",
    subheading:
      "Handcrafted brass and copper pieces designed for modern living. Made slowly. Designed to stay.",
    ctaText: "Shop Now",
    ctaUrl: "/shop",
    image: "/hero-brass.png",
  });
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

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
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const words = heroData.heading.split(/\n|(?<=\.) /g);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-[#110F0D]"
    >
      {/* ── Parallax Background Image ─────────────────────── */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src={heroData.image}
          alt="Handcrafted brass and copper objects"
          className="w-full h-full object-cover object-center scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/hero-brass.png";
          }}
        />
        {/* Deep layered overlays for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B09]/98 via-[#110F0D]/80 to-[#110F0D]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-[#110F0D]/30 to-transparent" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(0,0,0,0.5),transparent)]" />
      </motion.div>

      {/* ── Decorative vertical line ────────────────────────── */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: "top" }}
        className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8B7355]/40 to-transparent hidden xl:block z-10"
      />

      {/* ── Main Content ───────────────────────────────────── */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex flex-col justify-center flex-1 container-site pt-32 pb-36 lg:pt-40 lg:pb-44"
      >
        <div className="max-w-3xl">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 mb-8"
          >
            <span className="w-6 h-px bg-[#C4AB8A]" />
            <Sparkles size={11} className="text-[#C4AB8A]" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-semibold text-[#C4AB8A]">
              Handcrafted in India since 2009
            </span>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <h1 className="font-serif font-light text-[#F8F5EF] leading-[1.0] tracking-tight mb-8 whitespace-pre-line"
              style={{ fontSize: "clamp(3rem, 7.5vw, 6.5rem)" }}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + i * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="font-sans text-[#B8B0A4] text-base md:text-[1.05rem] leading-[1.85] mb-12 max-w-[520px]"
          >
            {heroData.subheading}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link
              href={heroData.ctaUrl}
              className="group relative inline-flex items-center gap-3 px-9 py-4 bg-[#8B7355] hover:bg-[#6B5640] text-[#F8F5EF] font-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-400 overflow-hidden"
            >
              <span className="relative z-10">{heroData.ctaText}</span>
              <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
              {/* shine sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <Link
              href="/craftsmanship"
              className="inline-flex items-center gap-2.5 text-[#D4CFC5] hover:text-[#F8F5EF] font-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 group"
            >
              <span className="w-8 h-px bg-[#8B7355] group-hover:w-12 transition-all duration-300" />
              Our Story
            </Link>
          </motion.div>
        </div>

        {/* ── Stats row ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25 }}
          className="flex items-center gap-10 mt-20 pt-8 border-t border-[#F8F5EF]/8"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="font-serif text-[2rem] font-light text-[#C4AB8A] leading-none tracking-tight">
                {stat.value}
              </span>
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#7A756E]">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right side — floating accent image ────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden xl:block absolute right-0 top-0 bottom-0 w-[42%] z-5 pointer-events-none"
      >
        {/* Frosted card with product highlight */}
        <div className="absolute bottom-32 right-12 w-[280px] glass border border-[#C4AB8A]/15 p-5 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#8B7355]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={22} className="text-[#C4AB8A]" />
            </div>
            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#C4AB8A] mb-1">New Arrival</p>
              <p className="font-serif text-[1.05rem] text-[#F8F5EF] leading-snug">Heritage Brass Tumbler Set</p>
              <p className="font-sans text-xs text-[#9B9590] mt-1">₹2,499</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll cue ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-[#F8F5EF]/30" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
