"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND_IMAGES } from "@/lib/images";

export default function ArtisanStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-espresso" ref={ref}>
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-2 gap-3 lg:gap-4"
          >
            <div className="col-span-2 aspect-video overflow-hidden img-hover-zoom bg-charcoal">
              <img
                src={BRAND_IMAGES.artisanWorkshop}
                alt="Artisan working with brass"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden img-hover-zoom bg-charcoal">
              <img
                src={BRAND_IMAGES.brassHardware}
                alt="Brass crafting detail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden img-hover-zoom bg-charcoal">
              <img
                src={BRAND_IMAGES.brassHomeDecor}
                alt="Finished brass product"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-brass-light mb-6 font-medium">
              The Craft
            </p>
            <h2 className="font-serif font-light text-ivory mb-6 leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Made by Hand.<br />
              <span className="italic text-brass-lighter">Meant to Last.</span>
            </h2>
            <p className="font-sans text-ivory/60 text-base leading-relaxed mb-6">
              In the workshops of skilled Indian artisans, every Mello Metallo piece begins as raw brass. Through hammering, shaping, and hand-finishing, it becomes something singular.
            </p>
            <p className="font-sans text-ivory/60 text-base leading-relaxed mb-8">
              No two objects are identical. The slight variation in surface, the unique hammer marks — these are not imperfections. They are the evidence of craft.
            </p>

            {/* Steps */}
            <div className="space-y-4 mb-10">
              {["Raw material sourced", "Hand-hammered and shaped", "Polished and finished by hand", "Quality inspected", "Shipped to your home"].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-5 h-5 rounded-full border border-brass text-brass flex items-center justify-center text-[10px] font-sans font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-sans text-ivory/70">{step}</span>
                </motion.div>
              ))}
            </div>

            <p className="label-subtle text-ivory/30 mb-4">From workshop to home.</p>
            <Link href="/craftsmanship" className="btn-brass inline-flex">
              Meet the Makers <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
