"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Minus, Plus, ChevronDown, ZoomIn, Shield, Truck, RefreshCw, Check, Loader2, AlertCircle } from "lucide-react";
import { useCartStore, useWishlistStore, useCurrencyStore } from "@/store";

const FALLBACK_IMAGE = "/images/copper_drinkware_1787586869011.png";

interface ImageItem {
  url: string;
  alt?: string;
}

interface Specification {
  key: string;
  value: string;
}

interface CategoryRef {
  _id?: string;
  name: string;
  slug: string;
}

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  material?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  finishes?: string[];
  images: ImageItem[];
  specifications?: Specification[];
  careInstructions?: string;
  shippingInfo?: string;
  warranty?: string;
  whatsIncluded?: string;
  craftsmanship?: string;
  category?: CategoryRef;
  related?: ProductData[];
}

function AccordionSection({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-sand">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left font-sans">
        <span className="text-xs font-semibold tracking-widest uppercase text-charcoal">{label}</span>
        <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${open ? "rotate-180 text-brass" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm font-sans text-muted leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { format } = useCurrencyStore();

  // Scroll to top on mount / slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch product from API
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          if (data.product.finishes && data.product.finishes.length > 0) {
            setSelectedFinish(data.product.finishes[0]);
          } else {
            setSelectedFinish(data.product.material ? data.product.material.toUpperCase() : "STANDARD");
          }
        } else {
          setError("Product not found");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center py-24">
        <Loader2 size={36} className="text-brass animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center py-24 px-4 text-center">
        <AlertCircle size={48} className="text-muted mb-4" />
        <h1 className="font-serif text-3xl text-espresso mb-2">Product Not Found</h1>
        <p className="text-sm font-sans text-muted mb-6 max-w-md">
          The product you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link href="/shop" className="btn-primary">
          Return to Shop
        </Link>
      </div>
    );
  }

  const wished = isInWishlist(product._id);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const imagesList = product.images && product.images.length > 0 ? product.images : [{ url: FALLBACK_IMAGE, alt: product.name }];

  const handleImageError = (index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index: number) => {
    if (imgErrors[index] || !imagesList[index]?.url) return FALLBACK_IMAGE;
    return imagesList[index].url;
  };

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || `LC-${product._id.slice(-6)}`,
      image: getImageSrc(0),
      unitPrice: product.price,
      quantity,
      variantName: selectedFinish,
    });
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumbs */}
      <div className="container-site py-4 border-b border-sand">
        <p className="text-xs font-sans text-muted flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-brass transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brass transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brass transition-colors capitalize">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-charcoal font-medium">{product.name}</span>
        </p>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto scrollbar-hide">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-all ${selectedImage === i ? "border-brass scale-95" : "border-sand/40 hover:border-sand"}`}
                  >
                    <img
                      src={getImageSrc(i)}
                      alt={img.alt || product.name}
                      onError={() => handleImageError(i)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Display Image */}
            <div className="flex-1 relative group bg-cream">
              <div
                className="aspect-square overflow-hidden cursor-zoom-in relative"
                onClick={() => setZoomed(true)}
              >
                <img
                  key={selectedImage}
                  src={getImageSrc(selectedImage)}
                  alt={imagesList[selectedImage]?.alt || product.name}
                  onError={() => handleImageError(selectedImage)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                />
              </div>
              <button
                onClick={() => setZoomed(true)}
                className="absolute top-4 right-4 w-9 h-9 bg-ivory/90 hover:bg-brass hover:text-ivory text-charcoal flex items-center justify-center transition-all shadow-sm"
                aria-label="Zoom image"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="label-uppercase mb-2">
              {product.material ? `${product.material.toUpperCase()} · HAND-FINISHED` : "SOLID METAL · HAND-FINISHED"}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-espresso font-light leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5 text-brass">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs font-sans text-muted">
                {(product.rating || 5.0).toFixed(1)} ({product.reviewCount || 12} customer reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-sand">
              <span className="font-serif text-3xl text-espresso font-normal">{format(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-base font-sans text-muted line-through">{format(product.compareAtPrice)}</span>
                  {discount && <span className="badge badge-brass">Save {discount}%</span>}
                </>
              )}
            </div>

            {product.shortDescription && (
              <p className="font-sans text-sm text-muted leading-relaxed mb-6">{product.shortDescription}</p>
            )}

            {/* Finishes */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-sans font-semibold tracking-widest uppercase text-charcoal mb-3">
                  Selected Finish: <span className="text-brass font-normal uppercase">{selectedFinish}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.finishes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFinish(f)}
                      className={`px-4 py-2 text-xs font-sans uppercase tracking-wider border transition-all ${selectedFinish === f ? "border-brass text-brass bg-brass/10 font-semibold" : "border-sand text-charcoal hover:border-brass"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border border-sand w-fit bg-ivory">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-10 text-center font-sans font-semibold text-sm text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 justify-center py-3"
              >
                <ShoppingBag size={15} />
                {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>

            {/* Buy Now & Wishlist */}
            <div className="flex gap-3 mb-8 pb-6 border-b border-sand">
              <Link href="/checkout" className="btn-brass flex-1 justify-center py-3 text-center">
                Buy Now
              </Link>
              <button
                onClick={() => toggleItem(product._id)}
                className={`p-3 border transition-colors flex items-center justify-center ${wished ? "border-brass text-brass bg-brass/5" : "border-sand text-charcoal hover:border-brass"}`}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={wished ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, title: "100% Solid Metal", desc: "No plating, no rust" },
                { icon: Truck, title: "Free Shipping", desc: "On orders over ₹5,000" },
                { icon: RefreshCw, title: "7-Day Returns", desc: "Hassle-free guarantee" },
                { icon: Check, title: "Handcrafted", desc: "Made in India" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-3 bg-cream/70 border border-sand flex items-start gap-2.5">
                    <Icon size={16} className="text-brass flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-sans font-semibold text-charcoal">{item.title}</p>
                      <p className="text-[11px] font-sans text-muted">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="mt-16 max-w-3xl">
          {product.description && (
            <AccordionSection label="Description" defaultOpen>
              <div
                className="prose-luxury"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </AccordionSection>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <AccordionSection label="Specifications">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {product.specifications.map((s, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 border-b border-sand/50">
                    <span className="text-muted">{s.key}</span>
                    <span className="font-medium text-charcoal">{s.value}</span>
                  </div>
                ))}
              </div>
            </AccordionSection>
          )}

          {product.careInstructions && (
            <AccordionSection label="Care & Maintenance">
              <p>{product.careInstructions}</p>
            </AccordionSection>
          )}

          {product.shippingInfo && (
            <AccordionSection label="Shipping & Delivery">
              <p>{product.shippingInfo}</p>
            </AccordionSection>
          )}

          {product.warranty && (
            <AccordionSection label="Warranty & Guarantee">
              <p>{product.warranty}</p>
            </AccordionSection>
          )}
        </div>

        {/* Related Products */}
        {product.related && product.related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-sand">
            <h2 className="font-serif text-2xl text-espresso mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {product.related.map((rel) => (
                <Link key={rel._id} href={`/products/${rel.slug}`} className="group block">
                  <div className="aspect-square bg-cream overflow-hidden mb-3">
                    <img
                      src={rel.images?.[0]?.url || FALLBACK_IMAGE}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xs font-sans font-medium text-charcoal group-hover:text-brass transition-colors line-clamp-1 mb-1">{rel.name}</h3>
                  <p className="text-xs font-sans font-semibold text-charcoal">{format(rel.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso/90 z-[90] flex items-center justify-center p-6"
            onClick={() => setZoomed(false)}
          >
            <img
              src={getImageSrc(selectedImage)}
              alt="Zoomed view"
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
