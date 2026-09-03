"use client";

import { useState, useEffect } from "react";
import { Plus, HelpCircle, Edit2, Trash2, X } from "lucide-react";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [submitting, setSubmitting] = useState(false);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content/faqs");
      const data = await res.json();
      if (data.faqs) setFaqs(data.faqs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const openModal = (f?: FAQItem) => {
    setEditing(f || null);
    setQuestion(f?.question || "");
    setAnswer(f?.answer || "");
    setCategory(f?.category || "General");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setSubmitting(true);
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/content/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editing?._id,
          question,
          answer,
          category,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchFAQs();
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
    if (!confirm("Delete this FAQ item?")) return;
    await fetch(`/api/admin/content/faqs?id=${id}`, { method: "DELETE" });
    fetchFAQs();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Frequently Asked Questions</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Manage FAQs displayed on customer care and product pages
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[--admin-text-muted]">Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="py-12 text-center border rounded-xl border-[--admin-border] bg-[--admin-surface]">
          <HelpCircle size={32} className="mx-auto mb-2 text-[--admin-text-muted]" />
          <p className="text-sm font-sans text-[--admin-text]">No FAQs added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f._id} className="p-4 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[--admin-accent]/10 text-[--admin-accent] font-semibold">
                    {f.category || "General"}
                  </span>
                  <h3 className="font-sans font-semibold text-sm text-[--admin-text]">{f.question}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openModal(f)} className="p-1 text-[--admin-text-muted] hover:text-[--admin-accent]">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(f._id)} className="p-1 text-[--admin-text-muted] hover:text-error">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-xs font-sans text-[--admin-text-muted] leading-relaxed pl-1">{f.answer}</p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[--admin-surface] border border-[--admin-border] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-[--admin-text]">{editing ? "Edit FAQ" : "Add FAQ"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[--admin-text-muted] hover:text-[--admin-text]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Shipping, Care, Orders"
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[--admin-text-muted] mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[--admin-border]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-sans text-[--admin-text-muted]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
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
