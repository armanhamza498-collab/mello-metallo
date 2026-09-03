"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Edit2, Trash2, Upload, X } from "lucide-react";

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  desktopImage: { url: string };
  ctaText?: string;
  ctaUrl?: string;
  placement: "hero" | "promotional" | "category" | "collection";
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [placement, setPlacement] = useState<"hero" | "promotional" | "category" | "collection">("hero");
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content/banners");
      const data = await res.json();
      if (data.banners) setBanners(data.banners);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openModal = (b?: Banner) => {
    setEditing(b || null);
    setTitle(b?.title || "");
    setSubtitle(b?.subtitle || "");
    setImageUrl(b?.desktopImage?.url || "");
    setCtaText(b?.ctaText || "");
    setCtaUrl(b?.ctaUrl || "");
    setPlacement(b?.placement || "hero");
    setIsActive(b ? b.isActive : true);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) {
      alert("Title and Image are required");
      return;
    }

    setSubmitting(true);
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/content/banners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editing?._id,
          title,
          subtitle,
          desktopImage: { url: imageUrl },
          ctaText,
          ctaUrl,
          placement,
          isActive,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchBanners();
      } else {
        const d = await res.json();
        alert(d.error || "Operation failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/content/banners?id=${id}`, { method: "DELETE" });
    fetchBanners();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Promotional Banners</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Manage site-wide promotional banners and sliders
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="py-12 text-center border rounded-xl border-[--admin-border] bg-[--admin-surface]">
          <ImageIcon size={32} className="mx-auto mb-2 text-[--admin-text-muted]" />
          <p className="text-sm font-sans text-[--admin-text]">No banners created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b._id} className="p-4 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-3">
              <div className="h-36 rounded-lg overflow-hidden border border-[--admin-border] relative bg-[--admin-surface-2]">
                {b.desktopImage?.url ? (
                  <img src={b.desktopImage.url} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[--admin-text-muted]">No image</div>
                )}
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white font-semibold capitalize">
                  {b.placement}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base text-[--admin-text]">{b.title}</h3>
                  {b.subtitle && <p className="text-xs font-sans text-[--admin-text-muted]">{b.subtitle}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openModal(b)} className="p-1.5 text-[--admin-text-muted] hover:text-[--admin-accent]">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="p-1.5 text-[--admin-text-muted] hover:text-error">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[--admin-surface] border border-[--admin-border] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-[--admin-text]">{editing ? "Edit Banner" : "Add Banner"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[--admin-text-muted] hover:text-[--admin-text]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Placement</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none capitalize"
                >
                  <option value="hero">Hero Slider</option>
                  <option value="promotional">Promotional Grid</option>
                  <option value="category">Category Banner</option>
                  <option value="collection">Collection Banner</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Banner Image (Cloudinary)</label>
                <div className="flex items-center gap-3">
                  {imageUrl && <img src={imageUrl} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-[--admin-border]" />}
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 bg-[--admin-surface-2] border border-dashed border-[--admin-border] hover:border-[--admin-accent] rounded-lg text-xs text-[--admin-text-muted]">
                    <Upload size={14} />
                    <span>{uploading ? "Uploading..." : "Choose Image"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">CTA URL</label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="/shop"
                    className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[--admin-border]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-sans text-[--admin-text-muted]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
