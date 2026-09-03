"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Upload, X, Layers } from "lucide-react";

interface CollectionItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string };
  isActive: boolean;
  featured: boolean;
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CollectionItem | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections");
      const data = await res.json();
      if (data.collections) setCollections(data.collections);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCollections(); }, []);

  const openModal = (col?: CollectionItem) => {
    setEditing(col || null);
    setName(col?.name || "");
    setDescription(col?.description || "");
    setImageUrl(col?.image?.url || "");
    setFeatured(col?.featured || false);
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
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/collections", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: editing?._id, name, description, image: imageUrl ? { url: imageUrl } : undefined, featured }),
      });
      if (res.ok) { setModalOpen(false); fetchCollections(); }
      else { const d = await res.json(); alert(d.error || "Operation failed"); }
    } catch { alert("Network error"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    await fetch(`/api/admin/collections?id=${id}`, { method: "DELETE" });
    fetchCollections();
  };

  const filtered = collections.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Collections</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">Group products into curated collections</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg transition-colors hover:opacity-90">
          <Plus size={16} /> Add Collection
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl border bg-[--admin-surface] border-[--admin-border]">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--admin-text-muted]" />
          <input type="text" placeholder="Search collections..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none" />
        </div>
        <p className="text-xs font-sans text-[--admin-text-muted]">Total: <strong className="text-[--admin-text]">{filtered.length}</strong></p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading collections...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center border rounded-xl border-[--admin-border] bg-[--admin-surface]">
          <Layers size={32} className="mx-auto mb-2 text-[--admin-text-muted]" />
          <p className="text-sm font-sans text-[--admin-text]">No collections yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(col => (
            <div key={col._id} className="flex gap-4 p-4 rounded-xl border bg-[--admin-surface] border-[--admin-border] hover:border-[--admin-accent]/40 transition-colors">
              <div className="w-20 h-20 bg-[--admin-surface-2] rounded-lg overflow-hidden border border-[--admin-border] flex-shrink-0">
                {col.image?.url ? <img src={col.image.url} alt={col.name} className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center text-[--admin-text-muted]"><Layers size={24} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg text-[--admin-text] truncate">{col.name}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {col.featured && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[--admin-accent]/10 text-[--admin-accent] font-semibold">Featured</span>}
                    </div>
                  </div>
                  {col.description && <p className="text-xs font-sans text-[--admin-text-muted] line-clamp-2 mt-1">{col.description}</p>}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[--admin-border] mt-2">
                  <span className="text-[10px] text-[--admin-text-muted] font-mono">{col.slug}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openModal(col)} className="p-1.5 text-[--admin-text-muted] hover:text-[--admin-accent] transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(col._id)} className="p-1.5 text-[--admin-text-muted] hover:text-error transition-colors"><Trash2 size={14} /></button>
                  </div>
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
              <h2 className="font-serif text-xl text-[--admin-text]">{editing ? "Edit Collection" : "Add Collection"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[--admin-text-muted] hover:text-[--admin-text]"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Collection Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The Brass Edit" className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none focus:border-[--admin-accent]" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Collection description..." className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none focus:border-[--admin-accent]" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Collection Image</label>
                <div className="flex items-center gap-3">
                  {imageUrl && <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[--admin-border]" />}
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 bg-[--admin-surface-2] border border-dashed border-[--admin-border] hover:border-[--admin-accent] rounded-lg text-xs text-[--admin-text-muted]">
                    <Upload size={14} />
                    <span>{uploading ? "Uploading..." : "Choose Image"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ accentColor: "var(--admin-accent)" }} />
                <span className="text-xs font-sans text-[--admin-text]">Feature this collection on homepage</span>
              </label>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[--admin-border]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-sans text-[--admin-text-muted]">Cancel</button>
                <button type="submit" disabled={submitting || uploading} className="px-5 py-2 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg disabled:opacity-50">
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
