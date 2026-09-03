"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BRAND_IMAGES } from "@/lib/images";

const LOOKBOOK_IMAGES = [
  { src: BRAND_IMAGES.brassCookware, alt: "Brass cookware in modern kitchen", label: "Kitchen" },
  { src: BRAND_IMAGES.brassHomeDecor, alt: "Brass decor in living room", label: "Living Room" },
  { src: BRAND_IMAGES.brassHardware, alt: "Brass hardware detail", label: "Hardware" },
  { src: BRAND_IMAGES.brassDrinkware, alt: "Brass drinkware at table", label: "Dining" },
  { src: BRAND_IMAGES.copperDrinkware, alt: "Copper vessels", label: "Copper" },
  { src: BRAND_IMAGES.artisanWorkshop, alt: "Brass crafting workshop", label: "Workshop" },
];

export default function LifestyleLookbook() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-cream overflow-hidden" ref={ref}>
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="label-uppercase mb-4">Lookbook</p>
          <h2 className="font-serif font-light text-espresso">Laiton in the Home</h2>
          <p className="text-sm font-sans text-muted mt-3">
            Brass and copper — at home in every room.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {LOOKBOOK_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.07 }}
              className="group relative overflow-hidden cursor-pointer aspect-square bg-ivory border border-sand"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
              />
              {/* Label overlay */}
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors duration-400 flex items-end p-3">
                <span className="font-sans text-[10px] tracking-widest uppercase text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                  {img.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
