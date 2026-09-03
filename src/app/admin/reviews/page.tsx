"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, RefreshCw } from "lucide-react";

interface Review {
  _id: string;
  product?: { name: string; images?: { url: string }[] };
  authorName: string;
  authorEmail: string;
  rating: number;
  title?: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  verifiedPurchase: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/reviews?${params}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error("Failed to fetch reviews", e);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, status }),
      });
      if (res.ok) fetchReviews();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>
            Customer Reviews
          </h1>
          <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>
            Moderate product reviews and ratings ({total} total)
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="p-2.5 rounded-lg border transition-colors hover:bg-[--admin-surface-2]"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg w-fit" style={{ backgroundColor: "var(--admin-surface-2)" }}>
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-md text-xs font-sans font-medium capitalize transition-all"
            style={statusFilter === s ? { backgroundColor: "var(--admin-accent)", color: "white" } : { color: "var(--admin-text-muted)" }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center border rounded-xl border-[--admin-border] bg-[--admin-surface]">
          <MessageSquare size={32} className="mx-auto mb-2 text-[--admin-text-muted]" />
          <p className="text-sm font-sans text-[--admin-text]">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="p-5 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[--admin-border] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                    ))}
                  </div>
                  <span className="font-sans font-semibold text-sm text-[--admin-text]">{r.authorName}</span>
                  <span className="text-xs font-sans text-[--admin-text-muted]">({r.authorEmail})</span>
                  {r.verifiedPurchase && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-success/10 text-success font-semibold">Verified Purchase</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      r.status === "approved"
                        ? "bg-success/10 text-success"
                        : r.status === "rejected"
                        ? "bg-error/10 text-error"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-xs font-sans text-[--admin-text-muted]">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              {r.product?.name && (
                <p className="text-xs font-sans font-medium text-[--admin-accent]">Product: {r.product.name}</p>
              )}

              {r.title && <p className="font-serif text-base font-medium text-[--admin-text]">{r.title}</p>}
              <p className="text-xs font-sans text-[--admin-text] leading-relaxed">{r.body}</p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[--admin-border]">
                {r.status !== "approved" && (
                  <button
                    onClick={() => handleStatusUpdate(r._id, "approved")}
                    className="flex items-center gap-1 text-xs font-sans font-semibold text-success hover:opacity-80"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusUpdate(r._id, "rejected")}
                    className="flex items-center gap-1 text-xs font-sans font-semibold text-warning hover:opacity-80"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                )}
                <button onClick={() => handleDelete(r._id)} className="flex items-center gap-1 text-xs font-sans text-error hover:opacity-80">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
