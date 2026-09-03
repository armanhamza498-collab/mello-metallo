"use client";

import { useState } from "react";
import { Truck, Save } from "lucide-react";
import { useCurrencyStore } from "@/store";

export default function AdminShippingSettingsPage() {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);
  const [flatRateDomestic, setFlatRateDomestic] = useState(250);
  const [internationalFlatRate, setInternationalFlatRate] = useState(2500);
  const [saving, setSaving] = useState(false);
  const { format } = useCurrencyStore();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Shipping configuration saved!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Shipping Settings</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Configure free shipping thresholds, domestic courier fees, and international freight rules
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[--admin-accent-light] transition-colors"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Shipping Rules"}
        </button>
      </div>

      <div className="p-6 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="text-brass" size={24} />
          <h3 className="font-serif text-lg text-[--admin-text]">Domestic Shipping (India)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
            <p className="text-[10px] text-[--admin-text-muted] mt-1">Orders equal to or above {format(freeShippingThreshold)} get free express delivery.</p>
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Standard Domestic Flat Rate (₹)</label>
            <input
              type="number"
              value={flatRateDomestic}
              onChange={(e) => setFlatRateDomestic(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-4">
        <h3 className="font-serif text-lg text-[--admin-text]">International Shipping (Worldwide)</h3>
        <div>
          <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Worldwide Flat Rate Shipping (₹)</label>
          <input
            type="number"
            value={internationalFlatRate}
            onChange={(e) => setInternationalFlatRate(Number(e.target.value))}
            className="w-full max-w-sm px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
