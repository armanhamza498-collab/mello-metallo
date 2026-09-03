"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: "r1",
    name: "Priya M.",
    location: "Mumbai",
    rating: 5,
    title: "Simply the most beautiful kitchen hardware",
    body: "I replaced all my cabinet handles with Laiton & Co brass pulls. The quality is extraordinary — the weight, the finish, the patina developing after just a few months. These are objects I will have forever.",
    product: "Antique Brass Cabinet Pull",
    date: "August 2025",
    verified: true,
  },
  {
    id: "r2",
    name: "Arjun K.",
    location: "London",
    rating: 5,
    title: "Gifted to my parents — they were overjoyed",
    body: "Ordered the brass kadhai and serving set as a housewarming gift. The packaging was exquisite, the quality surpassed anything I expected. It now sits in their kitchen as the centrepiece.",
    product: "Brass Kadhai + Serving Set",
    date: "July 2025",
    verified: true,
  },
  {
    id: "r3",
    name: "Sophie L.",
    location: "Paris",
    rating: 5,
    title: "Exactly what I was looking for",
    body: "I wanted drawer knobs with genuine character — not the cheap mass-produced kind. These are perfect. The hammering is visible, the patina is real. My kitchen renovation is complete.",
    product: "Hammered Brass Drawer Knob",
    date: "June 2025",
    verified: true,
  },
];

export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-ivory" ref={ref}>
      <div className="container-site">
        {/* Average Rating Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="label-uppercase mb-4">Customer Reviews</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="text-brass" fill="currentColor" />
            ))}
          </div>
          <div className="font-serif text-5xl text-espresso mb-1">4.9</div>
          <p className="text-sm font-sans text-muted">Based on 834 verified reviews</p>
        </motion.div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="bg-cream p-6 border border-sand"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-brass" fill={j < review.rating ? "currentColor" : "none"} />
                ))}
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg text-espresso mb-2">{review.title}</h3>

              {/* Body */}
              <p className="text-sm font-sans text-muted leading-relaxed mb-4 line-clamp-4">{review.body}</p>

              {/* Product */}
              <p className="text-[11px] font-sans text-brass font-medium tracking-wide mb-4">
                {review.product}
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-sand">
                <div>
                  <p className="text-sm font-sans font-medium text-charcoal">{review.name}</p>
                  <p className="text-xs font-sans text-muted">{review.location}</p>
                </div>
                <div className="text-right">
                  {review.verified && (
                    <p className="text-[10px] font-sans text-success font-medium tracking-wide">✓ Verified</p>
                  )}
                  <p className="text-[10px] font-sans text-muted">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
