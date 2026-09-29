import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Collections — Mello Metallo",
  description: "Explore curated brass and copper collections — Heritage, Modern Brass, Everyday Objects, and Artisan Editions.",
};

const COLLECTIONS = [
  {
    name: "The Heritage Collection",
    slug: "heritage",
    desc: "Heavy-gauge traditional brass kadhais, tin-lined cooking vessels, and royal thali dinner sets.",
    image: "/images/products/brass_kadhai_1790597181856.jpg",
  },
  {
    name: "Copper Essentials",
    slug: "copper",
    desc: "Hand-hammered pure copper water bottles, tumblers, and Ayurvedic hydration dispensers.",
    image: "/images/products/copper_water_bottle_1790597102251.jpg",
  },
  {
    name: "Hardware Edit",
    slug: "hardware",
    desc: "Architectural drawer knobs, knurled cabinet pulls, statement door knockers, and coat hooks.",
    image: "/images/products/brass_cabinet_knobs_1790656185437.jpg",
  },
  {
    name: "Objects for the Home",
    slug: "home",
    desc: "Sculptural brass vases, engraved pillar candleholders, centerpiece trays, and traditional urlis.",
    image: "/images/products/brass_urli_bowl_1790597314906.jpg",
  },
  {
    name: "Ritual Drinkware",
    slug: "drinkware",
    desc: "Solid brass and copper tumblers, water dispensers, and carafes designed for mindful living.",
    image: "/images/products/brass_water_dispenser_1790597134328.jpg",
  },
  {
    name: "Curated Gift Sets",
    slug: "gifting",
    desc: "Handcrafted brass and copper hampers packaged in satin-lined keepsake boxes.",
    image: "/images/products/copper_gift_box_1790597352148.jpg",
  },
];

export default function CollectionsPage() {
  return (
    <div className="bg-[#F8F5EF] min-h-screen">
      <section className="py-20 bg-[#EDE8DF] border-b border-[#D4CFC5] text-center">
        <div className="container-site max-w-3xl">
          <p className="label-uppercase mb-2 tracking-[0.25em] text-[#8B7355] text-xs font-semibold">Curated Artisan Series</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1714] font-light tracking-tight">Our Collections</h1>
          <p className="text-sm md:text-base font-sans text-[#6B6660] mt-3 max-w-xl mx-auto leading-relaxed">
            Explorations in material, form, and heritage Indian metallurgy. Handcrafted by master artisans for the contemporary home.
          </p>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group block bg-[#FAF7F2] border border-[#D4CFC5] hover:border-[#8B7355] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-[#EDE8DF]">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-7">
                <p className="label-uppercase mb-1.5 text-[10px] tracking-widest text-[#8B7355]">Curated Collection</p>
                <h3 className="font-serif text-2xl text-[#1A1714] group-hover:text-[#8B7355] transition-colors mb-2.5 font-normal">
                  {c.name}
                </h3>
                <p className="text-xs font-sans text-[#6B6660] leading-relaxed mb-6">
                  {c.desc}
                </p>
                <span className="btn-link text-xs font-medium tracking-wider uppercase inline-flex items-center gap-1.5 text-[#8B7355] group-hover:translate-x-1 transition-transform">
                  Explore Series <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
