"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle, Clock, BarChart2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const REVENUE_DATA = [
  { day: "Mon", revenue: 42000, orders: 8 },
  { day: "Tue", revenue: 58000, orders: 11 },
  { day: "Wed", revenue: 35000, orders: 7 },
  { day: "Thu", revenue: 75000, orders: 14 },
  { day: "Fri", revenue: 91000, orders: 18 },
  { day: "Sat", revenue: 118000, orders: 22 },
  { day: "Sun", revenue: 64000, orders: 13 },
];

const TOP_PRODUCTS = [
  { name: "Hammered Brass Drawer Knob", orders: 47, revenue: "₹22,560", trend: 12 },
  { name: "Antique Brass Kadhai", orders: 23, revenue: "₹1,10,400", trend: 8 },
  { name: "Brass Tumbler", orders: 38, revenue: "₹45,600", trend: -3 },
  { name: "Copper Tumbler Set", orders: 31, revenue: "₹55,800", trend: 15 },
  { name: "Brass Cabinet Handle", orders: 29, revenue: "₹19,720", trend: 5 },
];

const RECENT_ORDERS = [
  { id: "LC-0042", customer: "Priya M.", total: "₹2,880", status: "shipped", date: "Today, 2:34 PM" },
  { id: "LC-0041", customer: "Arjun K.", total: "₹5,600", status: "confirmed", date: "Today, 11:20 AM" },
  { id: "LC-0040", customer: "Sophie L.", total: "₹4,320", status: "delivered", date: "Yesterday" },
  { id: "LC-0039", customer: "Ravi S.", total: "₹12,800", status: "pending", date: "Yesterday" },
  { id: "LC-0038", customer: "Emma W.", total: "₹9,600", status: "processing", date: "2 days ago" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-warning bg-warning/10",
  confirmed: "text-info bg-info/10",
  processing: "text-brass bg-brass/10",
  shipped: "text-success bg-success/10",
  delivered: "text-success bg-success/10",
  cancelled: "text-error bg-error/10",
};

const KPI_CARDS = [
  { label: "Total Revenue", value: "₹4,83,000", sub: "+18% this month", icon: TrendingUp, positive: true, color: "#8B7355" },
  { label: "Total Orders", value: "93", sub: "+12 this week", icon: ShoppingCart, positive: true, color: "#3B6EA0" },
  { label: "New Customers", value: "28", sub: "+6 this week", icon: Users, positive: true, color: "#4A7C59" },
  { label: "Products", value: "46", sub: "8 low stock", icon: Package, positive: false, color: "#C4871A" },
  { label: "Avg. Order Value", value: "₹5,193", sub: "+4% vs last month", icon: BarChart2, positive: true, color: "#8B7355" },
  { label: "Pending Orders", value: "12", sub: "Requires action", icon: Clock, positive: false, color: "#B54040" },
];

const DATE_FILTERS = ["Today", "7 Days", "30 Days", "3 Months", "6 Months", "1 Year"];

export default function AdminDashboard() {
  const [activePeriod, setActivePeriod] = useState("7 Days");

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>Dashboard</h1>
          <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>Welcome back. Here's what's happening.</p>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--admin-surface-2)" }}>
          {DATE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActivePeriod(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all ${activePeriod === f ? "text-white" : "hover:text-[--admin-text]"}`}
              style={activePeriod === f ? { backgroundColor: "var(--admin-accent)", color: "white" } : { color: "var(--admin-text-muted)" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {KPI_CARDS.map((card, i) => {
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
              <p className="text-lg font-sans font-semibold" style={{ color: "var(--admin-text)" }}>{card.value}</p>
              <p className="text-[10px] font-sans mt-0.5" style={{ color: "var(--admin-text-muted)" }}>{card.label}</p>
              <p className={`text-[9px] font-sans mt-1 font-medium ${card.positive ? "text-success" : "text-warning"}`}>{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>Revenue Overview</h2>
            <p className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>{activePeriod}</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B7355" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B7355" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", borderRadius: "8px", fontSize: "11px", color: "var(--admin-text)" }}
                formatter={(v: any) => [`₹${Number(v || 0).toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8B7355" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <h2 className="text-sm font-sans font-semibold mb-4" style={{ color: "var(--admin-text)" }}>Orders by Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { status: "Pending", count: 12 },
              { status: "Confirmed", count: 8 },
              { status: "Processing", count: 15 },
              { status: "Shipped", count: 23 },
              { status: "Delivered", count: 31 },
            ]} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 9, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="status" type="category" tick={{ fontSize: 9, fill: "rgba(155,149,144,0.8)" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={{ backgroundColor: "var(--admin-surface-2)", border: "1px solid var(--admin-border)", borderRadius: "8px", fontSize: "11px", color: "var(--admin-text)" }} />
              <Bar dataKey="count" fill="#8B7355" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>Recent Orders</h2>
            <a href="/admin/orders" className="text-xs font-sans" style={{ color: "var(--admin-accent)" }}>View all →</a>
          </div>
          <div className="space-y-2">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: "var(--admin-border)" }}>
                <div>
                  <p className="text-xs font-sans font-medium" style={{ color: "var(--admin-text)" }}>{order.id} · {order.customer}</p>
                  <p className="text-[10px] font-sans" style={{ color: "var(--admin-text-muted)" }}>{order.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-semibold capitalize ${STATUS_COLORS[order.status] || "text-muted bg-muted/10"}`}>
                    {order.status}
                  </span>
                  <span className="text-xs font-sans font-semibold" style={{ color: "var(--admin-text)" }}>{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>Top Products</h2>
            <a href="/admin/products" className="text-xs font-sans" style={{ color: "var(--admin-accent)" }}>View all →</a>
          </div>
          <div className="space-y-2">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: "var(--admin-border)" }}>
                <span className="text-xs font-sans font-semibold w-4 flex-shrink-0" style={{ color: "var(--admin-text-muted)" }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-sans font-medium truncate" style={{ color: "var(--admin-text)" }}>{p.name}</p>
                  <p className="text-[10px] font-sans" style={{ color: "var(--admin-text-muted)" }}>{p.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-sans font-semibold" style={{ color: "var(--admin-text)" }}>{p.revenue}</p>
                  <p className={`text-[9px] font-sans font-semibold ${p.trend > 0 ? "text-success" : "text-error"}`}>
                    {p.trend > 0 ? "▲" : "▼"} {Math.abs(p.trend)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
