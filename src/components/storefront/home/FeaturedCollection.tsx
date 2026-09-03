"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCurrencyStore } from "@/store";
import { BRAND_IMAGES } from "@/lib/images";

const FEATURED_PRODUCTS = [
  { name: "Hammered Brass Kadhai", material: "Brass", price: 4800, compareAt: 5600, slug: "hammered-brass-kadhai", image: BRAND_IMAGES.brassCookware },
  { name: "Antique Brass Home Decor Vessel", material: "Brass", price: 2400, compareAt: 2800, slug: "antique-brass-serving-bowl", image: BRAND_IMAGES.brassHomeDecor },
  { name: "Brass Drawer Knob Set of 6", material: "Brass", price: 1800, compareAt: null, slug: "brass-drawer-knob-set", image: BRAND_IMAGES.brassHardware },
  { name: "Pure Copper Water Bottle", material: "Copper", price: 1800, compareAt: null, slug: "polished-brass-tumbler", image: BRAND_IMAGES.copperDrinkware },
];

export default function FeaturedCollection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { format } = useCurrencyStore();

  return (
    <section className="section-padding bg-ivory" ref={ref}>
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Large editorial image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden img-hover-zoom bg-cream">
              <img
                src={BRAND_IMAGES.brassDrinkware}
                alt="The Brass Collection"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Collection badge */}
            <div className="absolute bottom-6 left-6 bg-ivory/95 px-5 py-3 border border-sand">
              <p className="label-uppercase mb-1">Featured</p>
              <p className="font-serif text-lg text-espresso">The Brass Collection</p>
            </div>
          </motion.div>

          {/* Right — Products + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="label-uppercase mb-4">Collection</p>
            <h2 className="font-serif font-light text-espresso mb-4 text-4xl md:text-5xl">
              The Brass Collection
            </h2>
            <p className="font-sans text-muted text-base leading-relaxed mb-8 max-w-md">
              Curated from our finest brass pieces — each object shaped by hand, finished with care, designed for a life well-lived.
            </p>

            {/* Product List */}
            <div className="space-y-4 mb-8">
              {FEATURED_PRODUCTS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                >
                  <Link
                    href={`/products/${p.slug}`}
                    className="group flex items-center gap-4 py-3 border-b border-sand hover:border-brass transition-colors duration-300"
                  >
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-cream border border-sand">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm font-medium text-charcoal group-hover:text-brass transition-colors">{p.name}</p>
                      <p className="text-xs text-muted">{p.material}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans font-semibold text-charcoal text-sm">{format(p.price)}</p>
                      {p.compareAt && (
                        <p className="text-xs text-muted line-through">{format(p.compareAt)}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link href="/collections/brass" className="btn-primary inline-flex">
              Explore Brass <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
