"use client";

import { useState, useEffect } from "react";
import { Globe, Save, RefreshCw } from "lucide-react";

interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  active: boolean;
  liveRate?: boolean;
}

export default function AdminCurrencySettingsPage() {
  const [baseCurrency, setBaseCurrency] = useState("INR");
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCurrencySettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/currency");
      const data = await res.json();
      if (data.currencies) {
        setCurrencies(data.currencies);
      }
      if (data.baseCurrency) {
        setBaseCurrency(data.baseCurrency);
      }
    } catch (e) {
      console.error("Failed to fetch currency settings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencySettings();
  }, []);

  const handleRateChange = (code: string, newRate: number) => {
    setCurrencies(currencies.map((c) => (c.code === code ? { ...c, rate: newRate } : c)));
  };

  const handleToggle = (code: string) => {
    setCurrencies(currencies.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/currency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseCurrency, currencies }),
      });
      if (res.ok) {
        alert("Currency settings saved successfully!");
      } else {
        alert("Failed to save currency settings");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading currency settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Currency Settings</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Manage multi-currency conversion rates (Live via Frankfurter API: https://api.frankfurter.dev)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCurrencySettings}
            className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-sans hover:bg-[--admin-surface-2] transition-colors"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}
          >
            <RefreshCw size={14} /> Fetch Live Rates
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[--admin-accent-light] transition-colors disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Base Currency Box */}
      <div className="p-6 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-3">
        <h3 className="font-serif text-lg text-[--admin-text]">Base Store Currency</h3>
        <p className="text-xs text-[--admin-text-muted] font-sans">
          All product prices in the database are stored in base currency.
        </p>
        <div className="flex items-center gap-3">
          <Globe className="text-brass" size={20} />
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs font-semibold text-[--admin-text] outline-none"
          >
            <option value="INR">INR (₹) — Indian Rupee</option>
            <option value="USD">USD ($) — US Dollar</option>
            <option value="EUR">EUR (€) — Euro</option>
          </select>
        </div>
      </div>

      {/* Conversion Rates Table */}
      <div className="rounded-xl border bg-[--admin-surface] border-[--admin-border] overflow-hidden">
        <div className="p-4 border-b border-[--admin-border] bg-[--admin-surface-2]">
          <h3 className="font-serif text-base text-[--admin-text]">Multi-Currency Exchange Rates</h3>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[--admin-border] text-[--admin-text-muted]">
              <th className="p-4 font-sans font-medium uppercase">Currency Code</th>
              <th className="p-4 font-sans font-medium uppercase">Currency Name</th>
              <th className="p-4 font-sans font-medium uppercase">Symbol</th>
              <th className="p-4 font-sans font-medium uppercase">Exchange Rate (vs {baseCurrency})</th>
              <th className="p-4 font-sans font-medium uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--admin-border]">
            {currencies.map((c) => (
              <tr key={c.code}>
                <td className="p-4 font-mono font-bold text-brass">
                  {c.code}
                  {c.liveRate && <span className="ml-2 text-[9px] text-success font-sans font-normal">(Live)</span>}
                </td>
                <td className="p-4 font-medium text-[--admin-text]">{c.name}</td>
                <td className="p-4 font-semibold text-[--admin-text]">{c.symbol}</td>
                <td className="p-4">
                  <input
                    type="number"
                    step="0.000001"
                    disabled={c.code === baseCurrency}
                    value={c.rate}
                    onChange={(e) => handleRateChange(c.code, parseFloat(e.target.value) || 0)}
                    className="w-32 px-3 py-1.5 bg-[--admin-surface-2] border border-[--admin-border] rounded text-xs text-[--admin-text] font-mono outline-none focus:border-[--admin-accent] disabled:opacity-50"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggle(c.code)}
                    disabled={c.code === baseCurrency}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                      c.active ? "bg-success/10 text-success" : "bg-[--admin-surface-2] text-[--admin-text-muted]"
                    }`}
                  >
                    {c.active ? "Enabled" : "Disabled"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
