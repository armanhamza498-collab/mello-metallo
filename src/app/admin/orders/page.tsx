"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Eye, RefreshCw } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress?: { city?: string };
  items: unknown[];
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
}

const FULFILLMENT_COLORS: Record<string, string> = {
  pending: "text-warning bg-warning/10",
  confirmed: "text-info bg-info/10",
  processing: "text-info bg-info/10",
  shipped: "text-brass bg-brass/10",
  delivered: "text-success bg-success/10",
  cancelled: "text-error bg-error/10",
  returned: "text-muted bg-muted/10",
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: "text-success bg-success/10",
  pending: "text-warning bg-warning/10",
  failed: "text-error bg-error/10",
  refunded: "text-muted bg-muted/10",
};

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>Orders</h1>
          <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>
            {total} orders total
          </p>
        </div>
        <button onClick={fetchOrders} className="p-2 rounded-lg transition-colors hover:bg-[--admin-surface-2]" style={{ color: "var(--admin-text-muted)" }}>
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search order ID, customer name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm font-sans outline-none"
            style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }}
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--admin-surface-2)" }}>
          {["all", "pending", "processing", "shipped", "delivered"].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="px-3 py-1.5 rounded-md text-xs font-sans font-medium capitalize transition-all"
              style={statusFilter === s ? { backgroundColor: "var(--admin-accent)", color: "white" } : { color: "var(--admin-text-muted)" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface-2)" }}>
                <th className="text-left px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Order</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Customer</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Date</th>
                <th className="text-center px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Items</th>
                <th className="text-right px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Total</th>
                <th className="text-center px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Payment</th>
                <th className="text-center px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Fulfillment</th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>No orders found</td></tr>
              ) : orders.map(order => (
                <tr
                  key={order._id}
                  className="border-b transition-colors"
                  style={{ borderColor: "var(--admin-border)" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--admin-surface-2)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.orderNumber}`} className="text-sm font-mono font-medium hover:underline" style={{ color: "var(--admin-accent)" }}>
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-sans font-medium" style={{ color: "var(--admin-text)" }}>{order.customerName}</p>
                    <p className="text-[10px] font-sans" style={{ color: "var(--admin-text-muted)" }}>
                      {order.shippingAddress?.city || "—"} · {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-sans font-medium" style={{ color: "var(--admin-text)" }}>{order.items?.length || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>₹{order.total.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-semibold uppercase ${PAYMENT_COLORS[order.paymentStatus] || ""}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-semibold uppercase ${FULFILLMENT_COLORS[order.fulfillmentStatus] || ""}`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.orderNumber}`} className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-[--admin-surface-3]" style={{ color: "var(--admin-text-muted)" }}>
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "var(--admin-border)" }}>
            <p className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>Showing {orders.length} of {total}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className="w-7 h-7 rounded text-xs font-sans transition-colors" style={p === page ? { backgroundColor: "var(--admin-accent)", color: "white" } : { color: "var(--admin-text-muted)" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs font-sans text-[--admin-text-muted]">Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
