import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import ProductDetailClient from "@/components/storefront/product/ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; alt?: string };
}

interface CategoryData {
  category: { name: string; slug: string; description?: string };
  subcategories: Subcategory[];
}

async function getCategoryData(slug: string): Promise<CategoryData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/categories/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catData = await getCategoryData(slug);
  if (catData) {
    return {
      title: `${catData.category.name} — LAITON & CO`,
      description: `Shop handcrafted ${catData.category.name} — solid brass and copper, made in India.`,
    };
  }
  const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formatted} — LAITON & CO`,
    description: `Handcrafted brass and copper product — LAITON & CO`,
  };
}

export default async function ProductOrCategoryPage({ params }: Props) {
  const { slug } = await params;

  // Try as a category first
  const catData = await getCategoryData(slug);
  if (catData) {
    return <CategorySubcategoryGrid slug={slug} data={catData} />;
  }

  // Otherwise render as product detail
  return <ProductDetailClient slug={slug} />;
}

// ─── Category Subcategory Grid View ────────────────────────────
function CategorySubcategoryGrid({ slug, data }: { slug: string; data: CategoryData }) {
  const { category, subcategories } = data;

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section
        className="relative py-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--blush-light) 0%, #fff 60%, var(--blush-light) 100%)",
          borderBottom: "1px solid var(--blush)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, var(--rose) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="container-site relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs font-sans" aria-label="Breadcrumb">
            <Link href="/" style={{ color: "var(--muted)" }}>Home</Link>
            <ChevronRight size={11} style={{ color: "var(--rose)" }} />
            <Link href="/products" style={{ color: "var(--muted)" }}>Products</Link>
            <ChevronRight size={11} style={{ color: "var(--rose)" }} />
            <span style={{ color: "var(--rose-dark)" }} className="font-medium">{category.name}</span>
          </nav>

          <p className="label-uppercase mb-3" style={{ color: "var(--rose-muted)" }}>
            Browse Collection
          </p>
          <h1
            className="font-serif mb-3"
            style={{ color: "var(--espresso)", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 300 }}
          >
            {category.name}
          </h1>
          <p className="text-sm font-sans max-w-lg" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
            {category.description ??
              "Handcrafted from solid brass and copper — each piece is made to last and designed to be admired."}
          </p>
        </div>
      </section>

      {/* ── Subcategory Grid ── */}
      <section className="container-site py-14">
        {subcategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm font-sans mb-6" style={{ color: "var(--muted)" }}>
              Browse all products in {category.name}
            </p>
            <Link href={`/shop?category=${slug}`} className="btn-rose inline-flex items-center gap-2">
              View Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <p
              className="text-xs font-sans font-medium tracking-widest uppercase mb-8"
              style={{ color: "var(--rose-muted)" }}
            >
              {subcategories.length} {subcategories.length === 1 ? "Subcategory" : "Subcategories"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.map((sub, idx) => (
                <Link
                  key={sub._id}
                  href={`/products/${slug}/${sub.slug}`}
                  className="group block"
                >
                  <div
                    className="h-full flex flex-col transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid var(--blush)",
                      boxShadow: "0 2px 12px rgba(232,180,184,0.08)",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--rose)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 36px rgba(232,180,184,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--blush)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(232,180,184,0.08)";
                    }}
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      {sub.image?.url ? (
                        <img
                          src={sub.image.url}
                          alt={sub.image.alt || sub.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, var(--blush-light), var(--blush))" }}
                        >
                          <span className="text-4xl" style={{ color: "var(--rose)" }}>◎</span>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "linear-gradient(to top, rgba(196,119,139,0.15) 0%, transparent 60%)" }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <p
                        className="text-[10px] font-sans font-600 tracking-widest uppercase mb-2"
                        style={{ color: "var(--rose-muted)" }}
                      >
                        {String(idx + 1).padStart(2, "0")} · {category.name}
                      </p>
                      <h2
                        className="font-serif mb-2 transition-colors duration-200 group-hover:text-rose"
                        style={{ color: "var(--espresso)", fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 400 }}
                      >
                        {sub.name}
                      </h2>
                      {sub.description && (
                        <p
                          className="text-xs font-sans mb-4 flex-1 line-clamp-2"
                          style={{ color: "var(--muted)", lineHeight: 1.7 }}
                        >
                          {sub.description}
                        </p>
                      )}
                      <div
                        className="flex items-center gap-2 text-xs font-sans font-medium tracking-widest uppercase mt-auto transition-colors duration-200"
                        style={{ color: "var(--rose-dark)" }}
                      >
                        Shop Now
                        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
