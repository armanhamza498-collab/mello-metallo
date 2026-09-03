"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Package, Shield, Hammer, Globe } from "lucide-react";

import { BRAND_IMAGES } from "@/lib/images";

// ─── Gifting Section ──────────────────────────────────────────
const GIFT_CATEGORIES = [
  { label: "Wedding Gifts", href: "/shop?category=wedding-gifts", image: BRAND_IMAGES.brassCookware },
  { label: "Housewarming", href: "/shop?category=housewarming", image: BRAND_IMAGES.brassHomeDecor },
  { label: "Corporate Gifts", href: "/shop?category=corporate", image: BRAND_IMAGES.brassDrinkware },
  { label: "Luxury Gift Sets", href: "/shop?category=gift-sets&minPrice=3000", image: BRAND_IMAGES.giftBox },
];

export function GiftingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-ivory" ref={ref}>
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="label-uppercase mb-4">Gifting</p>
          <h2 className="font-serif font-light text-espresso mb-3">
            Gifts That Endure.
          </h2>
          <p className="text-sm font-sans text-muted max-w-md mx-auto">
            Brass objects make extraordinary gifts — pieces that carry meaning, age beautifully, and are never forgotten.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {GIFT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Link href={cat.href} className="group block">
                <div className="aspect-square overflow-hidden mb-3 img-hover-zoom">
                  <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                </div>
                <p className="font-sans text-sm font-medium text-charcoal group-hover:text-brass transition-colors text-center">
                  {cat.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/shop?category=gifts" className="btn-primary inline-flex">
            Shop Gifts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GiftingSection;

// ─── Trust Section ────────────────────────────────────────────
const TRUST_ITEMS = [
  {
    icon: Hammer,
    title: "Handcrafted",
    body: "Every piece shaped by skilled artisans using time-honoured techniques. No two objects are identical.",
  },
  {
    icon: Shield,
    title: "Authentic Materials",
    body: "Solid brass and pure copper — clearly labelled, never plated. What you see is exactly what you receive.",
  },
  {
    icon: Package,
    title: "Built to Last",
    body: "Designed for a lifetime of use. Brass and copper only grow more beautiful with age and care.",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    body: "Shipped from India to over 40 countries. Carefully packaged to arrive in perfect condition.",
  },
];

export function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-14 bg-cream" ref={ref}>
      <div className="container-site">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-ivory mx-auto mb-4 flex items-center justify-center">
                  <Icon size={20} strokeWidth={1.5} className="text-brass" />
                </div>
                <h3 className="font-serif text-lg text-espresso mb-2">{item.title}</h3>
                <p className="text-sm font-sans text-muted leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
