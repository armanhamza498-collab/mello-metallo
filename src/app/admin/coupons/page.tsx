"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Edit2, Trash2, X, Check } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error("Failed to fetch coupons", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = (c?: Coupon) => {
    setEditing(c || null);
    setCode(c?.code || "");
    setDiscountType(c?.discountType || "percentage");
    setDiscountValue(c ? String(c.discountValue) : "");
    setMinOrderAmount(c ? String(c.minOrderAmount) : "0");
    setIsActive(c ? c.isActive : true);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    setSubmitting(true);
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/coupons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editing?._id,
          code: code.toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderAmount: parseFloat(minOrderAmount || "0"),
          isActive,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchCoupons();
      } else {
        const d = await res.json();
        alert(d.error || "Operation failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon code?")) return;
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Discounts & Coupons</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Create promotional codes and discount offers for checkout
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="py-12 text-center border rounded-xl border-[--admin-border] bg-[--admin-surface]">
          <Tag size={32} className="mx-auto mb-2 text-[--admin-text-muted]" />
          <p className="text-sm font-sans text-[--admin-text]">No coupons created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c._id}
              className="p-5 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-[--admin-accent] tracking-wider px-2.5 py-1 bg-[--admin-accent]/10 rounded-md">
                  {c.code}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.isActive ? "bg-success/10 text-success" : "bg-[--admin-surface-2] text-[--admin-text-muted]"}`}>
                  {c.isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <div className="text-xs font-sans space-y-1">
                <p className="font-medium text-sm text-[--admin-text]">
                  {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                </p>
                <p className="text-[--admin-text-muted]">
                  Min Order: {c.minOrderAmount > 0 ? `₹${c.minOrderAmount.toLocaleString()}` : "No minimum"}
                </p>
                <p className="text-[--admin-text-muted]">Used: {c.usedCount || 0} times</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[--admin-border]">
                <button onClick={() => openModal(c)} className="p-1.5 text-[--admin-text-muted] hover:text-[--admin-accent]">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(c._id)} className="p-1.5 text-[--admin-text-muted] hover:text-error">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[--admin-surface] border border-[--admin-border] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-[--admin-text]">{editing ? "Edit Coupon" : "Create Coupon"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[--admin-text-muted] hover:text-[--admin-text]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MELLO10"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs font-mono font-bold uppercase text-[--admin-text] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder={discountType === "percentage" ? "10" : "500"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ accentColor: "var(--admin-accent)" }}
                />
                <span className="text-xs font-sans text-[--admin-text]">Active / Enabled</span>
              </label>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[--admin-border]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-sans text-[--admin-text-muted]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
