"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Users, Mail, Phone, Calendar, MapPin, RefreshCw } from "lucide-react";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  addresses?: { city?: string; country?: string }[];
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (e) {
      console.error("Failed to fetch customers", e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>
            Registered Customers
          </h1>
          <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>
            {total} registered user accounts
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="p-2.5 rounded-lg border transition-colors hover:bg-[--admin-surface-2]"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-muted)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search customer name or email address..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm font-sans outline-none"
          style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }}
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface-2)" }}>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Customer</th>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Email</th>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Phone</th>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Location</th>
                <th className="p-4 font-sans font-semibold tracking-wider" style={{ color: "var(--admin-text-muted)" }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 font-sans" style={{ color: "var(--admin-text-muted)" }}>
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 font-sans" style={{ color: "var(--admin-text-muted)" }}>
                    No customer accounts found
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b transition-colors"
                    style={{ borderColor: "var(--admin-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--admin-surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[--admin-accent]/10 text-[--admin-accent] font-semibold text-xs uppercase">
                          {c.firstName?.[0]}
                          {c.lastName?.[0]}
                        </div>
                        <span className="font-sans font-medium text-sm" style={{ color: "var(--admin-text)" }}>
                          {c.firstName} {c.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-sans text-xs" style={{ color: "var(--admin-text-muted)" }}>
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} /> {c.email}
                      </div>
                    </td>
                    <td className="p-4 font-sans text-xs" style={{ color: "var(--admin-text-muted)" }}>
                      {c.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} /> {c.phone}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 font-sans text-xs" style={{ color: "var(--admin-text-muted)" }}>
                      {c.addresses?.[0]?.city ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} /> {c.addresses[0].city}, {c.addresses[0].country || "India"}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 font-sans text-xs" style={{ color: "var(--admin-text-muted)" }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} /> {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "var(--admin-border)" }}>
            <p className="text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>
              Showing {customers.length} of {total}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-7 h-7 rounded text-xs font-sans transition-colors"
                  style={p === page ? { backgroundColor: "var(--admin-accent)", color: "white" } : { color: "var(--admin-text-muted)" }}
                >
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
