"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BRAND_IMAGES } from "@/lib/images";

const MATERIALS = [
  {
    label: "Brass",
    tagline: "Timeless warmth and character.",
    description:
      "An alloy of copper and zinc, brass develops a rich patina over time — each piece evolving with its owner. Resistant to corrosion, naturally antimicrobial, and endlessly beautiful.",
    image: BRAND_IMAGES.brassHomeDecor,
  },
  {
    label: "Copper",
    tagline: "A living material with a distinctive patina.",
    description:
      "Copper carries centuries of use in Indian kitchens and homes. Known for its health benefits and warm glow, copper objects are a ritual as much as a material.",
    image: BRAND_IMAGES.copperDrinkware,
  },
  {
    label: "Craft",
    tagline: "Made with attention to detail and lasting quality.",
    description:
      "Every Mello Metallo object is shaped by skilled artisans using techniques passed down through generations. The hand behind the hammer leaves a mark that machines cannot replicate.",
    image: BRAND_IMAGES.artisanWorkshop,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] as any },
  }),
};

export default function MaterialIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-ivory" ref={ref}>
      <div className="container-site">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="label-uppercase mb-4">The Materials</p>
          <h2 className="font-serif font-light text-espresso mb-4">
            Brass, Reimagined.
          </h2>
          <p className="text-base font-sans text-muted max-w-xl mx-auto">
            Mello Metallo creates contemporary objects using the most enduring materials known to Indian craft — brass and copper.
          </p>
        </motion.div>

        {/* Material Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MATERIALS.map((mat, i) => (
            <motion.div
              key={mat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="group"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden mb-6 img-hover-zoom bg-cream">
                <img
                  src={mat.image}
                  alt={mat.label}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <p className="label-uppercase mb-2">{mat.label}</p>
              <h3 className="font-serif text-2xl text-espresso mb-3 leading-tight">
                {mat.tagline}
              </h3>
              <p className="text-sm font-sans text-muted leading-relaxed">
                {mat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <blockquote className="font-serif text-2xl md:text-3xl text-espresso font-light italic max-w-2xl mx-auto">
            "Material with memory. Objects that gather character with time."
          </blockquote>
          <p className="label-subtle mt-4">— Mello Metallo</p>
        </motion.div>
      </div>
    </section>
  );
}
