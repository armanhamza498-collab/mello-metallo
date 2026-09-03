"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, Heart, User, ChevronDown, Menu, X, Globe, ArrowRight
} from "lucide-react";
import { useCartStore, useCurrencyStore, useAuthStore } from "@/store";
import { CURRENCY_FLAGS } from "@/lib/currency/currency";
import SearchModal from "@/components/storefront/search/SearchModal";

// ─── Mega Menu Data ───────────────────────────────────────────
const MEGA_MENU = {
  Brass: {
    columns: [
      {
        title: "Shop Brass",
        links: [
          { label: "Cookware", href: "/shop?material=brass&category=cookware" },
          { label: "Drinkware", href: "/shop?material=brass&category=drinkware" },
          { label: "Serveware", href: "/shop?material=brass&category=serveware" },
          { label: "Home Decor", href: "/shop?material=brass&category=home-decor" },
          { label: "Tableware", href: "/shop?material=brass&category=tableware" },
        ],
      },
      {
        title: "Hardware",
        links: [
          { label: "Drawer Knobs", href: "/shop?category=drawer-knobs" },
          { label: "Cabinet Handles", href: "/shop?category=cabinet-handles" },
          { label: "Hooks & Pulls", href: "/shop?category=hooks-pulls" },
          { label: "Door Hardware", href: "/shop?category=door-hardware" },
        ],
      },
    ],
    featured: { label: "The Heritage Collection", href: "/collections/heritage", image: "https://images.unsplash.com/photo-1585586723682-b4df7c864aab?w=400&q=80" },
  },
  Copper: {
    columns: [
      {
        title: "Shop Copper",
        links: [
          { label: "Cookware", href: "/shop?material=copper&category=cookware" },
          { label: "Drinkware", href: "/shop?material=copper&category=drinkware" },
          { label: "Water Dispensers", href: "/shop?category=water-dispensers" },
          { label: "Home Decor", href: "/shop?material=copper&category=home-decor" },
          { label: "Gift Sets", href: "/shop?material=copper&category=gift-sets" },
        ],
      },
    ],
    featured: { label: "Copper Essentials", href: "/collections/copper", image: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=400&q=80" },
  },
  Kitchen: {
    columns: [
      {
        title: "Cookware",
        links: [
          { label: "Brass Kadhai", href: "/shop?category=kadhai" },
          { label: "Serving Vessels", href: "/shop?category=serving-vessels" },
          { label: "Ladles & Spoons", href: "/shop?category=ladles" },
          { label: "Mortar & Pestle", href: "/shop?category=mortar-pestle" },
        ],
      },
      {
        title: "Serveware",
        links: [
          { label: "Serving Trays", href: "/shop?category=serving-trays" },
          { label: "Serving Bowls", href: "/shop?category=serving-bowls" },
          { label: "Thali Sets", href: "/shop?category=thali" },
        ],
      },
    ],
    featured: { label: "Brass Kitchen Collection", href: "/collections/kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
  },
  Drinkware: {
    columns: [
      {
        title: "All Drinkware",
        links: [
          { label: "Brass Tumblers", href: "/shop?category=tumblers" },
          { label: "Water Bottles", href: "/shop?category=water-bottles" },
          { label: "Copper Tumblers", href: "/shop?material=copper&category=tumblers" },
          { label: "Serving Sets", href: "/shop?category=serving-sets" },
          { label: "Water Dispensers", href: "/shop?category=water-dispensers" },
        ],
      },
    ],
    featured: { label: "Ritual Drinkware", href: "/collections/drinkware", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80" },
  },
  Home: {
    columns: [
      {
        title: "Home Decor",
        links: [
          { label: "Vases", href: "/shop?category=vases" },
          { label: "Bowls & Trays", href: "/shop?category=bowls-trays" },
          { label: "Candle Holders", href: "/shop?category=candle-holders" },
          { label: "Planters", href: "/shop?category=planters" },
          { label: "Sculptural Objects", href: "/shop?category=sculptures" },
        ],
      },
      {
        title: "Hardware",
        links: [
          { label: "Door Hardware", href: "/shop?category=door-hardware" },
          { label: "Bathroom", href: "/shop?category=bathroom" },
          { label: "Lighting", href: "/shop?category=lighting" },
        ],
      },
    ],
    featured: { label: "Objects for the Home", href: "/collections/home", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
  },
  Hardware: {
    columns: [
      {
        title: "Cabinet & Drawer",
        links: [
          { label: "Drawer Knobs", href: "/shop?category=drawer-knobs" },
          { label: "Cabinet Knobs", href: "/shop?category=cabinet-knobs" },
          { label: "Handles & Pulls", href: "/shop?category=handles-pulls" },
          { label: "Hooks", href: "/shop?category=hooks" },
        ],
      },
      {
        title: "Door Hardware",
        links: [
          { label: "Door Knobs", href: "/shop?category=door-knobs" },
          { label: "Door Handles", href: "/shop?category=door-handles" },
          { label: "Escutcheons", href: "/shop?category=escutcheons" },
        ],
      },
    ],
    featured: { label: "The Hardware Edit", href: "/collections/hardware", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  },
  Gifting: {
    columns: [
      {
        title: "By Occasion",
        links: [
          { label: "Wedding Gifts", href: "/shop?category=wedding-gifts" },
          { label: "Housewarming", href: "/shop?category=housewarming" },
          { label: "Anniversary", href: "/shop?category=anniversary" },
          { label: "Corporate Gifts", href: "/shop?category=corporate" },
          { label: "Festive Gifts", href: "/shop?category=festive" },
        ],
      },
      {
        title: "By Budget",
        links: [
          { label: "Under ₹2,000", href: "/shop?maxPrice=2000&category=gifts" },
          { label: "Under ₹5,000", href: "/shop?maxPrice=5000&category=gifts" },
          { label: "Luxury Sets", href: "/shop?minPrice=5000&category=gifts" },
        ],
      },
    ],
    featured: { label: "Curated Gift Sets", href: "/collections/gifting", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80" },
  },
  Collections: {
    columns: [
      {
        title: "Our Collections",
        links: [
          { label: "Heritage Collection", href: "/collections/heritage" },
          { label: "Modern Brass", href: "/collections/modern-brass" },
          { label: "Everyday Objects", href: "/collections/everyday" },
          { label: "Artisan Collection", href: "/collections/artisan" },
          { label: "Signature Collection", href: "/collections/signature" },
        ],
      },
    ],
    featured: { label: "New Arrivals", href: "/shop?newArrival=true", image: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80" },
  },
  Categories: {
    columns: [
      {
        title: "Shop by Category",
        links: [
          { label: "Hardware", href: "/shop?category=hardware" },
          { label: "Cookware", href: "/shop?category=cookware" },
          { label: "Drinkware", href: "/shop?category=drinkware" },
          { label: "Serveware", href: "/shop?category=serveware" },
          { label: "Home Decor", href: "/shop?category=home-decor" },
          { label: "Gifting", href: "/shop?category=gifting" },
        ],
      },
    ],
    featured: { label: "Handcrafted in India", href: "/shop", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80" },
  },
};

const NAV_ITEMS = ["Brass", "Copper", "Kitchen", "Drinkware", "Home", "Gifting", "Collections"];

const ANNOUNCEMENTS = [
  "Handcrafted in India · Delivered Worldwide",
  "Complimentary Shipping on Orders Above ₹5,000",
  "New Arrivals — The Artisan Hardware Collection",
];

export default function StorefrontHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { totalItems, toggleCart } = useCartStore();
  const { selectedCurrency, setCurrency } = useCurrencyStore();
  const { user, fetchUser, logout } = useAuthStore();

  const CURRENCIES = ["INR", "USD", "EUR", "GBP", "SGD", "AED"];

  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Announcement rotation
  useEffect(() => {
    const t = setInterval(
      () => setAnnouncement((p) => (p + 1) % ANNOUNCEMENTS.length),
      4000
    );
    return () => clearInterval(t);
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMenuEnter = (item: string) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(item);
  };

  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? totalItems() : 0;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-espresso text-ivory/90 text-center py-2.5 px-4 overflow-hidden" style={{ height: "var(--announcement-height)" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={announcement}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-xs tracking-widest uppercase font-sans font-medium"
          >
            {ANNOUNCEMENTS[announcement]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ivory/95 backdrop-blur-luxury shadow-luxury"
            : "bg-ivory"
        }`}
        style={{ height: "var(--header-height)" }}
      >
        <div className="container-site h-full flex items-center justify-between gap-4">

          {/* LEFT — Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <span className="font-serif text-xl tracking-[0.15em] text-espresso uppercase font-light group-hover:text-brass transition-colors duration-300">
              Laiton <span className="text-brass">&</span> Co
            </span>
          </Link>

          {/* CENTER — Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5" ref={menuRef}>
            {/* Direct shop link */}
            <Link
              href="/shop"
              className="px-3 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200 text-charcoal hover:text-brass"
            >
              Shop All
            </Link>
            <span className="w-px h-4 bg-sand mx-1" />
            {NAV_ITEMS.map((item) => (
              <div
                key={item}
                onMouseEnter={() => handleMenuEnter(item)}
                onMouseLeave={handleMenuLeave}
                className="relative"
              >
                <button
                  className={`px-2.5 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200 flex items-center gap-1 ${
                    activeMenu === item ? "text-brass" : "text-charcoal hover:text-brass"
                  }`}
                >
                  {item}
                  <ChevronDown
                    size={10}
                    className={`transition-transform duration-200 ${activeMenu === item ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            ))}
            <span className="w-px h-4 bg-sand mx-1" />
            <Link
              href="/craftsmanship"
              className="px-3 py-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors duration-200 text-charcoal hover:text-brass"
            >
              Our Story
            </Link>
          </nav>

          {/* RIGHT — Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-charcoal hover:text-brass transition-colors duration-200 relative group"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Account / User */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="p-1.5 text-charcoal hover:text-brass transition-colors duration-200 flex items-center gap-1.5"
                aria-label="Account"
              >
                {user ? (
                  <span className="w-8 h-8 rounded-full bg-brass text-ivory flex items-center justify-center text-[11px] font-bold font-sans tracking-wide select-none">
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
                      className="absolute right-0 top-full mt-1 bg-ivory border border-sand shadow-luxury-md min-w-[180px] z-50 py-1"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-sand">
                            <p className="text-xs font-sans font-semibold text-charcoal">{user.firstName} {user.lastName}</p>
                            <p className="text-[11px] font-sans text-muted truncate">{user.email}</p>
                          </div>
                          <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans text-charcoal hover:text-brass hover:bg-cream transition-colors">My Account</Link>
                          <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans text-charcoal hover:text-brass hover:bg-cream transition-colors">My Orders</Link>
                          <button
                            onClick={async () => { await logout(); setAccountOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-sans text-charcoal hover:text-brass hover:bg-cream transition-colors border-t border-sand mt-1"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans text-charcoal hover:text-brass hover:bg-cream transition-colors">Sign In</Link>
                          <Link href="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-xs font-sans text-charcoal hover:text-brass hover:bg-cream transition-colors">Create Account</Link>
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
              className="p-2.5 text-charcoal hover:text-brass transition-colors duration-200 hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
            </Link>

            {/* Currency Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="p-2.5 text-charcoal hover:text-brass transition-colors duration-200 flex items-center gap-1 text-xs font-medium font-sans"
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
                    className="absolute right-0 top-full mt-1 bg-ivory border border-sand shadow-luxury-md min-w-[140px] z-50"
                  >
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-sans font-medium flex items-center gap-2 hover:bg-cream transition-colors ${selectedCurrency === c ? "text-brass" : "text-charcoal"}`}
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
              className="p-2.5 text-charcoal hover:text-brass transition-colors duration-200 relative"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brass text-ivory text-[9px] font-bold font-sans rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-charcoal hover:text-brass transition-colors duration-200 lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && MEGA_MENU[activeMenu as keyof typeof MEGA_MENU] && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => { clearTimeout(closeTimer.current); setActiveMenu(activeMenu); }}
              onMouseLeave={handleMenuLeave}
              className="absolute left-0 right-0 top-full bg-ivory border-t border-b border-sand shadow-luxury-lg z-40"
            >
              <div className="container-site py-10 grid grid-cols-12 gap-8">
                {/* Columns */}
                <div className="col-span-8 flex gap-12">
                  {MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].columns.map((col) => (
                    <div key={col.title}>
                      <p className="label-uppercase mb-5" style={{ color: "#8B7355" }}>{col.title}</p>
                      <ul className="space-y-2.5">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="text-sm font-sans transition-colors duration-200 inline-block py-0.5 border-b border-transparent hover:border-brass/40"
                              style={{ color: "#2C2A27" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#8B7355")}
                              onMouseLeave={e => (e.currentTarget.style.color = "#2C2A27")}
                              onClick={() => setActiveMenu(null)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Featured Card */}
                <div className="col-span-4">
                  <Link
                    href={MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].featured.href}
                    className="group block relative overflow-hidden bg-cream"
                    onClick={() => setActiveMenu(null)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].featured.image}
                        alt={MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].featured.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/hero-brass.png";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="label-uppercase mb-1" style={{ color: "#8B7355" }}>Featured</p>
                      <p className="font-serif text-lg" style={{ color: "#1A1714" }}>
                        {MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].featured.label}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-80 bg-ivory z-[60] shadow-luxury-lg overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-lg tracking-widest text-espresso uppercase">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-charcoal">
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
                <nav className="space-y-0">
                  <Link
                    href="/shop"
                    className="flex items-center justify-between py-3 border-b border-cream text-sm font-sans font-semibold tracking-widest uppercase text-brass hover:text-brass-dark transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shop All
                    <ArrowRight size={14} />
                  </Link>
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item}
                      href={`/shop?category=${item.toLowerCase()}`}
                      className="flex items-center justify-between py-3 border-b border-cream text-sm font-sans font-medium tracking-widest uppercase text-charcoal hover:text-brass transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                      <ChevronDown size={14} className="-rotate-90" />
                    </Link>
                  ))}
                  <Link
                    href="/craftsmanship"
                    className="flex items-center justify-between py-3 border-b border-cream text-sm font-sans font-medium tracking-widest uppercase text-charcoal hover:text-brass transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Our Story
                    <ChevronDown size={14} className="-rotate-90" />
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center justify-between py-3 border-b border-cream text-sm font-sans font-medium tracking-widest uppercase text-charcoal hover:text-brass transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                    <ChevronDown size={14} className="-rotate-90" />
                  </Link>
                </nav>
                <div className="mt-8 space-y-4">
                  <Link href="/account" className="flex items-center gap-3 text-sm font-sans text-charcoal" onClick={() => setMobileMenuOpen(false)}>
                    <User size={16} strokeWidth={1.5} /> My Account
                  </Link>
                  <Link href="/account/wishlist" className="flex items-center gap-3 text-sm font-sans text-charcoal" onClick={() => setMobileMenuOpen(false)}>
                    <Heart size={16} strokeWidth={1.5} /> Wishlist
                  </Link>
                </div>
                {/* Currency selector mobile */}
                <div className="mt-8">
                  <p className="label-uppercase mb-3">Currency</p>
                  <div className="flex flex-wrap gap-2">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`px-3 py-1.5 text-xs font-sans border transition-colors ${selectedCurrency === c ? "border-brass text-brass bg-brass/5" : "border-sand text-charcoal"}`}
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
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-espresso/30 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
