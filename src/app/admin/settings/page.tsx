"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export default function GeneralAdminSettingsPage() {
  const [storeName, setStoreName] = useState("Mello Metallo");
  const [supportEmail, setSupportEmail] = useState("concierge@mellometallo.com");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("42 Artisan Quarter, Jaipur, Rajasthan 302001, India");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setStoreName(data.settings.storeName || "Mello Metallo");
          setSupportEmail(data.settings.supportEmail || "concierge@mellometallo.com");
          setSupportPhone(data.settings.supportPhone || "+91 98765 43210");
          setAddress(data.settings.address || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, supportEmail, supportPhone, address }),
      });
      if (res.ok) {
        alert("General store settings saved to database!");
      } else {
        alert("Failed to save store settings");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading store settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">General Store Settings</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Manage your store name, brand details, concierge contact details, and address
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[--admin-accent-light] transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Store Info"}
        </button>
      </div>

      <div className="p-6 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-4">
        <div>
          <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Concierge / Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Customer Care Phone</label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Workshop & Headquarters Address</label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
