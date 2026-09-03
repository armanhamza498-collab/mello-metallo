"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BRAND_IMAGES } from "@/lib/images";

const WHY_BRASS = [
  {
    question: "What makes brass special?",
    answer: "Brass is an alloy of copper and zinc — valued for over 5,000 years across civilizations. It is naturally antimicrobial, corrosion-resistant, and develops a rich patina over time that makes each piece unique. Unlike synthetic materials, brass only grows more beautiful with age.",
  },
  {
    question: "Brass versus other materials",
    answer: "Unlike stainless steel, which remains cold and industrial, brass carries warmth. Unlike plastic, brass will never degrade. Unlike silver, brass is accessible without compromising on character. Brass occupies a rare position — both functional and beautiful.",
  },
  {
    question: "Natural aging and patina",
    answer: "The amber tones of brass deepen over years of handling. This process — called patination — is natural and desirable. It tells the story of the object's use. If you prefer the original lustre, a simple polish restores it. Both states are valid expressions of the material.",
  },
  {
    question: "How to care for brass",
    answer: "Clean with a soft dry cloth after each use. For deeper cleaning, use a diluted mixture of lemon juice and salt, then rinse and dry immediately. Avoid prolonged exposure to water or harsh chemicals. To maintain patina, simply leave the piece as it is.",
  },
  {
    question: "Why handcrafted objects are different",
    answer: "A machine produces identical copies. A human hand makes each piece slightly different — the hammer mark lands at a slightly different angle, the finish catches light uniquely. These differences are the evidence of making. A handcrafted object carries the presence of its maker.",
  },
];

function AccordionItem({ item, index }: { item: typeof WHY_BRASS[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border-b border-sand last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className={`font-serif text-xl transition-colors duration-200 ${open ? "text-brass" : "text-espresso"}`}>
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`text-muted flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-brass" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-sans text-muted text-base leading-relaxed max-w-2xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WhyBrass() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-ivory" ref={ref}>
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Sticky Image */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="lg:sticky lg:top-28"
          >
            <div className="aspect-[3/4] overflow-hidden bg-cream">
              <img
                src={BRAND_IMAGES.brassDrinkware}
                alt="Why Brass"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 bg-cream p-6">
              <p className="font-serif text-2xl text-espresso italic mb-2">
                "Objects that gather character with time."
              </p>
              <p className="label-subtle">— On the nature of brass</p>
            </div>
          </motion.div>

          {/* Right — Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="label-uppercase mb-4">Education</p>
            <h2 className="font-serif font-light text-espresso mb-8" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Why Brass?
            </h2>
            <div>
              {WHY_BRASS.map((item, i) => (
                <AccordionItem key={i} item={item} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
