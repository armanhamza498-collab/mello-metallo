"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Clock,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-warning bg-warning/10",
  confirmed: "text-info bg-info/10",
  processing: "text-brass bg-brass/10",
  shipped: "text-success bg-success/10",
  delivered: "text-success bg-success/10",
  cancelled: "text-error bg-error/10",
};

const DATE_FILTERS = ["Today", "7 Days", "30 Days", "3 Months", "6 Months", "1 Year"];

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockProducts: number;
    avgOrderValue: number;
    pendingOrders: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    total: string;
    status: string;
    date: string;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  revenueData: Array<{
    day: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    name: string;
    orders: number;
    revenue: string;
    rating: number;
    sku: string;
  }>;
}

export default function AdminDashboard() {
  const [activePeriod, setActivePeriod] = useState("7 Days");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setData(res);
        }
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
  };

  const kpiCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      sub: "Live from DB",
      icon: TrendingUp,
      positive: true,
      color: "#8B7355",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      sub: "All time orders",
      icon: ShoppingCart,
      positive: true,
      color: "#3B6EA0",
    },
    {
      label: "Registered Customers",
      value: stats.totalCustomers.toString(),
      sub: "Active users",
      icon: Users,
      positive: true,
      color: "#4A7C59",
    },
    {
      label: "Active Products",
      value: stats.totalProducts.toString(),
      sub: `${stats.lowStockProducts} low stock`,
      icon: Package,
      positive: stats.lowStockProducts === 0,
      color: "#C4871A",
    },
    {
      label: "Avg. Order Value",
      value: `₹${stats.avgOrderValue.toLocaleString("en-IN")}`,
      sub: "Per transaction",
      icon: BarChart2,
      positive: true,
      color: "#8B7355",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toString(),
      sub: stats.pendingOrders > 0 ? "Requires action" : "All cleared",
      icon: Clock,
      positive: stats.pendingOrders === 0,
      color: "#B54040",
    },
  ];

  const recentOrders = data?.recentOrders || [];
  const ordersByStatus = data?.ordersByStatus || [];
  const revenueData = data?.revenueData || [];
  const topProducts = data?.topProducts || [];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>
            Dashboard
          </h1>
          <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>
            Real-time analytics connected live to your MongoDB database.
          </p>
        </div>

        {/* Date filter & Loader indicator */}
        <div className="flex items-center gap-3">
          {loading && <Loader2 size={16} className="animate-spin text-[--admin-accent]" />}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--admin-surface-2)" }}>
            {DATE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActivePeriod(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all ${
                  activePeriod === f ? "text-white" : "hover:text-[--admin-text]"
                }`}
                style={
                  activePeriod === f
                    ? { backgroundColor: "var(--admin-accent)", color: "white" }
                    : { color: "var(--admin-text-muted)" }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="p-4 rounded-xl border"
              style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + "20" }}>
                  <Icon size={14} strokeWidth={1.5} style={{ color: card.color }} />
                </div>
                {card.positive ? (
                  <ArrowUpRight size={12} className="text-success" />
                ) : (
                  <ArrowDownRight size={12} className="text-error" />
                )}
              </div>
              <p className="text-lg font-sans font-semibold" style={{ color: "var(--admin-text)" }}>
                {card.value}
              </p>
              <p className="text-[10px] font-sans mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                {card.label}
              </p>
              <p className={`text-[9px] font-sans mt-1 font-medium ${card.positive ? "text-success" : "text-warning"}`}>
                {card.sub}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>
              Daily Revenue
            </h2>
            <p className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>
              Past 7 Days
            </p>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B7355" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B7355" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--admin-surface-2)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "var(--admin-text)",
                  }}
                  formatter={(v: any) => [`₹${Number(v || 0).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B7355" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-[--admin-text-muted]">
              No revenue recorded in the last 7 days.
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <h2 className="text-sm font-sans font-semibold mb-4" style={{ color: "var(--admin-text)" }}>
            Orders by Status
          </h2>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersByStatus} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="status" type="category" tick={{ fontSize: 9, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} width={65} />
                <Tooltip contentStyle={{ backgroundColor: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", borderRadius: "8px", fontSize: "11px", color: "var(--admin-text)" }} />
                <Bar dataKey="count" fill="#8B7355" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-[--admin-text-muted]">
              No orders found in database.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>
              Recent Orders
            </h2>
            <a href="/admin/orders" className="text-xs font-sans" style={{ color: "var(--admin-accent)" }}>
              View all →
            </a>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: "var(--admin-border)" }}>
                  <div>
                    <p className="text-xs font-sans font-medium" style={{ color: "var(--admin-text)" }}>
                      {order.id} · {order.customer}
                    </p>
                    <p className="text-[10px] font-sans" style={{ color: "var(--admin-text-muted)" }}>
                      {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-semibold capitalize ${STATUS_COLORS[order.status] || "text-muted bg-muted/10"}`}>
                      {order.status}
                    </span>
                    <span className="text-xs font-sans font-semibold" style={{ color: "var(--admin-text)" }}>
                      {order.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[--admin-text-muted] py-6 text-center">No recent orders yet.</p>
          )}
        </div>

        {/* Top Products */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>
              Top Products
            </h2>
            <a href="/admin/products" className="text-xs font-sans" style={{ color: "var(--admin-accent)" }}>
              View all →
            </a>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: "var(--admin-border)" }}>
                  <span className="text-xs font-sans font-semibold w-4 flex-shrink-0" style={{ color: "var(--admin-text-muted)" }}>
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans font-medium truncate" style={{ color: "var(--admin-text)" }}>
                      {p.name}
                    </p>
                    <p className="text-[10px] font-sans" style={{ color: "var(--admin-text-muted)" }}>
                      SKU: {p.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-sans font-semibold" style={{ color: "var(--admin-text)" }}>
                      {p.revenue}
                    </p>
                    <p className="text-[9px] font-sans font-semibold text-warning">
                      ★ {p.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[--admin-text-muted] py-6 text-center">No products found in database.</p>
          )}
        </div>
      </div>
    </div>
  );
}
