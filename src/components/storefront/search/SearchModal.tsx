"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCurrencyStore } from "@/store";

interface SearchResult {
  products: Array<{ _id: string; name: string; slug: string; price: number; images: Array<{ url: string }>; material: string; rating: number }>;
  categories: Array<{ _id: string; name: string; slug: string }>;
  collections: Array<{ _id: string; name: string; slug: string }>;
}

const POPULAR_SEARCHES = ["Brass Drawer Knobs", "Copper Tumbler", "Brass Kadhai", "Gift Set", "Cabinet Handles"];
const RECENT_KEY = "laiton_recent_searches";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { format } = useCurrencyStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
    } else {
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-espresso/50 z-[70] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[80] bg-ivory shadow-luxury-lg max-h-[80vh] overflow-y-auto"
          >
            {/* Search Input */}
            <div className="container-site py-6">
              <div className="flex items-center gap-4 border-b-2 border-charcoal pb-4">
                <Search size={20} strokeWidth={1.5} className="text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInput}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(query); }}
                  placeholder="Search for brass knobs, copper tumblers, gift sets..."
                  className="flex-1 bg-transparent outline-none font-sans text-lg text-charcoal placeholder:text-muted"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setResults(null); }} className="text-muted hover:text-charcoal">
                    <X size={18} />
                  </button>
                )}
                <button onClick={onClose} className="text-muted hover:text-charcoal">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="container-site pb-8">
              {/* Loading */}
              {loading && (
                <div className="py-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-brass border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Results */}
              {!loading && results && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Products */}
                  {results.products.length > 0 && (
                    <div className="lg:col-span-2">
                      <p className="label-uppercase mb-4">Products</p>
                      <div className="space-y-3">
                        {results.products.map((p) => (
                          <Link
                            key={p._id}
                            href={`/products/${p.slug}`}
                            onClick={() => handleSearch(p.name)}
                            className="flex items-center gap-4 p-3 hover:bg-cream rounded-sm transition-colors group"
                          >
                            <div className="w-14 h-14 bg-cream flex-shrink-0 overflow-hidden">
                              {p.images?.[0]?.url && (
                                <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-sans font-medium text-charcoal truncate group-hover:text-brass transition-colors">{p.name}</p>
                              <p className="text-xs text-muted capitalize">{p.material}</p>
                            </div>
                            <p className="text-sm font-sans font-semibold text-charcoal flex-shrink-0">{format(p.price)}</p>
                          </Link>
                        ))}
                      </div>
                      {results.products.length >= 6 && (
                        <Link
                          href={`/search?q=${encodeURIComponent(query)}`}
                          onClick={onClose}
                          className="btn-link mt-4 inline-flex"
                        >
                          View all results <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Categories & Collections */}
                  {(results.categories.length > 0 || results.collections.length > 0) && (
                    <div>
                      {results.categories.length > 0 && (
                        <>
                          <p className="label-uppercase mb-3">Categories</p>
                          <ul className="space-y-2 mb-6">
                            {results.categories.map((c) => (
                              <li key={c._id}>
                                <Link href={`/categories/${c.slug}`} onClick={onClose} className="text-sm font-sans text-charcoal hover:text-brass transition-colors flex items-center gap-2">
                                  <ArrowRight size={12} /> {c.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {results.collections.length > 0 && (
                        <>
                          <p className="label-uppercase mb-3">Collections</p>
                          <ul className="space-y-2">
                            {results.collections.map((c) => (
                              <li key={c._id}>
                                <Link href={`/collections/${c.slug}`} onClick={onClose} className="text-sm font-sans text-charcoal hover:text-brass transition-colors flex items-center gap-2">
                                  <ArrowRight size={12} /> {c.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}

                  {/* No results */}
                  {results.products.length === 0 && results.categories.length === 0 && (
                    <div className="col-span-3 py-8 text-center">
                      <p className="text-charcoal font-serif text-xl mb-2">No results for "{query}"</p>
                      <p className="text-sm text-muted">Try searching for brass, copper, knobs, or cookware</p>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State — show suggestions */}
              {!loading && !results && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="label-uppercase mb-4 flex items-center gap-2">
                        <Clock size={12} /> Recent
                      </p>
                      <ul className="space-y-2.5">
                        {recentSearches.map((s) => (
                          <li key={s}>
                            <button
                              onClick={() => { setQuery(s); search(s); }}
                              className="text-sm font-sans text-charcoal hover:text-brass transition-colors"
                            >
                              {s}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className="label-uppercase mb-4 flex items-center gap-2">
                      <TrendingUp size={12} /> Popular
                    </p>
                    <ul className="space-y-2.5">
                      {POPULAR_SEARCHES.map((s) => (
                        <li key={s}>
                          <button
                            onClick={() => { setQuery(s); search(s); }}
                            className="text-sm font-sans text-charcoal hover:text-brass transition-colors"
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
