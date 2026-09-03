"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Copy, AlertTriangle, RefreshCw } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  sku: string;
  material: string;
  price: number;
  stock: number;
  status: "published" | "draft" | "archived";
  category?: { name: string };
  images?: { url: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  published: "text-success bg-success/10",
  draft: "text-warning bg-warning/10",
  archived: "text-muted bg-muted/10",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleSelectAll = () =>
    setSelected(selected.length === products.length ? [] : products.map(p => p._id));

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleBulkAction = async (action: "published" | "archived" | "delete") => {
    if (selected.length === 0) return;
    if (action === "delete") {
      if (!confirm(`Delete ${selected.length} products?`)) return;
      await Promise.all(selected.map(id => fetch(`/api/admin/products/${id}`, { method: "DELETE" })));
    } else {
      await Promise.all(
        selected.map(id =>
          fetch(`/api/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: action }),
          })
        )
      );
    }
    setSelected([]);
    fetchProducts();
  };

  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>Products</h1>
          <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>
            {total} products · {lowStockCount} low stock
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProducts} className="p-2 rounded-lg transition-colors hover:bg-[--admin-surface-2]" style={{ color: "var(--admin-text-muted)" }}>
            <RefreshCw size={15} />
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-sans font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--admin-accent)" }}
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products, SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm font-sans outline-none"
            style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }}
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--admin-surface-2)" }}>
          {["all", "published", "draft", "archived"].map(s => (
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

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg mb-4 border"
          style={{ backgroundColor: "var(--admin-surface-2)", borderColor: "var(--admin-border)" }}
        >
          <span className="text-xs font-sans font-medium" style={{ color: "var(--admin-text)" }}>{selected.length} selected</span>
          <button onClick={() => handleBulkAction("delete")} className="text-xs font-sans text-error hover:text-error/80 transition-colors">Delete</button>
          <button onClick={() => handleBulkAction("published")} className="text-xs font-sans hover:text-[--admin-accent] transition-colors" style={{ color: "var(--admin-text-muted)" }}>Publish</button>
          <button onClick={() => handleBulkAction("archived")} className="text-xs font-sans hover:text-[--admin-accent] transition-colors" style={{ color: "var(--admin-text-muted)" }}>Archive</button>
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface-2)" }}>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={toggleSelectAll} className="rounded" style={{ accentColor: "var(--admin-accent)" }} />
                </th>
                <th className="text-left px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Product</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>SKU</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Category</th>
                <th className="text-right px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Price</th>
                <th className="text-center px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Stock</th>
                <th className="text-center px-4 py-3 text-xs font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Status</th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>No products found</td></tr>
              ) : products.map(product => (
                <tr
                  key={product._id}
                  className="border-b transition-colors"
                  style={{ borderColor: "var(--admin-border)" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--admin-surface-2)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(product._id)} onChange={() => toggleSelect(product._id)} style={{ accentColor: "var(--admin-accent)" }} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[--admin-surface-3]">
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px]" style={{ color: "var(--admin-text-muted)" }}>No img</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-sans font-medium" style={{ color: "var(--admin-text)" }}>{product.name}</p>
                        <p className="text-[10px] font-sans capitalize" style={{ color: "var(--admin-text-muted)" }}>{product.material}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono" style={{ color: "var(--admin-text-muted)" }}>{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>{product.category?.name || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-sans font-semibold" style={{ color: "var(--admin-text)" }}>₹{product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-sans font-semibold ${product.stock <= 5 ? "text-error" : product.stock <= 10 ? "text-warning" : "text-success"}`}>
                      {product.stock <= 5 && <AlertTriangle size={10} className="inline mr-1" />}
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-semibold capitalize ${STATUS_STYLES[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/products/${product._id}/edit`} className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-[--admin-surface-3]" style={{ color: "var(--admin-text-muted)" }}>
                        <Edit size={13} />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:text-error" style={{ color: "var(--admin-text-muted)" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "var(--admin-border)" }}>
          <p className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>
            Showing {products.length} of {total} products
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className="w-7 h-7 rounded text-xs font-sans transition-colors" style={p === page ? { backgroundColor: "var(--admin-accent)", color: "white" } : { color: "var(--admin-text-muted)" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
