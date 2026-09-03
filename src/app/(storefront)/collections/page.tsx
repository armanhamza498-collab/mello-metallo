import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Collections — LAITON & CO",
  description: "Explore curated brass and copper collections — Heritage, Modern Brass, Everyday Objects, and Artisan Editions.",
};

const COLLECTIONS = [
  { name: "The Heritage Collection", slug: "heritage", desc: "Heavy-gauge traditional kadhais and thali sets lined with tin.", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" },
  { name: "Copper Essentials", slug: "copper", desc: "Hand-hammered pure copper water vessels, tumblers, and dispensers.", image: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=800&q=80" },
  { name: "Hardware Edit", slug: "hardware", desc: "Architectural drawer knobs, cabinet pulls, and door escutcheons.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { name: "Objects for the Home", slug: "home", desc: "Sculptural brass vases, candleholders, planters, and bowls.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" },
  { name: "Ritual Drinkware", slug: "drinkware", desc: "Solid brass and copper tumblers designed for everyday water rituals.", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80" },
  { name: "Curated Gift Sets", slug: "gifting", desc: "Handcrafted brass gift boxes for weddings, housewarmings, and celebrations.", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80" },
];

export default function CollectionsPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="py-16 bg-cream border-b border-sand text-center">
        <div className="container-site max-w-2xl">
          <p className="label-uppercase mb-2">Curated Series</p>
          <h1 className="font-serif text-4xl md:text-5xl text-espresso font-light">Our Collections</h1>
          <p className="text-sm font-sans text-muted mt-3">
            Explorations in material, form, and heritage craft.
          </p>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group block bg-cream border border-sand">
              <div className="aspect-[4/3] overflow-hidden img-hover-zoom">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <p className="label-uppercase mb-1">Collection</p>
                <h3 className="font-serif text-2xl text-espresso group-hover:text-brass transition-colors mb-2">{c.name}</h3>
                <p className="text-xs font-sans text-muted leading-relaxed mb-4">{c.desc}</p>
                <span className="btn-link text-xs">
                  Explore Series <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
