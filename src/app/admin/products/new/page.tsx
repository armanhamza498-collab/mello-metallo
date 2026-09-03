"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, Trash2, Save, X } from "lucide-react";

interface Category { _id: string; name: string; slug: string; }
interface Collection { _id: string; name: string; slug: string; }

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    shortDescription: "",
    material: "brass" as "brass" | "copper" | "mixed",
    category: "",
    collections: [] as string[],
    tags: "",
    finishes: "",
    price: "",
    compareAtPrice: "",
    costPrice: "",
    stock: "0",
    lowStockThreshold: "5",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    bestseller: false,
    newArrival: true,
    countryOfOrigin: "India",
    weight: "",
    craftsmanship: "",
    careInstructions: "",
    warranty: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [images, setImages] = useState<{ url: string; publicId?: string; alt: string }[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);

  useEffect(() => {
    fetch("/api/admin/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
    fetch("/api/admin/collections").then(r => r.json()).then(d => setCollections(d.collections || []));
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (form.name && !form.slug) {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setForm(f => ({ ...f, slug }));
    }
  }, [form.name]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        const newImages = [...images];
        newImages[idx] = { url: data.url, publicId: data.publicId, alt: form.name };
        setImages(newImages);
      }
    } catch { alert("Upload failed"); }
    finally { setUploadingIdx(null); }
  };

  const addImageSlot = () => setImages([...images, { url: "", alt: "" }]);
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.material) {
      alert("Please fill in all required fields (Name, Price, Category, Material)");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
        stock: parseInt(form.stock),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        weight: form.weight ? parseFloat(form.weight) : undefined,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        finishes: form.finishes.split(",").map(t => t.trim()).filter(Boolean),
        collections: form.collections,
        images: images.filter(img => img.url),
        specifications: specs.filter(s => s.key && s.value),
        seo: { title: form.seoTitle, description: form.seoDescription },
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/products");
      } else {
        alert(data.error || "Failed to create product");
      }
    } catch { alert("Network error"); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-sm text-[--admin-text] outline-none focus:border-[--admin-accent] transition-colors";
  const labelCls = "block text-xs font-sans font-semibold text-[--admin-text-muted] mb-1.5 uppercase tracking-wide";
  const optionCls = "bg-[#221F1B] text-[#E8E3DA]";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-[--admin-surface-2] transition-colors" style={{ color: "var(--admin-text-muted)" }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-light" style={{ color: "var(--admin-text)" }}>Add New Product</h1>
            <p className="text-xs font-sans mt-0.5" style={{ color: "var(--admin-text-muted)" }}>Fill in the details below to create a new product</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value as typeof form.status })}
            className="px-3 py-2 text-xs rounded-lg border font-sans"
            style={{ backgroundColor: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }}
          >
            <option value="draft" className={optionCls}>Draft</option>
            <option value="published" className={optionCls}>Published</option>
            <option value="archived" className={optionCls}>Archived</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--admin-accent)" }}
          >
            <Save size={15} />{saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Basic Information</h2>
            <div>
              <label className={labelCls}>Product Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Hammered Brass Drawer Knob" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Slug *</label>
                <input type="text" required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>SKU</label>
                <input type="text" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="auto-generated" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Short Description</label>
              <textarea rows={2} value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief product description (used in listings)" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Full Description</label>
              <textarea rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description..." className={inputCls} />
            </div>
          </div>

          {/* Images */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Product Images</h2>
              <button type="button" onClick={addImageSlot} className="flex items-center gap-1 text-xs font-sans px-3 py-1.5 rounded-lg transition-colors" style={{ color: "var(--admin-accent)", backgroundColor: "var(--admin-accent)15" }}>
                <Plus size={13} /> Add Image
              </button>
            </div>
            {images.length === 0 && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: "var(--admin-border)" }}>
                <p className="text-sm font-sans" style={{ color: "var(--admin-text-muted)" }}>No images yet. Click "Add Image" to upload.</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  {img.url ? (
                    <div className="relative">
                      <img src={img.url} alt={img.alt} className="w-full h-28 object-cover rounded-lg border" style={{ borderColor: "var(--admin-border)" }} />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                      {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded bg-black/60 text-white">Main</span>}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:border-[--admin-accent]" style={{ borderColor: "var(--admin-border)" }}>
                      <Upload size={18} style={{ color: "var(--admin-text-muted)" }} />
                      <span className="text-xs font-sans mt-1" style={{ color: "var(--admin-text-muted)" }}>{uploadingIdx === idx ? "Uploading..." : "Upload"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, idx)} disabled={uploadingIdx !== null} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Specifications</h2>
              <button type="button" onClick={() => setSpecs([...specs, { key: "", value: "" }])} className="flex items-center gap-1 text-xs font-sans px-3 py-1.5 rounded-lg" style={{ color: "var(--admin-accent)", backgroundColor: "var(--admin-accent)15" }}>
                <Plus size={13} /> Add Row
              </button>
            </div>
            {specs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="e.g. Material" value={spec.key} onChange={e => { const n = [...specs]; n[idx].key = e.target.value; setSpecs(n); }} className={`${inputCls} flex-1`} />
                <input type="text" placeholder="e.g. 100% Brass" value={spec.value} onChange={e => { const n = [...specs]; n[idx].value = e.target.value; setSpecs(n); }} className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== idx))} className="p-2 rounded-lg transition-colors hover:text-red-400" style={{ color: "var(--admin-text-muted)" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>SEO</h2>
            <div>
              <label className={labelCls}>Meta Title</label>
              <input type="text" value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} placeholder="Leave blank to use product name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea rows={2} value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} placeholder="Brief description for search engines" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Right column — pricing, category, details */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Pricing (₹ INR)</h2>
            <div>
              <label className={labelCls}>Selling Price *</label>
              <input type="number" required min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Compare-at Price</label>
              <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={e => setForm({ ...form, compareAtPrice: e.target.value })} placeholder="Original / Strikethrough price" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Cost Price</label>
              <input type="number" min="0" step="0.01" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} placeholder="Your cost (not shown to customers)" className={inputCls} />
            </div>
          </div>

          {/* Category & Organization */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Organization</h2>
            <div>
              <label className={labelCls}>Category *</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls} size={1}>
                <option value="" className={optionCls}>Select category...</option>
                {categories.map(c => <option key={c._id} value={c._id} className={optionCls}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Material *</label>
              <select value={form.material} onChange={e => setForm({ ...form, material: e.target.value as typeof form.material })} className={inputCls}>
                <option value="brass" className={optionCls}>Brass</option>
                <option value="copper" className={optionCls}>Copper</option>
                <option value="mixed" className={optionCls}>Mixed (Brass & Copper)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Collections</label>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--admin-border)" }}>
                {collections.length === 0 ? (
                  <p className="px-3 py-2 text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>No collections found</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto divide-y" style={{ backgroundColor: "var(--admin-surface-2)", borderColor: "var(--admin-border)" }}>
                    {collections.map(c => (
                      <label key={c._id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-black/10 transition-colors">
                        <input
                          type="checkbox"
                          value={c._id}
                          checked={form.collections.includes(c._id)}
                          onChange={e => {
                            const selected = e.target.checked
                              ? [...form.collections, c._id]
                              : form.collections.filter(id => id !== c._id);
                            setForm({ ...form, collections: selected });
                          }}
                          style={{ accentColor: "var(--admin-accent)", width: "14px", height: "14px", flexShrink: 0 }}
                        />
                        <span className="text-xs font-sans" style={{ color: "var(--admin-text)" }}>{c.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[10px] mt-1 font-sans" style={{ color: "var(--admin-text-muted)" }}>Check all collections this product belongs to</p>
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="brass, handcrafted, home-decor" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Available Finishes</label>
              <input type="text" value={form.finishes} onChange={e => setForm({ ...form, finishes: e.target.value })} placeholder="Antique, Polished, Lacquered" className={inputCls} />
            </div>
          </div>

          {/* Inventory */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Inventory</h2>
            <div>
              <label className={labelCls}>Stock Quantity</label>
              <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Low Stock Alert Threshold</label>
              <input type="number" min="0" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Weight (grams)</label>
              <input type="number" min="0" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 350" className={inputCls} />
            </div>
          </div>

          {/* Labels */}
          <div className="p-5 rounded-xl border space-y-3" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Labels</h2>
            {[
              { key: "featured", label: "Featured Product" },
              { key: "bestseller", label: "Bestseller" },
              { key: "newArrival", label: "New Arrival" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={e => setForm({ ...form, [key]: e.target.checked })}
                  style={{ accentColor: "var(--admin-accent)" }}
                />
                <span className="text-xs font-sans" style={{ color: "var(--admin-text)" }}>{label}</span>
              </label>
            ))}
          </div>

          {/* Craft Details */}
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <h2 className="font-sans font-semibold text-sm" style={{ color: "var(--admin-text)" }}>Craft Details</h2>
            <div>
              <label className={labelCls}>Country of Origin</label>
              <input type="text" value={form.countryOfOrigin} onChange={e => setForm({ ...form, countryOfOrigin: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Craftsmanship Notes</label>
              <textarea rows={2} value={form.craftsmanship} onChange={e => setForm({ ...form, craftsmanship: e.target.value })} placeholder="How this piece is made..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Care Instructions</label>
              <textarea rows={2} value={form.careInstructions} onChange={e => setForm({ ...form, careInstructions: e.target.value })} placeholder="How to care for this product..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Warranty</label>
              <input type="text" value={form.warranty} onChange={e => setForm({ ...form, warranty: e.target.value })} placeholder="e.g. 1 year craftsmanship warranty" className={inputCls} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
