"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, MapPin, Mail, Phone, User, CreditCard, Save } from "lucide-react";

interface OrderItem {
  productName: string;
  variantName?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: { address1?: string; city?: string; state?: string; postalCode?: string; country?: string; };
  paymentMethod?: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber?: string;
  courier?: string;
  internalNotes?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  items: OrderItem[];
  timeline?: { status: string; note?: string; timestamp: string; createdBy?: string }[];
}

const PAYMENT_COLORS: Record<string, string> = {
  paid: "text-success bg-success/10",
  pending: "text-warning bg-warning/10",
  failed: "text-error bg-error/10",
  refunded: "text-muted bg-muted/10",
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fulfillmentStatus, setFulfillmentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.order) {
          setOrder(data.order);
          setFulfillmentStatus(data.order.fulfillmentStatus);
          setTrackingNumber(data.order.trackingNumber || "");
          setCourier(data.order.courier || "");
          setInternalNotes(data.order.internalNotes || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillmentStatus, trackingNumber, courier, internalNotes }),
      });
      const data = await res.json();
      if (data.order) setOrder(data.order);
    } catch { alert("Failed to update order"); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--admin-accent)" }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>Order not found.</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-xs font-sans" style={{ color: "var(--admin-accent)" }}>← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-sans hover:underline" style={{ color: "var(--admin-text-muted)" }}>
          <ArrowLeft size={14} /> Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b" style={{ borderColor: "var(--admin-border)" }}>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-mono font-bold" style={{ color: "var(--admin-text)" }}>{order.orderNumber}</h1>
            <span className={`px-2.5 py-0.5 rounded text-xs font-sans font-semibold uppercase ${PAYMENT_COLORS[order.paymentStatus] || ""}`}>
              {order.paymentStatus}
            </span>
          </div>
          <p className="text-xs font-sans mt-1" style={{ color: "var(--admin-text-muted)" }}>
            Placed on {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={fulfillmentStatus}
            onChange={e => setFulfillmentStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border text-xs font-sans font-semibold outline-none uppercase"
            style={{ backgroundColor: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-accent)" }}
          >
            {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-semibold text-white disabled:opacity-60" style={{ backgroundColor: "var(--admin-accent)" }}>
            <Save size={13} />{saving ? "Saving..." : "Update Order"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="text-sm font-sans font-semibold mb-4" style={{ color: "var(--admin-text)" }}>Items Ordered ({order.items.length})</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: "var(--admin-border)" }}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[--admin-surface-3]">
                    {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full flex items-center justify-center text-[10px]" style={{ color: "var(--admin-text-muted)" }}>No img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-sans font-medium" style={{ color: "var(--admin-text)" }}>{item.productName}</p>
                    {item.variantName && <p className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>{item.variantName}</p>}
                    <p className="text-xs font-sans mt-0.5" style={{ color: "var(--admin-text-muted)" }}>SKU: {item.sku} · ₹{item.unitPrice.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>₹{(item.unitPrice * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t space-y-2 text-xs font-sans" style={{ borderColor: "var(--admin-border)" }}>
              <div className="flex justify-between" style={{ color: "var(--admin-text-muted)" }}><span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between" style={{ color: "var(--admin-text-muted)" }}><span>Shipping</span><span>₹{order.shippingCost.toLocaleString()}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>−₹{order.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between pt-2 text-sm font-semibold border-t" style={{ borderColor: "var(--admin-border)", color: "var(--admin-text)" }}>
                <span>Total</span><span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment & Tracking */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="text-sm font-sans font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
              <Truck size={16} className="text-[--admin-accent]" /> Shipping & Tracking
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans mb-1" style={{ color: "var(--admin-text-muted)" }}>Carrier / Courier</label>
                <input type="text" value={courier} onChange={e => setCourier(e.target.value)} placeholder="e.g. BlueDart, Delhivery" className="w-full px-3 py-2 rounded-lg border text-xs font-sans outline-none" style={{ backgroundColor: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }} />
              </div>
              <div>
                <label className="block text-xs font-sans mb-1" style={{ color: "var(--admin-text-muted)" }}>Tracking Number</label>
                <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="e.g. BLUEDART-1234567" className="w-full px-3 py-2 rounded-lg border text-xs font-sans font-mono outline-none" style={{ backgroundColor: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }} />
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="text-sm font-sans font-semibold mb-4" style={{ color: "var(--admin-text)" }}>Internal Notes</h2>
            <textarea rows={3} value={internalNotes} onChange={e => setInternalNotes(e.target.value)} placeholder="Notes visible to admin only..." className="w-full px-3 py-2 rounded-lg border text-xs font-sans outline-none" style={{ backgroundColor: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }} />
          </div>

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
              <h2 className="text-sm font-sans font-semibold mb-4" style={{ color: "var(--admin-text)" }}>Order Timeline</h2>
              <div className="space-y-3">
                {[...order.timeline].reverse().map((event, idx) => (
                  <div key={idx} className="flex gap-3 text-xs font-sans">
                    <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: "var(--admin-accent)" }} />
                    <div>
                      <p className="font-semibold capitalize" style={{ color: "var(--admin-text)" }}>{event.status}</p>
                      {event.note && <p style={{ color: "var(--admin-text-muted)" }}>{event.note}</p>}
                      <p style={{ color: "var(--admin-text-muted)" }}>{new Date(event.timestamp).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="text-sm font-sans font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
              <User size={16} className="text-[--admin-accent]" /> Customer
            </h2>
            <div className="space-y-2 text-xs font-sans">
              <p className="font-medium text-sm" style={{ color: "var(--admin-text)" }}>{order.customerName}</p>
              <div className="flex items-center gap-2" style={{ color: "var(--admin-text-muted)" }}><Mail size={13} />{order.customerEmail}</div>
              {order.customerPhone && <div className="flex items-center gap-2" style={{ color: "var(--admin-text-muted)" }}><Phone size={13} />{order.customerPhone}</div>}
            </div>
          </div>

          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="text-sm font-sans font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
              <MapPin size={16} className="text-[--admin-accent]" /> Delivery Address
            </h2>
            <div className="text-xs font-sans leading-relaxed" style={{ color: "var(--admin-text-muted)" }}>
              <p className="font-medium text-sm mb-1" style={{ color: "var(--admin-text)" }}>{order.customerName}</p>
              {order.shippingAddress ? (
                <>
                  <p>{order.shippingAddress.address1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p className="font-semibold mt-1" style={{ color: "var(--admin-text)" }}>{order.shippingAddress.country}</p>
                </>
              ) : <p>No address recorded</p>}
            </div>
          </div>

          <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="text-sm font-sans font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
              <CreditCard size={16} className="text-[--admin-accent]" /> Payment
            </h2>
            <p className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>
              Method: <span style={{ color: "var(--admin-text)" }}>{order.paymentMethod || "Cash on Delivery"}</span>
            </p>
            <p className={`text-xs font-sans font-semibold mt-2 capitalize ${PAYMENT_COLORS[order.paymentStatus]?.split(" ")[0] || ""}`}>
              {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
