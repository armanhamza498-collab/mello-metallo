"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ArrowRight, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; alt?: string }[];
  rating: number;
  reviewCount: number;
  stock: number;
  newArrival: boolean;
  bestseller: boolean;
  material: string;
}

interface SubcategoryInfo {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; alt?: string };
}

interface CategoryInfo {
  name: string;
  slug: string;
}

export default function SubcategoryProductsPage() {
  const params = useParams<{ slug: string; subcategorySlug: string }>();
  const { slug: categorySlug, subcategorySlug } = params;

  const [subcategory, setSubcategory] = useState<SubcategoryInfo | null>(null);
  const [parentCategory, setParentCategory] = useState<CategoryInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productTotal, setProductTotal] = useState(0);
  const [sort, setSort] = useState("featured");

  // Load subcategory info + parent category
  useEffect(() => {
    fetch(`/api/categories/${categorySlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setParentCategory(data.category);
          const sub = data.subcategories?.find(
            (s: SubcategoryInfo) => s.slug === subcategorySlug
          );
          if (sub) setSubcategory(sub);
        }
      })
      .catch(() => {});
  }, [categorySlug, subcategorySlug]);

  // Load products by subcategory
  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams({ subcategory: subcategorySlug, sort, limit: "24" });
    fetch(`/api/products?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setProductTotal(data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [subcategorySlug, sort]);

  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── Hero — Subcategory image + description ── */}
      {subcategory?.image?.url ? (
        <section className="relative overflow-hidden" style={{ height: "clamp(300px, 42vw, 500px)" }}>
          <img
            src={subcategory.image.url}
            alt={subcategory.image.alt || subcategory.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(26,23,20,0.78) 0%, rgba(26,23,20,0.38) 50%, rgba(26,23,20,0.12) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-center">
            <div className="container-site">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 mb-5 text-xs font-sans flex-wrap" aria-label="Breadcrumb">
                <Link href="/" style={{ color: "rgba(248,245,239,0.65)" }}>Home</Link>
                <ChevronRight size={10} style={{ color: "var(--rose)" }} />
                <Link href="/products" style={{ color: "rgba(248,245,239,0.65)" }}>Products</Link>
                <ChevronRight size={10} style={{ color: "var(--rose)" }} />
                <Link href={`/products/${categorySlug}`} style={{ color: "rgba(248,245,239,0.65)" }}>
                  {parentCategory?.name || categorySlug}
                </Link>
                <ChevronRight size={10} style={{ color: "var(--rose)" }} />
                <span style={{ color: "var(--rose)" }}>{subcategory.name}</span>
              </nav>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="label-uppercase mb-2"
                style={{ color: "var(--rose)" }}
              >
                {parentCategory?.name}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="font-serif mb-4"
                style={{
                  color: "#fff",
                  fontSize: "clamp(1.8rem, 5vw, 3.4rem)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  maxWidth: "580px",
                }}
              >
                {subcategory.name}
              </motion.h1>

              {subcategory.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                  className="text-sm font-sans max-w-lg"
                  style={{ color: "rgba(248,245,239,0.82)", lineHeight: 1.8 }}
                >
                  {subcategory.description}
                </motion.p>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* Fallback plain hero */
        <section
          className="py-14 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, var(--blush-light) 0%, #fff 60%, var(--blush-light) 100%)",
            borderBottom: "1px solid var(--blush)",
          }}
        >
          <div className="container-site">
            <nav className="flex items-center gap-2 mb-5 text-xs font-sans flex-wrap" aria-label="Breadcrumb">
              <Link href="/" style={{ color: "var(--muted)" }}>Home</Link>
              <ChevronRight size={10} style={{ color: "var(--rose)" }} />
              <Link href="/products" style={{ color: "var(--muted)" }}>Products</Link>
              <ChevronRight size={10} style={{ color: "var(--rose)" }} />
              <Link href={`/products/${categorySlug}`} style={{ color: "var(--muted)" }}>
                {parentCategory?.name || categorySlug}
              </Link>
              <ChevronRight size={10} style={{ color: "var(--rose)" }} />
              <span style={{ color: "var(--rose-dark)" }}>{subcategory?.name || subcategorySlug}</span>
            </nav>
            <p className="label-uppercase mb-2" style={{ color: "var(--rose-muted)" }}>{parentCategory?.name}</p>
            <h1 className="font-serif mb-3" style={{ color: "var(--espresso)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300 }}>
              {subcategory?.name || subcategorySlug.replace(/-/g, " ")}
            </h1>
            {subcategory?.description && (
              <p className="text-sm font-sans max-w-lg" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                {subcategory.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Products Grid ── */}
      <section className="container-site py-12">

        {/* Toolbar */}
        <div
          className="flex items-center justify-between mb-8 pb-4 gap-4 flex-wrap"
          style={{ borderBottom: "1px solid var(--blush)" }}
        >
          <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>
            {loading ? "Loading…" : `${productTotal} product${productTotal !== 1 ? "s" : ""}`}
          </p>
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={14} style={{ color: "var(--rose-muted)" }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-sans font-medium px-3 py-1.5 outline-none cursor-pointer"
              style={{ color: "var(--charcoal)", border: "1px solid var(--blush)", backgroundColor: "#fff" }}
            >
              <option value="featured">Featured</option>
              <option value="createdAt_desc">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
              <option value="bestseller">Best Sellers</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "3/4" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif mb-4" style={{ color: "var(--espresso)", fontSize: "1.8rem", fontWeight: 300 }}>
              Coming Soon
            </p>
            <p className="text-sm font-sans mb-6" style={{ color: "var(--muted)" }}>
              Products in this subcategory are on their way.
            </p>
            <Link href="/shop" className="btn-rose inline-flex items-center gap-2">
              Browse All <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: idx * 0.04 }}
              >
                <Link href={`/products/${product.slug}`} className="group block">
                  <div
                    className="flex flex-col h-full transition-all duration-300"
                    style={{ backgroundColor: "#fff", border: "1px solid var(--blush)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--rose)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(232,180,184,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--blush)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Image */}
                    <div className="aspect-product overflow-hidden relative">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--blush-light)" }}
                        >
                          <span className="text-3xl" style={{ color: "var(--rose)" }}>◎</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.newArrival && (
                          <span className="badge" style={{ backgroundColor: "var(--blush)", color: "var(--rose-dark)" }}>New</span>
                        )}
                        {product.bestseller && (
                          <span className="badge" style={{ backgroundColor: "var(--espresso)", color: "#fff" }}>Best Seller</span>
                        )}
                        {product.stock === 0 && (
                          <span className="badge badge-muted">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <p
                        className="text-[10px] font-sans font-medium tracking-widest uppercase mb-1"
                        style={{ color: "var(--rose-muted)" }}
                      >
                        {product.material}
                      </p>
                      <h3
                        className="font-serif mb-2 transition-colors duration-200 group-hover:text-rose line-clamp-2"
                        style={{ color: "var(--espresso)", fontSize: "1rem", fontWeight: 400 }}
                      >
                        {product.name}
                      </h3>
                      {product.reviewCount > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="stars text-[11px]">
                            {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
                          </span>
                          <span className="text-[10px] font-sans" style={{ color: "var(--muted)" }}>
                            ({product.reviewCount})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-sm font-sans font-semibold" style={{ color: "var(--espresso)" }}>
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-xs font-sans line-through" style={{ color: "var(--muted)" }}>
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
