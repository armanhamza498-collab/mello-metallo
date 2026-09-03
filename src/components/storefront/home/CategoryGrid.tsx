"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND_IMAGES } from "@/lib/images";

const CATEGORIES = [
  { label: "Drawer Knobs", href: "/shop?category=drawer-knobs", image: BRAND_IMAGES.brassHardware, span: "col-span-1" },
  { label: "Cabinet Handles", href: "/shop?category=cabinet-handles", image: BRAND_IMAGES.brassPulls, span: "col-span-1" },
  { label: "Cookware", href: "/shop?category=cookware", image: BRAND_IMAGES.brassCookware, span: "col-span-1 md:col-span-2" },
  { label: "Drinkware", href: "/shop?category=drinkware", image: BRAND_IMAGES.brassDrinkware, span: "col-span-1" },
  { label: "Home Decor", href: "/shop?category=home-decor", image: BRAND_IMAGES.brassHomeDecor, span: "col-span-1" },
  { label: "Copper Series", href: "/shop?material=copper", image: BRAND_IMAGES.copperDrinkware, span: "col-span-1" },
  { label: "Artisan Workshop", href: "/craftsmanship", image: BRAND_IMAGES.artisanWorkshop, span: "col-span-1" },
  { label: "Gift Sets", href: "/shop?category=gifts", image: BRAND_IMAGES.giftBox, span: "col-span-1" },
];

export default function CategoryGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="container-site">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="label-uppercase mb-3">Explore</p>
            <h2 className="font-serif font-light text-espresso">Shop by Category</h2>
          </div>
          <Link href="/shop" className="btn-link shrink-0">
            View All Products <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              className={`${cat.span}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={cat.href}
                className="group relative block w-full h-full overflow-hidden bg-charcoal"
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 ease-luxury"
                />

                {/* Label */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl md:text-2xl text-ivory font-light group-hover:text-brass-lighter transition-colors duration-300">
                      {cat.label}
                    </h3>
                    <span className="w-8 h-8 border border-ivory/50 flex items-center justify-center group-hover:bg-brass group-hover:border-brass transition-all duration-300">
                      <ArrowRight size={14} className="text-ivory" />
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/20 transition-colors duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
