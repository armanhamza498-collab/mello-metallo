"use client";

import { useState, useEffect } from "react";
import { Save, Upload, RefreshCw, Layout } from "lucide-react";

interface Section {
  type: string;
  title?: string;
  isEnabled: boolean;
  displayOrder: number;
  content: Record<string, any>;
}

export default function AdminHomepageContentPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content/homepage");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch (e) {
      console.error("Failed to fetch homepage sections", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSectionContentChange = (type: string, field: string, value: any) => {
    setSections((prev) =>
      prev.map((sec) => (sec.type === type ? { ...sec, content: { ...sec.content, [field]: value } } : sec))
    );
  };

  const handleToggleSection = (type: string, isEnabled: boolean) => {
    setSections((prev) => prev.map((sec) => (sec.type === type ? { ...sec, isEnabled } : sec)));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(`${type}_${field}`);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        handleSectionContentChange(type, field, data.url);
      }
    } catch {
      alert("Failed to upload image to Cloudinary");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });
      if (res.ok) {
        alert("Homepage content published successfully to storefront!");
        fetchSections();
      } else {
        alert("Failed to save homepage content");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading homepage sections...</div>;
  }

  const heroSec = sections.find((s) => s.type === "hero");
  const craftSec = sections.find((s) => s.type === "craftsmanship");
  const featSec = sections.find((s) => s.type === "featured-collection");

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Homepage CMS</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Customize titles, descriptions, buttons, and images for all storefront homepage sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSections}
            className="p-2.5 rounded-lg border transition-colors hover:bg-[--admin-surface-2]"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:bg-[--admin-accent-light] transition-colors disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Publishing..." : "Publish Changes"}
          </button>
        </div>
      </div>

      {/* Hero Section CMS */}
      {heroSec && (
        <div className="p-6 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-4">
          <div className="flex items-center justify-between border-b border-[--admin-border] pb-3">
            <h3 className="font-serif text-lg text-[--admin-text]">1. Hero Section</h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-sans">
              <input
                type="checkbox"
                checked={heroSec.isEnabled}
                onChange={(e) => handleToggleSection("hero", e.target.checked)}
                style={{ accentColor: "var(--admin-accent)" }}
              />
              <span>Enabled</span>
            </label>
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Hero Title</label>
            <input
              type="text"
              value={heroSec.content.heading || ""}
              onChange={(e) => handleSectionContentChange("hero", "heading", e.target.value)}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Hero Subheading</label>
            <textarea
              rows={2}
              value={heroSec.content.subheading || ""}
              onChange={(e) => handleSectionContentChange("hero", "subheading", e.target.value)}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">CTA Button Text</label>
              <input
                type="text"
                value={heroSec.content.ctaText || ""}
                onChange={(e) => handleSectionContentChange("hero", "ctaText", e.target.value)}
                className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">CTA URL</label>
              <input
                type="text"
                value={heroSec.content.ctaUrl || ""}
                onChange={(e) => handleSectionContentChange("hero", "ctaUrl", e.target.value)}
                className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">
              Hero Image (Cloudinary)
            </label>
            <div className="flex items-center gap-3">
              {heroSec.content.image && (
                <img
                  src={heroSec.content.image}
                  alt="Hero Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-[--admin-border]"
                />
              )}
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 bg-[--admin-surface-2] border border-dashed border-[--admin-border] rounded-lg text-xs text-[--admin-text-muted] hover:border-[--admin-accent]">
                <Upload size={14} />
                <span>{uploadingField === "hero_image" ? "Uploading to Cloudinary..." : "Upload New Hero Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "hero", "image")}
                  disabled={uploadingField !== null}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Craftsmanship Section CMS */}
      {craftSec && (
        <div className="p-6 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-4">
          <div className="flex items-center justify-between border-b border-[--admin-border] pb-3">
            <h3 className="font-serif text-lg text-[--admin-text]">2. Craftsmanship Banner</h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-sans">
              <input
                type="checkbox"
                checked={craftSec.isEnabled}
                onChange={(e) => handleToggleSection("craftsmanship", e.target.checked)}
                style={{ accentColor: "var(--admin-accent)" }}
              />
              <span>Enabled</span>
            </label>
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Heading</label>
            <input
              type="text"
              value={craftSec.content.heading || ""}
              onChange={(e) => handleSectionContentChange("craftsmanship", "heading", e.target.value)}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Description</label>
            <textarea
              rows={2}
              value={craftSec.content.description || ""}
              onChange={(e) => handleSectionContentChange("craftsmanship", "description", e.target.value)}
              className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Section Image</label>
            <div className="flex items-center gap-3">
              {craftSec.content.image && (
                <img
                  src={craftSec.content.image}
                  alt="Craft Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-[--admin-border]"
                />
              )}
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 bg-[--admin-surface-2] border border-dashed border-[--admin-border] rounded-lg text-xs text-[--admin-text-muted] hover:border-[--admin-accent]">
                <Upload size={14} />
                <span>{uploadingField === "craftsmanship_image" ? "Uploading..." : "Upload Craft Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "craftsmanship", "image")}
                  disabled={uploadingField !== null}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
