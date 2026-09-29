"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  ShoppingBag,
  Heart,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";
import { useCartStore, useCurrencyStore, useWishlistStore } from "@/store";

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  material: string;
  images: { url: string; alt?: string }[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
}

interface Props {
  products: ProductItem[];
  subcategoryName: string;
  parentCategoryName: string;
  parentCategorySlug: string;
}

export default function SubcategoryProductGridClient({
  products,
  subcategoryName,
  parentCategoryName,
  parentCategorySlug,
}: Props) {
  const { addItem, openCart } = useCartStore();
  const { format } = useCurrencyStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [sort, setSort] = useState("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  // Sorting
  const sorted = [...products].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "rating_desc") return b.rating - a.rating;
    if (sort === "newest") return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product._id,
      name: product.name,
      slug: product.slug,
      sku: `LC-${product._id.slice(-6).toUpperCase()}`,
      image:
        product.images?.[0]?.url ||
        "/images/copper_drinkware_1787586869011.png",
      quantity: 1,
      variantId: product._id,
      unitPrice: product.price,
    });

    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
    openCart();
  };

  return (
    <div>
      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-5 border-b border-[#E8E2D8]">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8B7355] font-semibold mb-1">
            Artisan Catalog
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[#1A1612]">
            {subcategoryName} Objects
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-sans text-xs text-[#7A756E]">
            {sorted.length} {sorted.length === 1 ? "Product" : "Products"}
          </span>

          <div className="flex items-center gap-2 bg-white border border-[#E8E2D8] px-3 py-2 rounded-sm shadow-sm">
            <SlidersHorizontal size={13} className="text-[#8B7355]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="font-sans text-xs text-[#1A1612] bg-transparent outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Products Grid ─────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E8E2D8] p-8 max-w-lg mx-auto rounded-sm shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#8B7355]/10 flex items-center justify-center mx-auto mb-4 text-[#8B7355]">
            <ShoppingBag size={24} />
          </div>
          <h3 className="font-serif text-2xl text-[#1A1612] mb-2">
            Heirloom Pieces in Crafting
          </h3>
          <p className="font-sans text-xs text-[#7A756E] max-w-sm mx-auto mb-6 leading-relaxed">
            Our artisans are forging new {subcategoryName.toLowerCase()} pieces. In the meantime, browse the complete {parentCategoryName} collection.
          </p>
          <Link
            href={`/categories/${parentCategorySlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B7355] text-white font-sans text-xs tracking-wider uppercase font-semibold hover:bg-[#6B5640] transition-colors"
          >
            Explore {parentCategoryName}
            <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((product, idx) => {
            const isWish = isInWishlist(product._id);
            const isJustAdded = addedId === product._id;
            const primaryImg =
              product.images?.[0]?.url ||
              "/images/copper_drinkware_1787586869011.png";

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group flex flex-col bg-white border border-[#E8E2D8] hover:border-[#8B7355] rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container with Badges */}
                <Link
                  href={`/products/${product.slug}`}
                  className="aspect-[4/5] relative overflow-hidden bg-[#1A1612] block"
                >
                  <img
                    src={primaryImg}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.newArrival && (
                      <span className="px-2.5 py-0.5 bg-[#8B7355] text-[#F8F5EF] font-sans text-[9px] tracking-wider uppercase font-semibold rounded-sm">
                        New
                      </span>
                    )}
                    {product.bestseller && (
                      <span className="px-2.5 py-0.5 bg-[#110F0D] text-[#C4AB8A] border border-[#C4AB8A]/30 font-sans text-[9px] tracking-wider uppercase font-semibold rounded-sm">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleItem(product._id);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                      isWish
                        ? "bg-rose-50 text-rose-600 shadow"
                        : "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart size={14} className={isWish ? "fill-current" : ""} />
                  </button>
                </Link>

                {/* Product Information */}
                <div className="p-4 flex flex-col flex-1">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8B7355] mb-1">
                    {product.material}
                  </span>

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-serif text-lg text-[#1A1612] group-hover:text-[#8B7355] transition-colors leading-snug mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={
                            i < Math.round(product.rating)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    {product.reviewCount > 0 && (
                      <span className="font-sans text-[11px] text-[#7A756E]">
                        ({product.reviewCount})
                      </span>
                    )}
                  </div>

                  {/* Price & Action Button */}
                  <div className="mt-auto pt-3 border-t border-[#F2ECE3] flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-base font-semibold text-[#1A1612]">
                        {format(product.price)}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="font-mono text-xs text-[#9B9590] line-through">
                          {format(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`px-3.5 py-2 font-sans text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all duration-200 rounded-sm ${
                        isJustAdded
                          ? "bg-emerald-700 text-white"
                          : "bg-[#1A1612] text-[#F8F5EF] hover:bg-[#8B7355]"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={12} />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={12} />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
