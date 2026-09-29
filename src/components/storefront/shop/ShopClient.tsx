"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Star, Heart, ShoppingBag, Grid3X3, LayoutList, Loader2 } from "lucide-react";
import { useCartStore, useWishlistStore, useCurrencyStore } from "@/store";

const FILTERS = {
  material: ["Brass", "Copper"],
  finish: ["Polished Brass", "Antique Brass", "Brushed Brass", "Aged Brass", "Hammered", "Copper"],
  availability: ["In Stock", "Out of Stock"],
};

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "createdAt_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Selling", value: "bestseller" },
  { label: "Highest Rated", value: "rating_desc" },
];

interface Product {
  _id: string;
  name: string;
  slug: string;
  material: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string }[];
  rating: number;
  reviewCount: number;
  stock: number;
  finishes?: string[];
  category?: { name: string; slug: string };
}

interface ActiveFilter {
  type: string;
  value: string;
}

function FilterSidebar({ activeFilters, onToggle }: { activeFilters: ActiveFilter[]; onToggle: (type: string, value: string) => void }) {
  const [openSections, setOpenSections] = useState(["material", "finish", "availability"]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]);
  };

  return (
    <aside
      className="w-64 flex-shrink-0 p-5 border shadow-sm self-start"
      style={{
        backgroundColor: "#FAF7F2",
        borderColor: "#D4CFC5",
      }}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D4CFC5]">
        <h2 className="font-serif text-xl text-espresso tracking-tight">Refine Selection</h2>
        {activeFilters.length > 0 && (
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#8B7355] bg-[#EDE8DF] px-2 py-0.5">
            {activeFilters.length} active
          </span>
        )}
      </div>
      {Object.entries(FILTERS).map(([key, options]) => (
        <div key={key} className="border-b border-[#D4CFC5] last:border-0 py-1">
          <button
            onClick={() => toggleSection(key)}
            className="w-full flex items-center justify-between py-2.5 text-left group"
          >
            <span className="font-sans text-[11px] font-semibold tracking-widest uppercase text-charcoal group-hover:text-brass transition-colors">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <ChevronDown size={14} className={`text-muted transition-transform duration-200 ${openSections.includes(key) ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openSections.includes(key) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-1 pb-3 space-y-2">
                  {options.map((opt) => {
                    const active = activeFilters.some((f) => f.type === key && f.value === opt);
                    return (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 cursor-pointer group select-none"
                        onClick={(e) => {
                          e.preventDefault();
                          onToggle(key, opt);
                        }}
                      >
                        <div
                          className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                            active
                              ? "bg-[#8B7355] border-[#8B7355]"
                              : "border-[#D4CFC5] bg-[#FFFFFF] group-hover:border-[#8B7355]"
                          }`}
                        >
                          {active && <X size={10} className="text-[#F8F5EF]" />}
                        </div>
                        <span className={`text-xs font-sans transition-colors ${active ? "text-[#8B7355] font-medium" : "text-[#2C2A27] group-hover:text-[#8B7355]"}`}>
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </aside>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { format } = useCurrencyStore();
  const wished = isInWishlist(product._id);
  const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : null;
  const image = product.images?.[0]?.url || "/images/copper_drinkware_1787586869011.png";

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-product bg-cream overflow-hidden mb-3">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
          />
          {discount && (
            <span className="absolute top-2 left-2 badge badge-brass">−{discount}%</span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 badge" style={{ background: "#888", color: "#fff" }}>Out of Stock</span>
          )}
          {/* Quick actions */}
          <div className="absolute bottom-0 inset-x-0 p-2 flex gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
            <button
              onClick={(e) => { e.preventDefault(); toggleItem(product._id); }}
              className={`w-8 h-8 bg-ivory/95 flex items-center justify-center hover:bg-brass hover:text-ivory transition-colors ${wished ? "text-brass" : "text-charcoal"}`}
            >
              <Heart size={13} fill={wished ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem({ id: product._id, name: product.name, slug: product.slug, sku: `LC-${product._id}`, image, unitPrice: product.price, quantity: 1 });
                openCart();
              }}
              className="flex-1 h-8 bg-espresso text-ivory text-[9px] font-sans font-bold tracking-widest uppercase hover:bg-brass transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingBag size={11} /> Add to Cart
            </button>
          </div>
        </div>
        <p className="text-[10px] font-sans text-muted uppercase tracking-wider mb-1 capitalize">{product.material}</p>
        <h3 className="font-sans text-sm font-medium text-charcoal group-hover:text-brass transition-colors mb-1.5 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="text-brass" fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
          ))}
          <span className="text-[10px] text-muted font-sans">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans font-semibold text-charcoal text-sm">{format(product.price)}</span>
          {product.compareAtPrice && <span className="text-xs text-muted line-through">{format(product.compareAtPrice)}</span>}
        </div>
      </Link>
    </div>
  );
}

export default function ShopClient({
  defaultCategory,
  defaultCollection,
}: {
  defaultCategory?: string;
  defaultCollection?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Derive initial filters from URL params
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(() => {
    const initial: ActiveFilter[] = [];
    const mat = searchParams.get("material");
    const fin = searchParams.get("finish");
    const avail = searchParams.get("availability");
    if (mat) initial.push({ type: "material", value: mat.charAt(0).toUpperCase() + mat.slice(1).toLowerCase() });
    if (fin) initial.push({ type: "finish", value: fin });
    if (avail) initial.push({ type: "availability", value: avail });
    return initial;
  });

  const [sort, setSort] = useState(() => searchParams.get("sort") || "featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const pageTitle = defaultCategory
    ? defaultCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : defaultCollection
    ? defaultCollection.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Collection"
    : searchParams.get("material")
    ? (searchParams.get("material")!.charAt(0).toUpperCase() + searchParams.get("material")!.slice(1)) + " Products"
    : "All Products";

  // Fetch products from API
  const fetchProducts = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("limit", "24");
      params.set("sort", sort);

      // Category from prop or URL
      const cat = defaultCategory || searchParams.get("category");
      if (cat) params.set("category", cat);

      // Collection from prop or URL
      const col = defaultCollection || searchParams.get("collection");
      if (col) params.set("collection", col);

      // Active filters
      activeFilters.forEach((f) => {
        if (f.type === "material") params.set("material", f.value.toLowerCase());
        if (f.type === "finish") params.set("finish", f.value);
        if (f.type === "availability") params.set("availability", f.value);
      });

      // URL search params override
      const urlMaterial = searchParams.get("material");
      if (urlMaterial && !activeFilters.some(f => f.type === "material")) {
        params.set("material", urlMaterial);
      }

      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (pageNum === 1) {
          setProducts(data.products || []);
        } else {
          setProducts((prev) => [...prev, ...(data.products || [])]);
        }
        setTotal(data.pagination?.total || 0);
        setPages(data.pagination?.pages || 1);
        setPage(pageNum);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, sort, defaultCategory, defaultCollection, searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, sort, defaultCategory, defaultCollection]);

  const toggleFilter = (type: string, value: string) => {
    setActiveFilters((prev) => {
      const exists = prev.find((f) => f.type === type && f.value === value);
      return exists ? prev.filter((f) => !(f.type === type && f.value === value)) : [...prev, { type, value }];
    });
  };

  const removeFilter = (type: string, value: string) => toggleFilter(type, value);
  const selectedSort = SORT_OPTIONS.find((s) => s.value === sort)?.label || "Featured";

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumbs */}
      <div className="container-site py-4 border-b border-sand">
        <p className="text-xs font-sans text-muted">
          <Link href="/" className="hover:text-brass transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">Shop</span>
          {(defaultCategory || defaultCollection) && (
            <>
              <span className="mx-2">/</span>
              <span className="text-charcoal">{pageTitle}</span>
            </>
          )}
        </p>
      </div>

      {/* Header */}
      <div className="container-site py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-espresso font-light">{pageTitle}</h1>
            <p className="text-sm font-sans text-muted mt-1">
              {loading ? "Loading…" : `${total} product${total !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter btn */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 btn-secondary py-2.5 px-4 text-xs"
            >
              <SlidersHorizontal size={14} /> Filters
              {activeFilters.length > 0 && <span className="badge badge-brass">{activeFilters.length}</span>}
            </button>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 py-2.5 px-4 text-xs font-sans uppercase tracking-widest font-medium border transition-colors shadow-sm"
                style={{
                  backgroundColor: "#FAF7F2",
                  borderColor: "#D4CFC5",
                  color: "#2C2A27",
                }}
              >
                Sort: {selectedSort}{" "}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 border shadow-xl z-50 min-w-[210px] py-1"
                    style={{
                      backgroundColor: "#FAF7F2",
                      borderColor: "#D4CFC5",
                      boxShadow: "0 14px 40px rgba(26,23,20,0.18)",
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-sans uppercase tracking-wider transition-colors block"
                        style={{
                          backgroundColor: sort === opt.value ? "#EDE8DF" : "transparent",
                          color: sort === opt.value ? "#8B7355" : "#2C2A27",
                          fontWeight: sort === opt.value ? 600 : 400,
                        }}
                        onMouseEnter={(e) => {
                          if (sort !== opt.value) e.currentTarget.style.backgroundColor = "#EDE8DF";
                        }}
                        onMouseLeave={(e) => {
                          if (sort !== opt.value) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid toggle */}
            <div className="hidden md:flex border border-sand">
              <button onClick={() => setGridCols(3)} className={`p-2.5 ${gridCols === 3 ? "bg-charcoal text-ivory" : "text-muted hover:text-charcoal"} transition-colors`}>
                <Grid3X3 size={14} />
              </button>
              <button onClick={() => setGridCols(4)} className={`p-2.5 ${gridCols === 4 ? "bg-charcoal text-ivory" : "text-muted hover:text-charcoal"} transition-colors`}>
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((f) => (
              <button
                key={`${f.type}-${f.value}`}
                onClick={() => removeFilter(f.type, f.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-sand text-xs font-sans text-charcoal hover:border-brass transition-colors"
              >
                {f.value} <X size={11} />
              </button>
            ))}
            <button
              onClick={() => setActiveFilters([])}
              className="text-xs font-sans text-muted hover:text-brass transition-colors underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar activeFilters={activeFilters} onToggle={toggleFilter} />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading && products.length === 0 ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={32} className="text-brass animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-espresso mb-2">No products found</p>
                <p className="text-sm font-sans text-muted mb-6">Try adjusting your filters or browse our full collection.</p>
                <button onClick={() => setActiveFilters([])} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-5 ${gridCols === 4 ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
                  {products.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.4) }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                {page < pages && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => fetchProducts(page + 1)}
                      disabled={loading}
                      className="btn-secondary px-10 disabled:opacity-60"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Load More Products"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso/40 z-50 lg:hidden" onClick={() => setMobileFilterOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35 }}
              className="fixed inset-y-0 left-0 w-80 z-[60] overflow-y-auto shadow-2xl"
              style={{ backgroundColor: "#FAF7F2", borderRight: "1px solid #D4CFC5" }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl text-espresso">Filters</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-muted hover:text-charcoal"><X size={20} /></button>
                </div>
                <FilterSidebar activeFilters={activeFilters} onToggle={toggleFilter} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
