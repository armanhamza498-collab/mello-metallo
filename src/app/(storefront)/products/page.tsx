import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop by Category — LAITON & CO",
  description:
    "Explore our full range of handcrafted brass and copper products — from cabinet hardware to cookware, drinkware, home decor and curated gifts.",
};

async function getCategories() {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

// Decorative category descriptions shown on the page even without DB descriptions
const CATEGORY_DESCS: Record<string, string> = {
  "cabinet-hardware": "Knobs, pulls, latches and hooks for kitchens, furniture, and cabinetry.",
  "door-hardware": "Door knobs, lever handles, and decorative escutcheons for every interior.",
  "kitchen-cookware": "Traditional brass kadhais, serving vessels, and thali sets.",
  drinkware: "Solid brass tumblers, copper water bottles, and elegant serving sets.",
  "home-decor": "Sculptural vases, candle holders, bowls, and planters for every room.",
  gifting: "Curated gift collections for weddings, housewarmings, and corporate occasions.",
};

const CATEGORY_ICONS: Record<string, string> = {
  "cabinet-hardware": "⊞",
  "door-hardware": "⊡",
  "kitchen-cookware": "◎",
  drinkware: "◇",
  "home-decor": "✦",
  gifting: "◈",
};

export default async function ProductsPage() {
  const categories: Category[] = await getCategories();

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── Hero Banner ── */}
      <section
        className="relative py-20 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--blush-light) 0%, #fff 50%, var(--blush-light) 100%)",
          borderBottom: "1px solid var(--blush)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, var(--rose) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 translate-x-1/3 translate-y-1/3"
          style={{ background: "radial-gradient(circle, var(--rose) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container-site relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 mb-6 text-xs font-sans" aria-label="Breadcrumb">
            <Link href="/" style={{ color: "var(--muted)" }} className="hover:text-rose transition-colors">Home</Link>
            <ChevronRight size={12} style={{ color: "var(--rose)" }} />
            <span style={{ color: "var(--rose-dark)" }} className="font-medium">Products</span>
          </nav>

          <p className="label-uppercase mb-4" style={{ color: "var(--rose-muted)" }}>
            Handcrafted in India
          </p>
          <h1
            className="font-serif mb-4"
            style={{ color: "var(--espresso)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 300 }}
          >
            Shop by Category
          </h1>
          <p
            className="text-sm font-sans max-w-xl mx-auto"
            style={{ color: "var(--muted)", lineHeight: 1.75 }}
          >
            Every piece is handcrafted from solid brass and copper — designed for modern living
            and made to be handed down through generations.
          </p>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="container-site py-16">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm font-sans" style={{ color: "var(--muted)" }}>
              No categories found. <Link href="/api/seed/categories" style={{ color: "var(--rose-dark)" }}>Seed categories</Link> first.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const desc = CATEGORY_DESCS[cat.slug] || "Explore our handcrafted collection.";
              const icon = CATEGORY_ICONS[cat.slug] || "◦";
              return (
                <Link
                  key={cat._id}
                  href={`/products/${cat.slug}`}
                  className="group block relative"
                  style={{
                    animationDelay: `${idx * 60}ms`,
                  }}
                >
                  <div
                    className="h-full p-8 flex flex-col transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid var(--blush)",
                      boxShadow: "0 2px 12px rgba(232,180,184,0.08)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--rose)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(232,180,184,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--blush)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(232,180,184,0.08)";
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 flex items-center justify-center mb-5 text-2xl"
                      style={{
                        backgroundColor: "var(--blush-light)",
                        color: "var(--rose-dark)",
                        border: "1px solid var(--blush)",
                      }}
                    >
                      {icon}
                    </div>

                    {/* Category number */}
                    <p
                      className="text-[10px] font-sans font-600 tracking-widest uppercase mb-2"
                      style={{ color: "var(--rose-muted)" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </p>

                    {/* Name */}
                    <h2
                      className="font-serif mb-3 transition-colors duration-200"
                      style={{
                        color: "var(--espresso)",
                        fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
                        fontWeight: 400,
                      }}
                    >
                      {cat.name}
                    </h2>

                    {/* Description */}
                    <p
                      className="text-sm font-sans mb-6 flex-1"
                      style={{ color: "var(--muted)", lineHeight: 1.7 }}
                    >
                      {desc}
                    </p>

                    {/* CTA */}
                    <div
                      className="flex items-center gap-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200"
                      style={{ color: "var(--rose-dark)" }}
                    >
                      Explore
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
                      style={{
                        background: "linear-gradient(90deg, var(--rose), var(--rose-dark))",
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                      }}
                      ref={(el) => {
                        if (!el) return;
                        const parent = el.closest("a");
                        if (!parent) return;
                        parent.addEventListener("mouseenter", () => { el.style.transform = "scaleX(1)"; });
                        parent.addEventListener("mouseleave", () => { el.style.transform = "scaleX(0)"; });
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Bottom CTA strip ── */}
      <section
        className="py-14 text-center"
        style={{
          background: "linear-gradient(135deg, var(--blush-light), #fff)",
          borderTop: "1px solid var(--blush)",
        }}
      >
        <div className="container-site max-w-2xl">
          <p className="label-uppercase mb-3" style={{ color: "var(--rose-muted)" }}>
            Can&apos;t find what you&apos;re looking for?
          </p>
          <h2
            className="font-serif mb-4"
            style={{ color: "var(--espresso)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300 }}
          >
            Browse all products
          </h2>
          <Link href="/shop" className="btn-rose inline-flex items-center gap-2">
            Shop All <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
