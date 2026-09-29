"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface HeroSlide {
  id: string;
  categoryName: string;
  tag: string;
  badge: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
  fallbackImage: string;
  productHighlight: {
    tag: string;
    name: string;
    price: string;
    link: string;
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "drinkware",
    categoryName: "Drinkware",
    tag: "01 / Pure Copper & Brass",
    badge: "Ayurvedic Heritage",
    heading: "Pure Copper &\nBrass Drinkware.",
    subheading:
      "Handcrafted copper carafes, hammered tumblers, and brass dispensers imbued with timeless Ayurvedic wellness traditions.",
    ctaText: "Explore Drinkware",
    ctaUrl: "/categories/drinkware",
    image: "/images/brass_drinkware_hero_1787586820724.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=1600&q=85",
    productHighlight: {
      tag: "Ayurvedic Wellness",
      name: "Hammered Copper Tumbler Set",
      price: "₹1,899",
      link: "/categories/drinkware",
    },
  },
  {
    id: "cookware",
    categoryName: "Cookware",
    tag: "02 / Artisan Brass Cookware",
    badge: "Kalai Tin-Lined",
    heading: "Hand-Forged Cookware.\nFlavor of Heritage.",
    subheading:
      "Tin-lined heavy brass kadhais, patilas, and artisanal skillets forged for slow, soulful culinary mastery.",
    ctaText: "Explore Cookware",
    ctaUrl: "/categories/cookware",
    image: "/images/brass_cookware_lifestyle_1787586785844.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=85",
    productHighlight: {
      tag: "Master Artisan Craft",
      name: "Tin-Lined Brass Kadhai (2kg)",
      price: "₹4,200",
      link: "/categories/cookware",
    },
  },
  {
    id: "hardware",
    categoryName: "Hardware",
    tag: "03 / Architectural Brass Hardware",
    badge: "Solid Unlacquered Brass",
    heading: "Solid Brass Hardware.\nDetails that Endure.",
    subheading:
      "Precision knurled cabinet pulls, hand-cast knobs, and statement architectural hardware designed to elevate living spaces.",
    ctaText: "Explore Hardware",
    ctaUrl: "/categories/hardware",
    image: "/images/brass_hardware_hero_1787586704402.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=1600&q=85",
    productHighlight: {
      tag: "Architectural Grade",
      name: "Fluted Brass Cabinet Pull",
      price: "₹1,450",
      link: "/categories/hardware",
    },
  },
];

const STATS = [
  { value: "15+", label: "Years of Craft" },
  { value: "200+", label: "Artisan Designs" },
  { value: "50K+", label: "Happy Homes" },
];

const AUTOPLAY_INTERVAL = 6000;

export default function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const activeSlide = HERO_SLIDES[currentIdx];
  const words = activeSlide.heading.split(/\n|(?<=\.) /g);

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#110F0D]"
    >
      {/* ── Parallax Background Image Carousel ─────────────────── */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <img
              src={activeSlide.image}
              alt={activeSlide.heading}
              className="w-full h-full object-cover object-center scale-105"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== activeSlide.fallbackImage) {
                  target.src = activeSlide.fallbackImage;
                }
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic dark luxury gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B09]/95 via-[#110F0D]/75 to-[#110F0D]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-[#110F0D]/40 to-transparent" />
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

      {/* ── Category Quick Selector Tabs (Top / Hero Nav) ──── */}
      <div className="relative z-20 container-site pt-28 sm:pt-32">
        <div className="inline-flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-[#1A1612]/70 backdrop-blur-md border border-[#C4AB8A]/20 shadow-lg">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                className={`relative px-4 sm:px-6 py-2 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "text-[#F8F5EF]"
                    : "text-[#B8B0A4]/70 hover:text-[#F8F5EF]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHeroCategoryPill"
                    className="absolute inset-0 bg-[#8B7355] rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{slide.categoryName}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F8F5EF] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────── */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex flex-col justify-center container-site py-12 md:py-16"
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="xl:col-span-8 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
              >
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2.5 mb-6">
                  <span className="w-6 h-px bg-[#C4AB8A]" />
                  <Sparkles size={11} className="text-[#C4AB8A]" />
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-semibold text-[#C4AB8A]">
                    {activeSlide.tag} • {activeSlide.badge}
                  </span>
                </div>

                {/* Headline — word-by-word reveal */}
                <h1
                  className="font-serif font-light text-[#F8F5EF] leading-[1.05] tracking-tight mb-6 whitespace-pre-line"
                  style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.8rem)" }}
                >
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.08,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="inline-block mr-[0.25em]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>

                {/* Subheading */}
                <p className="font-sans text-[#D4CFC5] text-base md:text-[1.1rem] leading-[1.8] mb-10 max-w-[560px]">
                  {activeSlide.subheading}
                </p>

                {/* CTA Buttons & Slide Nav */}
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href={activeSlide.ctaUrl}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#8B7355] hover:bg-[#6B5640] text-[#F8F5EF] font-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
                  >
                    <span className="relative z-10">{activeSlide.ctaText}</span>
                    <ArrowRight
                      size={14}
                      className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
                    />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Link>

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2.5 text-[#D4CFC5] hover:text-[#F8F5EF] font-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 group py-4 px-2"
                  >
                    <span className="w-8 h-px bg-[#8B7355] group-hover:w-12 transition-all duration-300" />
                    All Collections
                  </Link>

                  {/* Manual Arrow Controls */}
                  <div className="flex items-center gap-2 sm:ml-4 border-l border-[#F8F5EF]/15 pl-4 sm:pl-6">
                    <button
                      onClick={prevSlide}
                      aria-label="Previous Hero Slide"
                      className="w-10 h-10 rounded-full border border-[#C4AB8A]/30 flex items-center justify-center text-[#D4CFC5] hover:text-[#F8F5EF] hover:border-[#C4AB8A] hover:bg-[#8B7355]/20 transition-all duration-200"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Next Hero Slide"
                      className="w-10 h-10 rounded-full border border-[#C4AB8A]/30 flex items-center justify-center text-[#D4CFC5] hover:text-[#F8F5EF] hover:border-[#C4AB8A] hover:bg-[#8B7355]/20 transition-all duration-200"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <span className="font-mono text-xs text-[#C4AB8A]/70 ml-2">
                      0{currentIdx + 1} / 0{HERO_SLIDES.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Floating Product Highlight Card */}
          <div className="hidden xl:flex xl:col-span-4 justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.6 }}
                className="w-[310px] bg-[#171310]/85 backdrop-blur-xl border border-[#C4AB8A]/25 p-6 rounded-sm shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded bg-[#8B7355]/25 border border-[#C4AB8A]/30 flex items-center justify-center flex-shrink-0 text-[#C4AB8A]">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C4AB8A] block mb-1">
                      {activeSlide.productHighlight.tag}
                    </span>
                    <h3 className="font-serif text-[1.1rem] text-[#F8F5EF] leading-snug">
                      {activeSlide.productHighlight.name}
                    </h3>
                    <p className="font-mono text-sm text-[#C4AB8A] font-semibold mt-2">
                      {activeSlide.productHighlight.price}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F8F5EF]/10 flex items-center justify-between">
                  <Link
                    href={activeSlide.productHighlight.link}
                    className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4CFC5] hover:text-[#F8F5EF] inline-flex items-center gap-1.5 transition-colors"
                  >
                    View in Category
                    <ArrowRight size={11} />
                  </Link>
                  <span className="w-2 h-2 rounded-full bg-[#8B7355] animate-ping" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom Section: Stats & Progress Bar ───────────── */}
      <div className="relative z-10 container-site pb-10 pt-4 border-t border-[#F8F5EF]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Stats list */}
          <div className="flex items-center gap-8 sm:gap-14">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-serif text-[1.8rem] sm:text-[2.2rem] font-light text-[#C4AB8A] leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#9B9590]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Autoplay Progress Bars for the 3 Categories */}
          <div className="flex items-center gap-3">
            {HERO_SLIDES.map((slide, idx) => {
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIdx(idx)}
                  className="flex flex-col gap-1 text-left group"
                  aria-label={`Jump to ${slide.categoryName} slide`}
                >
                  <div className="w-16 sm:w-20 h-1 bg-[#F8F5EF]/15 rounded-full overflow-hidden relative">
                    {isCurrent ? (
                      <motion.div
                        key={`bar-${currentIdx}-${isPaused}`}
                        initial={{ width: "0%" }}
                        animate={{ width: isPaused ? "100%" : "100%" }}
                        transition={{
                          duration: isPaused ? 0 : AUTOPLAY_INTERVAL / 1000,
                          ease: "linear",
                        }}
                        className="h-full bg-[#C4AB8A]"
                      />
                    ) : (
                      <div
                        className={`h-full ${
                          idx < currentIdx ? "bg-[#8B7355]/60" : "bg-transparent"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`font-sans text-[9px] tracking-wider uppercase transition-colors ${
                      isCurrent
                        ? "text-[#C4AB8A] font-semibold"
                        : "text-[#7A756E] group-hover:text-[#D4CFC5]"
                    }`}
                  >
                    {slide.categoryName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Scroll cue ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown
            size={16}
            className="text-[#F8F5EF]/30"
            strokeWidth={1.5}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
