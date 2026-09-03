"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCartStore, useCurrencyStore } from "@/store";
import { getBrassImage } from "@/lib/images";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotalINR } = useCartStore();
  const { format } = useCurrencyStore();

  const subtotal = subtotalINR();
  const FREE_SHIPPING_THRESHOLD = 5000; // INR
  const progressPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-espresso/60 z-[80] backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Slide-Over Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ backgroundColor: "#F9F8F5" }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] z-[90] flex flex-col border-l border-[#E2DDD5] shadow-2xl"
          >
            {/* Dark Luxury Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#1A1714] text-[#F8F5EF] border-b border-[#2C2A27]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8B7355]/20 flex items-center justify-center border border-[#8B7355]/40">
                  <ShoppingBag size={15} className="text-[#C4AB8A]" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-[#F8F5EF] font-light tracking-wide">Your Shopping Bag</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <span className="px-2.5 py-0.5 bg-[#8B7355] text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                )}
                <button
                  onClick={closeCart}
                  className="w-8 h-8 flex items-center justify-center text-[#9B9590] hover:text-[#F8F5EF] transition-colors rounded-full hover:bg-white/10"
                  aria-label="Close cart"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Free shipping progress banner */}
            {items.length > 0 && (
              <div className="px-6 py-3.5 bg-[#EDE8DF] border-b border-[#E2DDD5]">
                {subtotal < FREE_SHIPPING_THRESHOLD ? (
                  <>
                    <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                      <span className="text-[#2C2A27]">
                        Add <strong className="text-[#8B7355] font-semibold">{format(remaining)}</strong> for Free Express Delivery
                      </span>
                      <span className="text-[10px] text-[#8B7355] font-semibold uppercase tracking-wider">{Math.round(progressPct)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#D4CFC5] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        className="h-full bg-[#8B7355] rounded-full"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs font-sans text-[#2F6B3A] font-semibold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#8B7355]" /> You unlocked Free Insured Express Delivery!
                  </p>
                )}
              </div>
            )}

            {/* Items Scroll Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#F9F8F5]">
              {items.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                  <div className="w-16 h-16 bg-[#EDE8DF] rounded-full flex items-center justify-center mb-4 border border-[#D4CFC5]">
                    <ShoppingBag size={24} strokeWidth={1.2} className="text-[#8B7355]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#1A1714] mb-2 font-light">Your bag is empty</h3>
                  <p className="text-xs text-[#6B6660] font-sans max-w-xs mb-6 leading-relaxed">
                    Discover handcrafted brass hardware, cookware, and home decor to add to your collection.
                  </p>
                  <button onClick={closeCart} className="btn-primary text-xs px-8 py-3.5">
                    Explore Collections
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-3.5">
                  {items.map((item) => {
                    const imgSrc = item.image || getBrassImage(item.name);
                    return (
                      <motion.div
                        key={`${item.id}-${item.variantId}`}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 p-3.5 bg-white border border-[#E8E3DA] rounded-sm shadow-sm hover:border-[#8B7355]/40 transition-colors"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 bg-[#F8F5EF] flex-shrink-0 overflow-hidden border border-[#E8E3DA]">
                          <img
                            src={imgSrc}
                            alt={item.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getBrassImage(item.name);
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={closeCart}
                                className="text-xs font-sans font-semibold text-[#1A1714] hover:text-[#8B7355] transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <button
                                onClick={() => removeItem(item.id, item.variantId)}
                                className="text-[#9B9590] hover:text-[#B54040] transition-colors p-0.5"
                                title="Remove item"
                              >
                                <Trash2 size={13} strokeWidth={1.5} />
                              </button>
                            </div>
                            {item.variantName && (
                              <p className="text-[10px] text-[#8B7355] font-sans uppercase font-medium mt-0.5">{item.variantName}</p>
                            )}
                            <p className="text-[10px] text-[#9B9590] font-sans">SKU: {item.sku}</p>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0ECE4]">
                            {/* Quantity controls */}
                            <div className="flex items-center border border-[#D4CFC5] bg-[#F8F5EF] rounded-sm">
                              <button
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-[#EDE8DF] transition-colors text-[#2C2A27]"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-7 text-center text-xs font-sans font-semibold text-[#1A1714]">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-[#EDE8DF] transition-colors text-[#2C2A27]"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            {/* Item Price */}
                            <p className="font-serif text-base font-semibold text-[#8B7355]">
                              {format(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-[#E2DDD5] px-6 py-5 bg-[#EDE8DF] space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-sans text-[#6B6660] uppercase font-semibold tracking-wider">Subtotal</span>
                  <span className="font-serif text-3xl text-[#1A1714] font-semibold">{format(subtotal)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#6B6660]">
                  <ShieldCheck size={14} className="text-[#8B7355]" /> Taxes included · Free returns within 7 days
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full justify-center py-4 text-xs font-sans font-semibold uppercase tracking-widest bg-[#1A1714] hover:bg-[#8B7355] text-white transition-colors"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs font-sans text-[#6B6660] hover:text-[#8B7355] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
