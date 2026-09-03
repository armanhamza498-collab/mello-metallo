"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Upload, Check, X, Tags, Sparkles } from "lucide-react";
import { BRAND_IMAGES, getBrassImage } from "@/lib/images";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string };
  isActive: boolean;
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error("Failed to fetch categories", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: CategoryItem) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description || "");
      setImageUrl(category.image?.url || "");
    } else {
      setEditingCategory(null);
      setName("");
      setDescription("");
      setImageUrl("");
    }
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const payload = {
      _id: editingCategory?._id,
      name,
      description,
      image: imageUrl ? { url: imageUrl } : undefined,
    };

    try {
      const method = editingCategory ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchCategories();
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
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      }
    } catch {
      alert("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Categories</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Organize your brass and copper collection catalog
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[--admin-accent] hover:bg-[--admin-accent-light] text-white text-xs font-sans font-semibold rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-[--admin-surface] border-[--admin-border]">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--admin-text-muted]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] placeholder-[--admin-text-muted] outline-none"
          />
        </div>
        <p className="text-xs font-sans text-[--admin-text-muted]">
          Total: <strong className="text-[--admin-text]">{filteredCategories.length}</strong> categories
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-12 text-center border rounded-xl border-[--admin-border] bg-[--admin-surface]">
          <Tags size={32} className="mx-auto mb-2 text-[--admin-text-muted]" />
          <p className="text-sm font-sans text-[--admin-text]">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat, i) => {
            const imgSrc = cat.image?.url || getBrassImage(cat.name, i);
            return (
              <div
                key={cat._id}
                className="flex gap-4 p-4 rounded-xl border bg-[--admin-surface] border-[--admin-border] hover:border-[--admin-accent]/40 transition-colors"
              >
                <div className="w-20 h-20 bg-[--admin-surface-2] rounded-lg overflow-hidden border border-[--admin-border] flex-shrink-0">
                  <img src={imgSrc} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg text-[--admin-text] truncate">{cat.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[--admin-accent]/10 text-[--admin-accent] font-medium uppercase">
                        {cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs font-sans text-[--admin-text-muted] line-clamp-2 mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[--admin-border] mt-2">
                    <span className="text-[10px] text-[--admin-text-muted]">{cat.productCount || 0} Products</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="p-1.5 text-[--admin-text-muted] hover:text-[--admin-accent] transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1.5 text-[--admin-text-muted] hover:text-error transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[--admin-surface] border border-[--admin-border] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-[--admin-text]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[--admin-text-muted] hover:text-[--admin-text]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hardware, Cookware, Drinkware"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none focus:border-[--admin-accent]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief category description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none focus:border-[--admin-accent]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Category Image (Upload to Cloudinary)</label>
                <div className="flex items-center gap-3">
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[--admin-border]" />
                  )}
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 bg-[--admin-surface-2] border border-dashed border-[--admin-border] hover:border-[--admin-accent] rounded-lg text-xs text-[--admin-text-muted]">
                    <Upload size={14} />
                    <span>{uploading ? "Uploading..." : "Choose Image File"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[--admin-border]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-sans text-[--admin-text-muted] hover:text-[--admin-text]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2 bg-[--admin-accent] hover:bg-[--admin-accent-light] text-white text-xs font-sans font-semibold rounded-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
