import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ChevronRight, Sparkles, Shield, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import ShopClient from "@/components/storefront/shop/ShopClient";

interface Props {
  params: Promise<{ slug: string }>;
}

const COLLECTION_METADATA: Record<
  string,
  {
    name: string;
    eyebrow: string;
    desc: string;
    image: string;
    badges: string[];
  }
> = {
  heritage: {
    name: "The Heritage Collection",
    eyebrow: "Timeless Culinary & Dining Heirlooms",
    desc: "Heavy-gauge traditional brass kadhais, tin-lined cooking vessels, royal dinner thali sets, and ceremonial objects rooted in centuries of Indian metallurgy. Hand-beaten by hereditary masters and designed to last generations.",
    image: "/images/products/brass_kadhai_1790597181856.jpg",
    badges: ["Pure Kalai Tin-Lined", "Heavy-Gauge Solid Brass", "Generational Heirloom"],
  },
  "heritage-collection": {
    name: "The Heritage Collection",
    eyebrow: "Timeless Culinary & Dining Heirlooms",
    desc: "Heavy-gauge traditional brass kadhais, tin-lined cooking vessels, royal dinner thali sets, and ceremonial objects rooted in centuries of Indian metallurgy. Hand-beaten by hereditary masters and designed to last generations.",
    image: "/images/products/brass_kadhai_1790597181856.jpg",
    badges: ["Pure Kalai Tin-Lined", "Heavy-Gauge Solid Brass", "Generational Heirloom"],
  },
  copper: {
    name: "Copper Essentials",
    eyebrow: "Ayurvedic Living & Mindful Hydration",
    desc: "Seamless hand-hammered pure copper water bottles, carafes, tumblers, and water dispensers engineered for daily Ayurvedic wellness and natural antimicrobial vitality.",
    image: "/images/products/copper_water_bottle_1790597102251.jpg",
    badges: ["99.5% Pure Copper", "Ayurvedic Tamra Jal", "Leakproof Brass Caps"],
  },
  hardware: {
    name: "Hardware Edit",
    eyebrow: "Architectural Accents & Fine Details",
    desc: "Solid unlacquered brass cabinet pulls, knurled knobs, statement door knockers, and coat hooks that age gracefully and acquire an organic living patina over time.",
    image: "/images/products/brass_cabinet_knobs_1790656185437.jpg",
    badges: ["Solid Cast Brass", "Unlacquered Living Finish", "Mounting Hardware Included"],
  },
  home: {
    name: "Objects for the Home",
    eyebrow: "Sculptural Living & Radiant Decor",
    desc: "Hand-hammered brass vases, engraved pillar candleholders, decorative centerpiece trays, and traditional floating urlis that bring warm golden radiance to any room.",
    image: "/images/products/brass_urli_bowl_1790597314906.jpg",
    badges: ["Hand-Engraved Detailing", "Solid Heavy Brass", "Festive & Daily Decor"],
  },
  drinkware: {
    name: "Ritual Drinkware",
    eyebrow: "Ancient Traditions, Modern Dining",
    desc: "Handcrafted brass and copper drinking glasses, tumblers, water jugs, and regal 5L dispensers designed for everyday dining elegance.",
    image: "/images/products/brass_water_dispenser_1790597134328.jpg",
    badges: ["Artisan Hammered Finish", "Pure Copper & Brass", "Eco-Friendly Living"],
  },
  gifting: {
    name: "Curated Gift Sets",
    eyebrow: "Treasured Keepsakes For Special Moments",
    desc: "Thoughtfully assembled brass and copper gift hampers for weddings, Diwali, housewarmings, and festive occasions, presented in satin-lined keepsake boxes.",
    image: "/images/products/copper_gift_box_1790597352148.jpg",
    badges: ["Luxury Satin Packaging", "Custom Engraving Available", "Complimentary Gift Card"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = COLLECTION_METADATA[slug];
  const name = meta?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Collection";
  const desc = meta?.desc || `Shop the curated ${name} of solid brass and copper objects.`;

  return {
    title: `${name} — Mello Metallo`,
    description: desc,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const meta = COLLECTION_METADATA[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Collection",
    eyebrow: "Curated Collection",
    desc: "Curated objects in pure brass and copper, handcrafted by master artisans.",
    image: "/images/products/brass_kadhai_1790597181856.jpg",
    badges: ["Solid Brass & Copper", "Artisan Made", "Lifetime Quality"],
  };

  // Fetch complementary related products from DB
  await connectDB();
  const relatedProducts = await Product.find({
    status: "published",
    featured: true,
  })
    .select("name slug price compareAtPrice images rating material shortDescription")
    .limit(4)
    .lean();

  return (
    <div className="bg-[#F8F5EF] min-h-screen">
      {/* ── Collection Hero Section ── */}
      <section className="relative min-h-[420px] md:min-h-[480px] flex items-center justify-center overflow-hidden bg-[#1A1714]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={meta.image}
            alt={meta.name}
            className="w-full h-full object-cover object-center brightness-[0.45] scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/40 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-site py-16 text-center text-[#F8F5EF] max-w-4xl">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase text-[#D4CFC5] mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-[#8B7355]" />
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <ChevronRight size={10} className="text-[#8B7355]" />
            <span className="text-[#F8F5EF] font-medium">{meta.name}</span>
          </nav>

          <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-semibold text-[#C4AB8A] mb-3">
            {meta.eyebrow}
          </p>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F8F5EF] font-light leading-[1.1] mb-5 tracking-tight">
            {meta.name}
          </h1>

          <p className="text-sm md:text-base font-sans text-[#EDE8DF] max-w-2xl mx-auto leading-relaxed mb-8">
            {meta.desc}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8">
            {meta.badges.map((badge) => (
              <span
                key={badge}
                className="px-3.5 py-1 text-[11px] font-sans tracking-wider uppercase border border-[#8B7355]/60 bg-[#1A1714]/70 text-[#EDE8DF]"
              >
                {badge}
              </span>
            ))}
          </div>

          <a
            href="#collection-products"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] px-6 py-3 border border-[#F8F5EF]/80 text-[#F8F5EF] hover:bg-[#F8F5EF] hover:text-[#1A1714] transition-all duration-300"
          >
            Explore Collection <ArrowDown size={13} />
          </a>
        </div>
      </section>

      {/* ── Products Catalog Section ── */}
      <div id="collection-products">
        <ShopClient defaultCollection={slug} />
      </div>

      {/* ── Related Artisan Recommendations ── */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-[#D4CFC5] bg-[#EDE8DF] py-16">
          <div className="container-site">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#D4CFC5]">
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8B7355] font-semibold mb-1">
                  Artisan Recommendations
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1A1714] font-normal">
                  Complementary Handcrafted Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-sans uppercase tracking-widest text-[#8B7355] hover:text-[#1A1714] transition-colors inline-flex items-center gap-1"
              >
                View Full Catalog <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod: any) => {
                const imgUrl = prod.images?.[0]?.url || "/images/copper_drinkware_1787586869011.png";
                return (
                  <Link
                    key={prod._id.toString()}
                    href={`/products/${prod.slug}`}
                    className="group block bg-[#FAF7F2] border border-[#D4CFC5] hover:border-[#8B7355] transition-all duration-300 shadow-sm"
                  >
                    <div className="aspect-square overflow-hidden relative bg-[#EDE8DF]">
                      <img
                        src={imgUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {prod.material && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] uppercase tracking-wider bg-[#1A1714]/80 text-[#F8F5EF] font-sans">
                          {prod.material}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base text-[#1A1714] group-hover:text-[#8B7355] transition-colors line-clamp-1 mb-1 font-normal">
                        {prod.name}
                      </h3>
                      <p className="font-sans text-xs font-semibold text-[#8B7355]">
                        ₹{prod.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
