"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, ArrowRight } from "lucide-react";
import { useCartStore, useCurrencyStore } from "@/store";

export default function CheckoutPage() {
  const { items, subtotalINR, clearCart } = useCartStore();
  const { format } = useCurrencyStore();
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [orderNumber, setOrderNumber] = useState("LC-XXXX");
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? subtotalINR() : 0;
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 350;
  const total = subtotal + shippingFee;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a deterministic-looking order number on client only
    const num = Date.now().toString().slice(-4);
    setOrderNumber(`LC-${num}`);
    setStep("confirmation");
    clearCart();
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-ivory py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-cream p-8 text-center border border-sand shadow-luxury"
        >
          <div className="w-16 h-16 bg-brass text-ivory rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} strokeWidth={2} />
          </div>
          <p className="label-uppercase mb-2">Order Confirmed</p>
          <h1 className="font-serif text-3xl text-espresso mb-3">Thank You for Your Order</h1>
          <p className="text-xs font-sans text-muted mb-6">
            Order <span className="text-charcoal font-medium">{orderNumber}</span> has been placed successfully.
            A confirmation email will be sent to{" "}
            <span className="text-charcoal font-medium">{formData.email || "your email"}</span>.
          </p>

          <div className="bg-ivory p-4 text-left border border-sand mb-6 text-xs font-sans space-y-1.5">
            <p className="font-semibold text-charcoal mb-2">Shipping Details</p>
            <p className="text-muted">{formData.firstName} {formData.lastName}</p>
            <p className="text-muted">{formData.address}</p>
            <p className="text-muted">{formData.city}, {formData.state} {formData.zip}</p>
            <p className="text-muted">{formData.phone}</p>
          </div>

          <div className="bg-brass/10 border border-brass/20 p-3 rounded mb-6 text-xs font-sans text-charcoal">
            <p className="font-semibold mb-1">Cash on Delivery</p>
            <p className="text-muted">Please keep the exact amount ready at the time of delivery.</p>
          </div>

          <Link href="/shop" className="btn-primary w-full justify-center">
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top Header */}
      <header className="border-b border-sand py-4 bg-ivory">
        <div className="container-site flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-[0.15em] text-espresso uppercase font-light">
            Laiton <span className="text-brass">&</span> Co
          </Link>
          <div className="flex items-center gap-2 text-xs font-sans text-muted">
            <Lock size={13} className="text-brass" /> Secure Checkout
          </div>
        </div>
      </header>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7">
            {/* Step Navigation */}
            <div className="flex items-center gap-3 mb-8 text-xs font-sans font-semibold tracking-wider uppercase">
              <span className={step === "shipping" ? "text-brass" : "text-muted"}>1. Shipping</span>
              <span className="text-muted">/</span>
              <span className={step === "payment" ? "text-brass" : "text-muted"}>2. Payment</span>
            </div>

            {step === "shipping" ? (
              <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-espresso mb-4">Contact Information</h2>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="input-luxury"
                  />
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-espresso mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First Name"
                      className="input-luxury"
                    />
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last Name"
                      className="input-luxury"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street Address, Flat / Apartment"
                    className="input-luxury mt-4"
                  />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="input-luxury"
                    />
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="input-luxury"
                    />
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="PIN Code"
                      className="input-luxury"
                    />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone Number (for delivery updates)"
                    className="input-luxury mt-4"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-4">
                  Proceed to Payment <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-espresso mb-4">Payment Method</h2>

                  {/* COD Only */}
                  <label className="flex items-center gap-4 p-5 border border-brass bg-brass/5 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked
                      readOnly
                      style={{ accentColor: "var(--brass)" }}
                    />
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-sm font-sans font-semibold text-charcoal">Cash on Delivery</p>
                      <p className="text-xs font-sans text-muted mt-0.5">Pay in cash when your order arrives.</p>
                    </div>
                  </label>

                  <div className="mt-3 p-3 bg-sand/40 border border-sand text-xs font-sans text-muted rounded">
                    Online payment gateway coming soon. We currently accept <strong className="text-charcoal">Cash on Delivery</strong> across India.
                  </div>
                </div>

                {/* Order review */}
                <div className="p-4 bg-cream border border-sand rounded text-xs font-sans space-y-1">
                  <p className="font-semibold text-charcoal mb-2">Shipping to:</p>
                  <p className="text-muted">{formData.firstName} {formData.lastName} · {formData.phone}</p>
                  <p className="text-muted">{formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep("shipping")} className="btn-secondary py-4 px-6">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button type="submit" className="btn-brass flex-1 justify-center py-4">
                    Place Order (COD) — {mounted ? format(total) : "—"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-cream p-6 border border-sand sticky top-28">
              <h2 className="font-serif text-xl text-espresso mb-4">
                Order Summary ({mounted ? items.length : 0})
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin mb-4 pr-1">
                {mounted && items.map((item) => (
                  <div key={`${item.id}-${item.variantId}`} className="flex gap-3 text-xs font-sans">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-ivory flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal truncate">{item.name}</p>
                      <p className="text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-charcoal">{format(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
                {(!mounted || items.length === 0) && (
                  <p className="text-xs text-muted text-center py-4">Your cart is empty</p>
                )}
              </div>

              <div className="border-t border-sand pt-4 space-y-2 text-sm font-sans">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium">{mounted ? format(subtotal) : "—"}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="text-charcoal font-medium">
                    {mounted ? (shippingFee === 0 ? "FREE" : format(shippingFee)) : "—"}
                  </span>
                </div>
                {mounted && subtotal > 0 && subtotal < 5000 && (
                  <p className="text-[10px] text-muted">Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping</p>
                )}
                <div className="border-t border-sand pt-3 flex justify-between font-serif text-xl text-espresso font-semibold">
                  <span>Total</span>
                  <span>{mounted ? format(total) : "—"}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-sans text-muted">
                <Lock size={11} className="text-brass flex-shrink-0" />
                Secure checkout. COD payment at delivery.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
