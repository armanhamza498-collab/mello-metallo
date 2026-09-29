"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, Heart, User, Menu, X, Globe, ChevronRight,
} from "lucide-react";
import { useCartStore, useCurrencyStore, useAuthStore } from "@/store";
import { CURRENCY_FLAGS } from "@/lib/currency/currency";
import SearchModal from "@/components/storefront/search/SearchModal";

// ─── Types ────────────────────────────────────────────────────
interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface SubcategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; alt?: string };
}

// ─── Announcements ────────────────────────────────────────────
const ANNOUNCEMENTS = [
  "Handcrafted in India · Delivered Worldwide",
  "Complimentary Shipping on Orders Above ₹5,000",
  "New Arrivals — The Artisan Hardware Collection",
];

// ─── Main Nav Items ───────────────────────────────────────────
const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Collections", href: "/collections" },
  { label: "Contact Us", href: "/contact" },
];

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "SGD", "AED"];

export default function StorefrontHeader() {
  const pathname = usePathname();

  // ── State ──────────────────────────────────────────────────
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategoryMap, setSubcategoryMap] = useState<Record<string, SubcategoryItem[]>>({});
  const [loadingSubcats, setLoadingSubcats] = useState<Record<string, boolean>>({});

  const [productsOpen, setProductsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileActiveCat, setMobileActiveCat] = useState<string | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const flyoutTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const catTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { totalItems, toggleCart } = useCartStore();
  const { selectedCurrency, setCurrency } = useCurrencyStore();
  const { user, fetchUser, logout } = useAuthStore();

  const cartCount = mounted ? totalItems() : 0;

  // ── Effects ────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { fetchUser(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // Fetch top-level categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  // Announcement rotation
  useEffect(() => {
    const t = setInterval(() => setAnnouncement((p) => (p + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close flyout on route change
  useEffect(() => {
    setProductsOpen(false);
    setActiveCategory(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // ── Subcategory fetch ──────────────────────────────────────
  const fetchSubcategories = useCallback(async (slug: string) => {
    if (subcategoryMap[slug] || loadingSubcats[slug]) return;
    setLoadingSubcats((p) => ({ ...p, [slug]: true }));
    try {
      const res = await fetch(`/api/categories/${slug}`);
      const data = await res.json();
      if (data.success) {
        setSubcategoryMap((p) => ({ ...p, [slug]: data.subcategories }));
      }
    } catch {}
    setLoadingSubcats((p) => ({ ...p, [slug]: false }));
  }, [subcategoryMap, loadingSubcats]);

  // ── Flyout handlers ────────────────────────────────────────
  const handleProductsEnter = () => {
    clearTimeout(flyoutTimer.current);
    setProductsOpen(true);
  };

  const handleProductsLeave = () => {
    flyoutTimer.current = setTimeout(() => {
      setProductsOpen(false);
      setActiveCategory(null);
    }, 180);
  };

  const handleCatEnter = (slug: string) => {
    clearTimeout(catTimer.current);
    clearTimeout(flyoutTimer.current);
    setActiveCategory(slug);
    fetchSubcategories(slug);
  };

  const handleCatLeave = () => {
    catTimer.current = setTimeout(() => {
      // only clear if mouse didn't move to subcategory panel
    }, 100);
  };

  const handleFlyoutEnter = () => {
    clearTimeout(flyoutTimer.current);
    clearTimeout(catTimer.current);
  };

  const handleFlyoutLeave = () => {
    flyoutTimer.current = setTimeout(() => {
      setProductsOpen(false);
      setActiveCategory(null);
    }, 180);
  };

  const closeFlyout = () => {
    setProductsOpen(false);
    setActiveCategory(null);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        className="text-center py-2.5 px-4 overflow-hidden"
        style={{ backgroundColor: "var(--espresso)", height: "var(--announcement-height)" }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={announcement}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-widest uppercase font-sans font-medium"
            style={{ color: "rgba(248,245,239,0.9)" }}
          >
            {ANNOUNCEMENTS[announcement]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Main Header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-luxury backdrop-blur-luxury" : ""
        }`}
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid var(--blush)",
          height: "var(--header-height)",
        }}
      >
        <div className="container-site h-full flex items-center justify-between gap-4">

          {/* LEFT — Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <span
              className="font-serif text-xl tracking-[0.15em] uppercase font-light transition-colors duration-300"
              style={{ color: "var(--espresso)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--espresso)")}
            >
              Mello <span style={{ color: "var(--rose-dark)" }}>Metallo</span>
            </span>
          </Link>

          {/* CENTER — Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0">

            {/* Home */}
            <Link
              href="/"
              className="nav-link-item px-4 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200"
              style={{
                color: pathname === "/" ? "var(--rose-dark)" : "var(--charcoal)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === "/" ? "var(--rose-dark)" : "var(--charcoal)")}
            >
              Home
            </Link>

            <span className="w-px h-4 mx-1" style={{ backgroundColor: "var(--blush)" }} />

            {/* About Us */}
            <Link
              href="/about"
              className="px-4 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200"
              style={{
                color: pathname === "/about" ? "var(--rose-dark)" : "var(--charcoal)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === "/about" ? "var(--rose-dark)" : "var(--charcoal)")}
            >
              About Us
            </Link>

            <span className="w-px h-4 mx-1" style={{ backgroundColor: "var(--blush)" }} />

            {/* Products — flyout trigger */}
            <div
              onMouseEnter={handleProductsEnter}
              onMouseLeave={handleProductsLeave}
              className="relative"
            >
              <button
                className="px-4 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200 flex items-center gap-1"
                style={{ color: productsOpen || pathname.startsWith("/products") ? "var(--rose-dark)" : "var(--charcoal)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = productsOpen || pathname.startsWith("/products") ? "var(--rose-dark)" : "var(--charcoal)")}
                onClick={() => setProductsOpen((o) => !o)}
                aria-expanded={productsOpen}
              >
                Products
                <ChevronRight
                  size={10}
                  className="transition-transform duration-200"
                  style={{ transform: productsOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                />
              </button>
            </div>

            <span className="w-px h-4 mx-1" style={{ backgroundColor: "var(--blush)" }} />

            {/* Collections */}
            <Link
              href="/collections"
              className="px-4 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200"
              style={{ color: pathname === "/collections" ? "var(--rose-dark)" : "var(--charcoal)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === "/collections" ? "var(--rose-dark)" : "var(--charcoal)")}
            >
              Collections
            </Link>

            <span className="w-px h-4 mx-1" style={{ backgroundColor: "var(--blush)" }} />

            {/* Contact Us */}
            <Link
              href="/contact"
              className="px-4 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200"
              style={{ color: pathname === "/contact" ? "var(--rose-dark)" : "var(--charcoal)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === "/contact" ? "var(--rose-dark)" : "var(--charcoal)")}
            >
              Contact Us
            </Link>
          </nav>

          {/* RIGHT — Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 transition-colors duration-200"
              style={{ color: "var(--charcoal)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Account */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="p-1.5 flex items-center gap-1.5 transition-colors duration-200"
                style={{ color: "var(--charcoal)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
                aria-label="Account"
              >
                {user ? (
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold font-sans tracking-wide select-none"
                    style={{ backgroundColor: "var(--rose-dark)", color: "#fff" }}
                  >
                    {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
                  </span>
                ) : (
                  <User size={18} strokeWidth={1.5} />
                )}
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-1 shadow-luxury-md min-w-[180px] z-50 py-1"
                      style={{ backgroundColor: "#fff", border: "1px solid var(--blush)" }}
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--blush)" }}>
                            <p className="text-xs font-sans font-semibold" style={{ color: "var(--charcoal)" }}>{user.firstName} {user.lastName}</p>
                            <p className="text-[11px] font-sans truncate" style={{ color: "var(--muted)" }}>{user.email}</p>
                          </div>
                          <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans transition-colors" style={{ color: "var(--charcoal)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--rose-dark)"; e.currentTarget.style.backgroundColor = "var(--blush-light)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.backgroundColor = "transparent"; }}>My Account</Link>
                          <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans transition-colors" style={{ color: "var(--charcoal)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--rose-dark)"; e.currentTarget.style.backgroundColor = "var(--blush-light)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.backgroundColor = "transparent"; }}>My Orders</Link>
                          <button onClick={async () => { await logout(); setAccountOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-sans transition-colors" style={{ color: "var(--charcoal)", borderTop: "1px solid var(--blush)", marginTop: "4px" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--rose-dark)"; e.currentTarget.style.backgroundColor = "var(--blush-light)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.backgroundColor = "transparent"; }}>Sign Out</button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans transition-colors" style={{ color: "var(--charcoal)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--rose-dark)"; e.currentTarget.style.backgroundColor = "var(--blush-light)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.backgroundColor = "transparent"; }}>Sign In</Link>
                          <Link href="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans transition-colors" style={{ color: "var(--charcoal)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--rose-dark)"; e.currentTarget.style.backgroundColor = "var(--blush-light)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.backgroundColor = "transparent"; }}>Create Account</Link>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="p-2.5 hidden sm:flex transition-colors duration-200"
              style={{ color: "var(--charcoal)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
            </Link>

            {/* Currency Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="p-2.5 flex items-center gap-1 text-xs font-medium font-sans transition-colors duration-200"
                style={{ color: "var(--charcoal)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
              >
                <Globe size={15} strokeWidth={1.5} />
                <span>{selectedCurrency}</span>
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-1 shadow-luxury-md min-w-[140px] z-50"
                    style={{ backgroundColor: "#fff", border: "1px solid var(--blush)" }}
                  >
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-sans font-medium flex items-center gap-2 transition-colors"
                        style={{ color: selectedCurrency === c ? "var(--rose-dark)" : "var(--charcoal)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--blush-light)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <span>{CURRENCY_FLAGS[c]}</span>
                        <span>{c}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="p-2.5 transition-colors duration-200 relative"
              style={{ color: "var(--charcoal)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold font-sans rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--rose-dark)", color: "#fff" }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 transition-colors duration-200 lg:hidden"
              style={{ color: "var(--charcoal)" }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* ── Products 2-Panel Flyout ── */}
        <AnimatePresence>
          {productsOpen && (
            <motion.div
              key="products-flyout"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onMouseEnter={handleFlyoutEnter}
              onMouseLeave={handleFlyoutLeave}
              className="absolute left-0 right-0 top-full z-40 flex"
              style={{
                backgroundColor: "#fff",
                borderTop: "1px solid var(--blush)",
                borderBottom: "1px solid var(--blush)",
                boxShadow: "0 12px 40px rgba(44,42,39,0.10)",
              }}
            >
              {/* LEFT — Category list */}
              <div
                className="py-6 min-w-[220px]"
                style={{ borderRight: "1px solid var(--blush)" }}
              >
                <p
                  className="px-5 mb-3 text-[10px] font-sans font-600 tracking-widest uppercase"
                  style={{ color: "var(--rose-muted)" }}
                >
                  Shop by Category
                </p>
                {categories.length === 0 ? (
                  <p className="px-5 text-xs" style={{ color: "var(--muted)" }}>Loading…</p>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat._id}
                      className={`products-flyout-category flex items-center justify-between${activeCategory === cat.slug ? " active" : ""}`}
                      onMouseEnter={() => handleCatEnter(cat.slug)}
                      onMouseLeave={handleCatLeave}
                      onClick={() => closeFlyout()}
                    >
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="flex-1 text-xs font-sans font-medium tracking-wide uppercase"
                        style={{ color: "inherit" }}
                      >
                        {cat.name}
                      </Link>
                      <ChevronRight size={12} style={{ color: "var(--rose)" }} />
                    </div>
                  ))
                )}
                <div
                  className="mt-4 mx-5 pt-4"
                  style={{ borderTop: "1px solid var(--blush)" }}
                >
                  <Link
                    href="/products"
                    className="text-xs font-sans font-medium tracking-widest uppercase flex items-center gap-1.5 transition-colors"
                    style={{ color: "var(--rose-dark)" }}
                    onClick={closeFlyout}
                  >
                    View All Categories
                    <ChevronRight size={11} />
                  </Link>
                </div>
              </div>

              {/* RIGHT — Subcategory list */}
              <div className="flex-1 py-6 px-8">
                {!activeCategory ? (
                  <div className="flex items-center justify-center h-full min-h-[120px]">
                    <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>
                      Hover a category to see subcategories
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <p
                        className="mb-4 text-[10px] font-sans font-600 tracking-widest uppercase"
                        style={{ color: "var(--rose-muted)" }}
                      >
                        {categories.find((c) => c.slug === activeCategory)?.name}
                      </p>
                      {loadingSubcats[activeCategory] ? (
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Loading…</p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1">
                          {(subcategoryMap[activeCategory] || []).map((sub) => (
                            <Link
                              key={sub._id}
                              href={`/categories/${activeCategory}/${sub.slug}`}
                              className="group py-2 text-sm font-sans flex items-center gap-1.5 transition-colors text-charcoal hover:text-brass"
                              onClick={closeFlyout}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-brass/60 group-hover:bg-brass flex-shrink-0 transition-colors" />
                              {sub.name}
                            </Link>
                          ))}
                          {(subcategoryMap[activeCategory] || []).length === 0 && !loadingSubcats[activeCategory] && (
                            <p className="text-xs col-span-3" style={{ color: "var(--muted)" }}>
                              No subcategories yet.
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile Menu Drawer ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-80 z-[60] overflow-y-auto"
              style={{ backgroundColor: "#fff", boxShadow: "4px 0 24px rgba(44,42,39,0.12)" }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-lg tracking-widest uppercase" style={{ color: "var(--espresso)" }}>
                    Mello <span style={{ color: "var(--rose-dark)" }}>Metallo</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: "var(--charcoal)" }}
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="space-y-0">
                  {MAIN_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between py-3 text-sm font-sans font-medium tracking-widest uppercase transition-colors"
                      style={{
                        color: pathname === item.href ? "var(--rose-dark)" : "var(--charcoal)",
                        borderBottom: "1px solid var(--blush-light)",
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronRight size={14} style={{ color: "var(--rose)" }} />
                    </Link>
                  ))}

                  {/* Products accordion */}
                  <div style={{ borderBottom: "1px solid var(--blush-light)" }}>
                    <button
                      className="w-full flex items-center justify-between py-3 text-sm font-sans font-medium tracking-widest uppercase"
                      style={{ color: pathname.startsWith("/products") ? "var(--rose-dark)" : "var(--charcoal)" }}
                      onClick={() => setMobileProductsOpen((o) => !o)}
                    >
                      Products
                      <ChevronRight
                        size={14}
                        className="transition-transform duration-200"
                        style={{
                          color: "var(--rose)",
                          transform: mobileProductsOpen ? "rotate(90deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 pl-4">
                            {categories.map((cat) => (
                              <div key={cat._id}>
                                <button
                                  className="w-full flex items-center justify-between py-2 text-xs font-sans font-medium tracking-wide uppercase"
                                  style={{ color: mobileActiveCat === cat.slug ? "var(--rose-dark)" : "var(--charcoal)" }}
                                  onClick={() => {
                                    if (mobileActiveCat === cat.slug) {
                                      setMobileActiveCat(null);
                                    } else {
                                      setMobileActiveCat(cat.slug);
                                      fetchSubcategories(cat.slug);
                                    }
                                  }}
                                >
                                  {cat.name}
                                  <ChevronRight
                                    size={11}
                                    className="transition-transform"
                                    style={{
                                      color: "var(--rose)",
                                      transform: mobileActiveCat === cat.slug ? "rotate(90deg)" : "rotate(0deg)",
                                    }}
                                  />
                                </button>
                                <AnimatePresence>
                                  {mobileActiveCat === cat.slug && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.18 }}
                                      className="overflow-hidden pl-4"
                                    >
                                      {(subcategoryMap[cat.slug] || []).map((sub) => (
                                        <Link
                                          key={sub._id}
                                          href={`/categories/${cat.slug}/${sub.slug}`}
                                          className="flex items-center gap-2 py-1.5 text-xs font-sans text-charcoal hover:text-brass transition-colors"
                                          onClick={() => setMobileMenuOpen(false)}
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-brass/60" />
                                          {sub.name}
                                        </Link>
                                      ))}
                                      <Link
                                        href={`/categories/${cat.slug}`}
                                        className="flex items-center gap-1 py-2 text-xs font-sans font-medium text-brass hover:underline transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        View all in {cat.name} →
                                      </Link>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </nav>

                {/* Account / Links */}
                <div className="mt-8 space-y-4">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 text-sm font-sans transition-colors"
                    style={{ color: "var(--charcoal)" }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
                  >
                    <User size={16} strokeWidth={1.5} /> My Account
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="flex items-center gap-3 text-sm font-sans transition-colors"
                    style={{ color: "var(--charcoal)" }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-dark)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal)")}
                  >
                    <Heart size={16} strokeWidth={1.5} /> Wishlist
                  </Link>
                </div>

                {/* Currency */}
                <div className="mt-8">
                  <p className="label-uppercase mb-3">Currency</p>
                  <div className="flex flex-wrap gap-2">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className="px-3 py-1.5 text-xs font-sans transition-colors"
                        style={{
                          border: selectedCurrency === c ? "1.5px solid var(--rose-dark)" : "1px solid var(--blush)",
                          color: selectedCurrency === c ? "var(--rose-dark)" : "var(--charcoal)",
                          backgroundColor: selectedCurrency === c ? "var(--blush-light)" : "transparent",
                        }}
                      >
                        {CURRENCY_FLAGS[c]} {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            style={{ backgroundColor: "rgba(44,42,39,0.3)" }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
