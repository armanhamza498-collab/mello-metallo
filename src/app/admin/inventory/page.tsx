"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, AlertTriangle, RefreshCw, Save, Package } from "lucide-react";

interface ProductInventory {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: string;
  category?: { name: string };
  images?: { url: string }[];
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<ProductInventory[]>([]);
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (onlyLowStock) params.set("lowStock", "true");
      const res = await fetch(`/api/admin/inventory?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setStockEdits({});
      }
    } catch (e) {
      console.error("Failed to fetch inventory", e);
    } finally {
      setLoading(false);
    }
  }, [search, onlyLowStock]);

  useEffect(() => {
    const t = setTimeout(fetchInventory, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchInventory]);

  const handleStockChange = (id: string, val: number) => {
    setStockEdits((prev) => ({ ...prev, [id]: val }));
  };

  const handleSaveIndividual = async (id: string) => {
    const newStock = stockEdits[id];
    if (newStock === undefined) return;
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: newStock }),
      });
      if (res.ok) {
        fetchInventory();
      } else {
        alert("Failed to update stock");
      }
    } catch {
      alert("Network error");
    }
  };

  const handleSaveAll = async () => {
    const updates = Object.entries(stockEdits).map(([id, stock]) => ({ id, stock }));
    if (updates.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchInventory();
      } else {
        alert("Failed bulk stock update");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  const modifiedCount = Object.keys(stockEdits).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>
            Inventory Management
          </h1>
          <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>
            Track product stock levels and update quantities in real time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchInventory}
            className="p-2.5 rounded-lg border transition-colors hover:bg-[--admin-surface-2]"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}
          >
            <RefreshCw size={15} />
          </button>
          {modifiedCount > 0 && (
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-sans font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--admin-accent)" }}
            >
              <Save size={16} /> Save All Changes ({modifiedCount})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm font-sans outline-none"
            style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }}
          />
        </div>
        <button
          onClick={() => setOnlyLowStock(!onlyLowStock)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans font-medium border transition-colors ${
            onlyLowStock ? "bg-error/10 text-error border-error/30" : "bg-[--admin-surface] text-[--admin-text-muted] border-[--admin-border]"
          }`}
        >
          <AlertTriangle size={14} /> Low Stock Only
        </button>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface-2)" }}>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Product</th>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>SKU</th>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Category</th>
                <th className="p-4 font-sans font-semibold tracking-wider text-center" style={{ color: "var(--admin-text-muted)" }}>Current Stock</th>
                <th className="p-4 font-sans font-semibold tracking-wider text-center" style={{ color: "var(--admin-text-muted)" }}>Low Stock Threshold</th>
                <th className="p-4 font-sans font-semibold tracking-wider text-right" style={{ color: "var(--admin-text-muted)" }}>Quick Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 font-sans" style={{ color: "var(--admin-text-muted)" }}>
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 font-sans" style={{ color: "var(--admin-text-muted)" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  const currentVal = stockEdits[item._id] !== undefined ? stockEdits[item._id] : item.stock;
                  const isModified = stockEdits[item._id] !== undefined && stockEdits[item._id] !== item.stock;
                  const isLow = currentVal <= item.lowStockThreshold;

                  return (
                    <tr
                      key={item._id}
                      className="border-b transition-colors"
                      style={{ borderColor: "var(--admin-border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--admin-surface-2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-[--admin-surface-3]">
                            {item.images?.[0]?.url ? (
                              <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[--admin-text-muted]">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <span className="font-sans font-medium text-sm" style={{ color: "var(--admin-text)" }}>
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs" style={{ color: "var(--admin-text-muted)" }}>
                        {item.sku}
                      </td>
                      <td className="p-4 font-sans text-xs" style={{ color: "var(--admin-text-muted)" }}>
                        {item.category?.name || "—"}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-sans font-bold text-sm ${isLow ? "text-error" : "text-success"}`}>
                          {isLow && <AlertTriangle size={12} className="inline mr-1" />}
                          {currentVal}
                        </span>
                      </td>
                      <td className="p-4 text-center font-sans text-xs" style={{ color: "var(--admin-text-muted)" }}>
                        {item.lowStockThreshold}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            value={currentVal}
                            onChange={(e) => handleStockChange(item._id, Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-20 px-2 py-1 bg-[--admin-surface-2] border border-[--admin-border] rounded text-center text-xs font-mono font-medium outline-none focus:border-[--admin-accent]"
                            style={{ color: "var(--admin-text)" }}
                          />
                          {isModified && (
                            <button
                              onClick={() => handleSaveIndividual(item._id)}
                              className="px-2.5 py-1 bg-[--admin-accent] text-white text-[10px] font-sans font-semibold rounded hover:opacity-90 transition-opacity"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
