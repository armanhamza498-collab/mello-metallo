"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore, useWishlistStore, useCurrencyStore } from "@/store";

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
  bestseller?: boolean;
  newArrival?: boolean;
}

function ProductCard({ product }: { product: Product }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { format } = useCurrencyStore();
  const wished = isInWishlist(product._id);
  const image = product.images?.[0]?.url || "https://images.unsplash.com/photo-1585586723682-b4df7c864aab?w=600&q=80";
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;
  const badge = product.bestseller ? "Bestseller" : product.newArrival ? "New" : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id,
      name: product.name,
      slug: product.slug,
      sku: `LC-${product._id.slice(-6).toUpperCase()}`,
      image,
      unitPrice: product.price,
      quantity: 1,
    });
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group flex-shrink-0 w-[280px] md:w-[300px]">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-product bg-cream overflow-hidden mb-4">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-luxury"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-brass">{badge}</span>
            </div>
          )}

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-espresso text-ivory">−{discount}%</span>
            </div>
          )}

          {/* Quick actions overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-luxury">
            {/* Wishlist */}
            <button
              onClick={(e) => { e.preventDefault(); toggleItem(product._id); }}
              className={`w-9 h-9 flex items-center justify-center bg-ivory/95 hover:bg-brass hover:text-ivory transition-all duration-200 ${wished ? "text-brass" : "text-charcoal"}`}
              aria-label="Add to wishlist"
            >
              <Heart size={15} fill={wished ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-9 bg-espresso hover:bg-brass text-ivory text-[10px] font-sans font-semibold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              {addedToCart ? "✓ Added" : <><ShoppingBag size={13} /> Add to Cart</>}
            </button>
          </div>

          {/* Stock warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-0 inset-x-0 bg-warning/90 py-1 text-center text-[9px] font-sans font-semibold text-ivory tracking-wider uppercase group-hover:translate-y-full transition-transform duration-300">
              Only {product.stock} left
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="label-subtle mb-1 capitalize">{product.material}</p>
          <h3 className="font-sans text-sm font-medium text-charcoal group-hover:text-brass transition-colors duration-200 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className="text-brass"
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-[11px] font-sans text-muted">{product.rating.toFixed(1)} ({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-charcoal">{format(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs font-sans text-muted line-through">{format(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function BestsellersCarousel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?sort=bestseller&limit=10")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-cream overflow-hidden" ref={ref}>
      <div className="container-site">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="label-uppercase mb-3">Bestsellers</p>
            <h2 className="font-serif font-light text-espresso">The Favourites</h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 border border-sand hover:border-brass text-charcoal hover:text-brass flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 border border-sand hover:border-brass text-charcoal hover:text-brass flex items-center justify-center transition-colors"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {loading ? (
            <div className="flex gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] md:w-[300px] animate-pulse">
                  <div className="aspect-product bg-sand mb-4" />
                  <div className="h-3 bg-sand w-16 mb-2" />
                  <div className="h-4 bg-sand w-48 mb-2" />
                  <div className="h-3 bg-sand w-24" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-sans text-muted">No bestsellers yet. Check back soon!</p>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
