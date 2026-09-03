"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut, ShoppingBag, Tag, Copy, Check, ArrowRight, Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { useWishlistStore, useCartStore, useCurrencyStore, useAuthStore } from "@/store";
import { motion } from "framer-motion";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  fulfillmentStatus: string;
  paymentStatus: string;
  total: number;
  currency: string;
  items: OrderItem[];
}

interface Address {
  _id?: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-brass",
  delivered: "badge-success",
  cancelled: "badge-error",
  returned: "badge-error",
  paid: "badge-success",
  failed: "badge-error",
};

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "cart" | "offers" | "addresses" | "profile">("orders");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { items: wishlistIds } = useWishlistStore();
  const { items: cartItems, subtotalINR } = useCartStore();
  const { format } = useCurrencyStore();
  const { user, fetchUser, logout, loading: authLoading } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // New address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState<Address>({
    firstName: "", lastName: "", address1: "", address2: "", city: "",
    state: "", postalCode: "", country: "India", phone: "",
  });
  const [addrSaving, setAddrSaving] = useState(false);

  // Fetch user and orders on mount
  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
      });
      setAddresses((user as unknown as { addresses: Address[] }).addresses || []);
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === "orders") {
      setOrdersLoading(true);
      fetch("/api/auth/orders")
        .then((r) => r.json())
        .then((d) => setOrders(d.orders || []))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [user, activeTab]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/auth/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        await fetchUser();
        setProfileMsg("Profile saved successfully.");
      } else {
        setProfileMsg("Failed to save. Try again.");
      }
    } catch {
      setProfileMsg("Network error.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddAddress = async () => {
    setAddrSaving(true);
    try {
      const res = await fetch("/api/auth/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_address", address: addrForm }),
      });
      if (res.ok) {
        const d = await res.json();
        setAddresses(d.addresses || []);
        setShowAddressForm(false);
        setAddrForm({ firstName: "", lastName: "", address1: "", city: "", postalCode: "", country: "India", phone: "" });
      }
    } catch {}
    setAddrSaving(false);
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      const res = await fetch("/api/auth/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_address", addressId }),
      });
      if (res.ok) {
        const d = await res.json();
        setAddresses(d.addresses || []);
      }
    } catch {}
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 size={32} className="text-brass animate-spin" />
      </div>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`;

  const STATIC_OFFERS = [
    {
      code: "WELCOME10",
      title: "First Order Special — 10% OFF",
      desc: "Enjoy 10% off your first purchase across all handcrafted brass and copper collections.",
      validity: "Valid for your first order",
      discount: "10% OFF",
    },
    {
      code: "FREESHIP5K",
      title: "Complimentary Express Delivery",
      desc: "Free insured shipping across India on all orders above ₹5,000.",
      validity: "Automatically applied at checkout",
      discount: "FREE SHIPPING",
    },
  ];

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="container-site">
        {/* Account Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-sand">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-full bg-brass text-ivory flex items-center justify-center text-xl font-bold font-sans tracking-wide select-none"
            >
              {initials}
            </motion.div>
            <div>
              <p className="label-uppercase mb-1">Client Portal</p>
              <h1 className="font-serif text-2xl md:text-3xl text-espresso font-light">Welcome back, {user.firstName}</h1>
              <p className="text-xs font-sans text-muted mt-0.5">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary py-2 px-4 text-xs inline-flex items-center gap-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "orders", label: `My Orders`, icon: Package },
              { id: "wishlist", label: `Wishlist (${wishlistIds.length})`, icon: Heart },
              { id: "cart", label: `My Cart (${cartItems.length})`, icon: ShoppingBag },
              { id: "offers", label: "Offers & Coupons", icon: Tag },
              { id: "addresses", label: "Saved Addresses", icon: MapPin },
              { id: "profile", label: "Profile Details", icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium transition-all text-left ${activeTab === tab.id ? "bg-espresso text-ivory" : "bg-cream text-charcoal hover:bg-sand/50"}`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Orders */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-espresso mb-4">Order History</h2>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={28} className="text-brass animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-cream p-8 border border-sand text-center">
                    <Package size={32} className="text-muted mx-auto mb-3" />
                    <p className="text-sm text-muted font-sans mb-4">You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="btn-primary inline-flex text-xs">
                      Start Shopping <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="bg-cream p-6 border border-sand">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-sand">
                        <div>
                          <p className="font-mono text-sm font-bold text-charcoal">{order.orderNumber}</p>
                          <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`badge ${STATUS_COLOR[order.fulfillmentStatus] || ""}`}>{order.fulfillmentStatus}</span>
                          <span className="font-serif text-lg font-semibold text-espresso">{format(order.total)}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs font-sans text-muted mb-4">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {item.image && <img src={item.image} alt={item.productName} className="w-8 h-8 object-cover bg-ivory flex-shrink-0" />}
                            <p>• {item.productName} × {item.quantity}</p>
                          </div>
                        ))}
                        {order.items.length > 3 && <p className="text-muted">+{order.items.length - 3} more items</p>}
                      </div>
                      <Link href={`/account/orders/${order.orderNumber}`} className="btn-secondary py-2 text-xs inline-flex items-center gap-1.5">
                        View Details <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="font-serif text-2xl text-espresso mb-4">Saved Wishlist ({wishlistIds.length})</h2>
                {wishlistIds.length === 0 ? (
                  <div className="bg-cream p-8 border border-sand text-center">
                    <Heart size={32} className="text-muted mx-auto mb-3" />
                    <p className="text-sm text-muted font-sans mb-4">Your wishlist is currently empty.</p>
                    <Link href="/shop" className="btn-primary inline-flex text-xs">
                      Explore Shop <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistIds.map((id) => (
                      <div key={id} className="bg-cream p-4 border border-sand flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-sans text-brass uppercase font-semibold mb-1">Saved Item</p>
                          <p className="text-sm font-sans font-medium text-charcoal mb-3 font-mono text-[11px]">{id.slice(-8)}</p>
                        </div>
                        <Link href="/shop" className="btn-secondary py-2 text-xs text-center">
                          View in Shop
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Preview */}
            {activeTab === "cart" && (
              <div>
                <h2 className="font-serif text-2xl text-espresso mb-4">Shopping Cart ({cartItems.length} items)</h2>
                {cartItems.length === 0 ? (
                  <div className="bg-cream p-8 border border-sand text-center">
                    <ShoppingBag size={32} className="text-muted mx-auto mb-3" />
                    <p className="text-sm text-muted font-sans mb-4">Your cart is currently empty.</p>
                    <Link href="/shop" className="btn-primary inline-flex text-xs">
                      Shop Now <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div className="bg-cream p-6 border border-sand space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.variantId}`} className="flex items-center gap-4 pb-4 border-b border-sand last:border-0 last:pb-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 object-cover bg-ivory" />}
                        <div className="flex-1">
                          <p className="text-sm font-sans font-medium text-charcoal">{item.name}</p>
                          <p className="text-xs text-muted">Qty: {item.quantity} · {item.variantName || "Standard"}</p>
                        </div>
                        <span className="font-sans font-semibold text-charcoal">{format(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-sand flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted">Subtotal</p>
                        <p className="font-serif text-2xl font-semibold text-espresso">{format(subtotalINR())}</p>
                      </div>
                      <Link href="/checkout" className="btn-primary text-xs">
                        Proceed to Checkout <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Offers & Coupons */}
            {activeTab === "offers" && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-espresso mb-4">Exclusive Member Offers</h2>
                {STATIC_OFFERS.map((offer) => (
                  <div key={offer.code} className="bg-cream p-6 border border-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-brass">{offer.discount}</span>
                        <span className="text-xs font-sans text-muted">{offer.validity}</span>
                      </div>
                      <h3 className="font-serif text-xl text-espresso mb-1">{offer.title}</h3>
                      <p className="text-xs font-sans text-muted max-w-md">{offer.desc}</p>
                    </div>
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className="btn-secondary py-2.5 px-4 text-xs font-mono font-bold uppercase shrink-0 flex items-center gap-2"
                    >
                      {copiedCode === offer.code ? (
                        <>Copied <Check size={14} className="text-success" /></>
                      ) : (
                        <>{offer.code} <Copy size={14} /></>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Addresses */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-espresso">Saved Delivery Addresses</h2>
                  <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5">
                    <Plus size={14} /> Add Address
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cream p-6 border border-sand mb-6"
                  >
                    <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">New Address</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">First Name</label>
                        <input className="input-luxury" value={addrForm.firstName} onChange={(e) => setAddrForm({ ...addrForm, firstName: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Last Name</label>
                        <input className="input-luxury" value={addrForm.lastName} onChange={(e) => setAddrForm({ ...addrForm, lastName: e.target.value })} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs text-muted mb-1">Address Line 1</label>
                      <input className="input-luxury" value={addrForm.address1} onChange={(e) => setAddrForm({ ...addrForm, address1: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs text-muted mb-1">Address Line 2 (Optional)</label>
                      <input className="input-luxury" value={addrForm.address2 || ""} onChange={(e) => setAddrForm({ ...addrForm, address2: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">City</label>
                        <input className="input-luxury" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">State</label>
                        <input className="input-luxury" value={addrForm.state || ""} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">Postal Code</label>
                        <input className="input-luxury" value={addrForm.postalCode} onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Country</label>
                        <input className="input-luxury" value={addrForm.country} onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs text-muted mb-1">Phone</label>
                      <input className="input-luxury" value={addrForm.phone || ""} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleAddAddress} disabled={addrSaving} className="btn-primary py-2.5 text-xs disabled:opacity-60">
                        {addrSaving ? <Loader2 size={14} className="animate-spin" /> : "Save Address"}
                      </button>
                      <button onClick={() => setShowAddressForm(false)} className="btn-secondary py-2.5 text-xs">Cancel</button>
                    </div>
                  </motion.div>
                )}

                {addresses.length === 0 ? (
                  <div className="bg-cream p-8 border border-sand text-center">
                    <MapPin size={32} className="text-muted mx-auto mb-3" />
                    <p className="text-sm text-muted font-sans">No saved addresses yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr, i) => (
                      <div key={addr._id || i} className="bg-cream p-5 border border-sand relative">
                        {addr.isDefault && <span className="badge badge-brass mb-2">Primary</span>}
                        <p className="font-semibold text-sm text-charcoal mb-1">{addr.firstName} {addr.lastName}</p>
                        <p className="text-xs text-muted leading-relaxed">
                          {addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}<br />
                          {addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.postalCode}<br />
                          {addr.country}
                          {addr.phone && <><br />{addr.phone}</>}
                        </p>
                        {addr._id && (
                          <button
                            onClick={() => handleRemoveAddress(addr._id!)}
                            className="absolute top-3 right-3 text-muted hover:text-error transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {activeTab === "profile" && (
              <div className="max-w-md space-y-4">
                <h2 className="font-serif text-2xl text-espresso mb-4">Profile Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans text-muted mb-1">First Name</label>
                    <input
                      type="text"
                      className="input-luxury"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans text-muted mb-1">Last Name</label>
                    <input
                      type="text"
                      className="input-luxury"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-sans text-muted mb-1">Email Address</label>
                  <input type="email" className="input-luxury opacity-60 cursor-not-allowed" value={user.email} readOnly />
                  <p className="text-[11px] text-muted mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-xs font-sans text-muted mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="input-luxury"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                {profileMsg && (
                  <p className={`text-xs font-sans ${profileMsg.includes("success") ? "text-success" : "text-error"}`}>{profileMsg}</p>
                )}
                <button onClick={handleProfileSave} disabled={profileSaving} className="btn-primary py-3 disabled:opacity-60 flex items-center gap-2">
                  {profileSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
