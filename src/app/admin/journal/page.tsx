"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Edit2, Trash2, Upload, X } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: { url: string };
  author: string;
  category: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function AdminJournalPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("LAITON & CO");
  const [category, setCategory] = useState("Journal");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/journal");
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openModal = (p?: BlogPost) => {
    setEditing(p || null);
    setTitle(p?.title || "");
    setExcerpt(p?.excerpt || "");
    setContent(p?.content || "");
    setImageUrl(p?.coverImage?.url || "");
    setAuthor(p?.author || "LAITON & CO");
    setCategory(p?.category || "Journal");
    setStatus(p?.status || "published");
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
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/journal", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editing?._id,
          title,
          excerpt,
          content,
          coverImage: imageUrl ? { url: imageUrl } : undefined,
          author,
          category,
          status,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchPosts();
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
    if (!confirm("Delete this journal article?")) return;
    await fetch(`/api/admin/journal?id=${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Journal & Editorial</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Publish blog articles, artisan stories, and care guides
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading journal articles...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center border rounded-xl border-[--admin-border] bg-[--admin-surface]">
          <BookOpen size={32} className="mx-auto mb-2 text-[--admin-text-muted]" />
          <p className="text-sm font-sans text-[--admin-text]">No articles published yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <div key={p._id} className="p-4 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-3">
              <div className="h-40 rounded-lg overflow-hidden border border-[--admin-border] bg-[--admin-surface-2]">
                {p.coverImage?.url ? (
                  <img src={p.coverImage.url} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[--admin-text-muted]">
                    <BookOpen size={24} />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[--admin-accent]/10 text-[--admin-accent] font-semibold uppercase">
                    {p.category}
                  </span>
                  <span className={`text-[10px] font-semibold ${p.status === "published" ? "text-success" : "text-warning"}`}>
                    {p.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[--admin-text] mt-1 line-clamp-1">{p.title}</h3>
                {p.excerpt && <p className="text-xs font-sans text-[--admin-text-muted] line-clamp-2 mt-1">{p.excerpt}</p>}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[--admin-border]">
                <span className="text-[10px] text-[--admin-text-muted]">{p.author}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openModal(p)} className="p-1.5 text-[--admin-text-muted] hover:text-[--admin-accent]">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 text-[--admin-text-muted] hover:text-error">
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
          <div className="w-full max-w-lg bg-[--admin-surface] border border-[--admin-border] rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-[--admin-text]">{editing ? "Edit Article" : "New Article"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[--admin-text-muted] hover:text-[--admin-text]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {imageUrl && <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[--admin-border]" />}
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 bg-[--admin-surface-2] border border-dashed border-[--admin-border] hover:border-[--admin-accent] rounded-lg text-xs text-[--admin-text-muted]">
                    <Upload size={14} />
                    <span>{uploading ? "Uploading..." : "Choose Cover Image"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Article Body Content</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full article content (Markdown supported)..."
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
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
                  {submitting ? "Saving..." : editing ? "Update" : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
