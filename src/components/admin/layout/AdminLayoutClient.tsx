"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Tags, Layers, BarChart3, ShoppingCart,
  Users, Tag, Star, FileText, Image, BookOpen, HelpCircle, Globe,
  Truck, Settings, Shield, Menu, X, ChevronDown, Bell, LogOut,
  ChevronRight, Wrench, Palette, Megaphone, ClipboardList
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Products", icon: Package, children: [
          { label: "All Products", href: "/admin/products" },
          { label: "Add Product", href: "/admin/products/new" },
        ],
      },
      { label: "Categories", icon: Tags, href: "/admin/categories" },
      { label: "Collections", icon: Layers, href: "/admin/collections" },
      { label: "Inventory", icon: ClipboardList, href: "/admin/inventory" },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        label: "Orders", icon: ShoppingCart, children: [
          { label: "All Orders", href: "/admin/orders" },
          { label: "Pending", href: "/admin/orders?status=pending" },
          { label: "Shipped", href: "/admin/orders?status=shipped" },
        ],
      },
      { label: "Customers", icon: Users, href: "/admin/customers" },
      { label: "Coupons", icon: Tag, href: "/admin/coupons" },
      { label: "Reviews", icon: Star, href: "/admin/reviews" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Homepage", icon: Palette, href: "/admin/content/homepage" },
      { label: "Banners", icon: Megaphone, href: "/admin/content/banners" },
      { label: "Pages", icon: FileText, href: "/admin/content/pages" },
      { label: "Journal", icon: BookOpen, href: "/admin/journal" },
      { label: "FAQs", icon: HelpCircle, href: "/admin/content/faqs" },
      { label: "Care Guides", icon: Wrench, href: "/admin/content/care" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Currency", icon: Globe, href: "/admin/settings/currency" },
      { label: "Shipping", icon: Truck, href: "/admin/settings/shipping" },
      { label: "Users", icon: Shield, href: "/admin/settings/users" },
      { label: "General", icon: Settings, href: "/admin/settings" },
    ],
  },
];

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (item.children) {
    const isActive = item.children.some((c) => pathname === c.href);
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? "text-[--admin-accent] bg-[--admin-accent]/10" : "text-[--admin-text-muted] hover:text-[--admin-text] hover:bg-[--admin-surface-3]"}`}
        >
          <item.icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown size={12} className={`transition-transform ${open || isActive ? "rotate-180" : ""}`} />
            </>
          )}
        </button>
        <AnimatePresence>
          {(open || isActive) && !collapsed && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="ml-7 mt-1 space-y-0.5">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block px-3 py-1.5 rounded-md text-xs transition-all ${pathname === child.href ? "text-[--admin-accent] font-medium" : "text-[--admin-text-muted] hover:text-[--admin-text]"}`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href!}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? "text-[--admin-accent] bg-[--admin-accent]/10 font-medium" : "text-[--admin-text-muted] hover:text-[--admin-text] hover:bg-[--admin-surface-3]"}`}
    >
      <item.icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string; role: string } | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;

    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.admin) setAdmin(d.admin);
        else router.push("/admin/login");
      })
      .catch(() => router.push("/admin/login"));
  }, []); // Run ONCE on mount, NOT on every pathname change

  const handleLogout = async () => {
    await fetch("/api/admin/auth?action=logout", { method: "POST" });
    router.push("/admin/login");
  };

  // ── Standalone Login Screen (No Sidebar / Header) ─────────
  if (pathname === "/admin/login") {
    return <div className="admin-layout min-h-screen bg-[--admin-bg]">{children}</div>;
  }

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--admin-surface)", borderRight: "1px solid var(--admin-border)" }}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: "var(--admin-border)", height: "60px" }}>
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--admin-accent)" }}>
          <span className="text-white font-serif text-xs font-bold">L</span>
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="font-serif text-sm tracking-widest uppercase font-light" style={{ color: "var(--admin-text)" }}>Mello Metallo</p>
            <p className="text-[9px] font-sans tracking-wider uppercase" style={{ color: "var(--admin-text-muted)" }}>Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {section.title && !sidebarCollapsed && (
              <p className="px-3 mb-2 text-[9px] font-sans font-semibold tracking-widest uppercase" style={{ color: "var(--admin-text-muted)", opacity: 0.5 }}>
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItemComponent key={item.label} item={item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Admin User */}
      <div className="p-3 border-t" style={{ borderColor: "var(--admin-border)" }}>
        {admin && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: "var(--admin-accent)" }}>
              {admin.name[0]}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans font-medium truncate" style={{ color: "var(--admin-text)" }}>{admin.name}</p>
                <p className="text-[10px] font-sans capitalize" style={{ color: "var(--admin-text-muted)" }}>{admin.role}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button onClick={handleLogout} className="text-[--admin-text-muted] hover:text-error transition-colors" title="Logout">
                <LogOut size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-layout flex h-screen overflow-hidden" style={{ backgroundColor: "var(--admin-bg)", color: "var(--admin-text)" }}>
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 64 : 260 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setMobileSidebarOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-[60] w-[260px] lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 lg:px-6 h-[60px] flex-shrink-0 border-b" style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface)" }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setMobileSidebarOpen(!mobileSidebarOpen);
                setSidebarCollapsed(!sidebarCollapsed);
              }}
              className="text-[--admin-text-muted] hover:text-[--admin-text] transition-colors"
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
            <nav className="hidden md:flex items-center gap-1 text-xs font-sans" style={{ color: "var(--admin-text-muted)" }}>
              <span>Admin</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative text-[--admin-text-muted] hover:text-[--admin-text] transition-colors">
              <Bell size={18} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-error rounded-full flex items-center justify-center text-[8px] text-white font-bold">3</span>
            </button>

            {/* View Store */}
            <Link href="/" target="_blank" className="hidden md:flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 border rounded-sm transition-colors hover:text-[--admin-accent]" style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}>
              View Store <ChevronRight size={11} />
            </Link>

            {/* Logout */}
            <button onClick={handleLogout} className="text-xs font-sans flex items-center gap-1.5 transition-colors" style={{ color: "var(--admin-text-muted)" }}>
              <LogOut size={14} strokeWidth={1.5} />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6" style={{ backgroundColor: "var(--admin-bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
