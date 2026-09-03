import Link from "next/link";

// ─── Inline SVG Brand Icons ───────────────────────────────────
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

const FOOTER_LINKS = {
  Shop: [
    { label: "Brass", href: "/shop?material=brass" },
    { label: "Copper", href: "/shop?material=copper" },
    { label: "Cookware", href: "/shop?category=cookware" },
    { label: "Drinkware", href: "/shop?category=drinkware" },
    { label: "Hardware", href: "/shop?category=hardware" },
    { label: "Home Decor", href: "/shop?category=home-decor" },
    { label: "Gifting", href: "/shop?category=gifts" },
    { label: "New Arrivals", href: "/shop?newArrival=true" },
  ],
  About: [
    { label: "Our Story", href: "/about" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Materials", href: "/materials" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
  "Customer Care": [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Track Order", href: "/track" },
    { label: "FAQs", href: "/faqs" },
    { label: "Care Guide", href: "/care" },
    { label: "Contact Support", href: "/contact" },
  ],
  Business: [
    { label: "Wholesale", href: "/wholesale" },
    { label: "Corporate Gifting", href: "/corporate" },
    { label: "Interior Designers", href: "/trade" },
    { label: "Hospitality", href: "/hospitality" },
    { label: "Trade Program", href: "/trade" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex", "UPI", "Razorpay", "PayPal"];

export default function StorefrontFooter() {
  return (
    <footer className="bg-espresso text-ivory/80">
      {/* Main Footer */}
      <div className="container-site py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="block mb-6">
              <span className="font-serif text-2xl tracking-[0.15em] text-ivory uppercase font-light">
                Laiton <span className="text-brass-light">&</span> Co
              </span>
            </Link>
            <p className="text-sm font-sans text-ivory/60 leading-relaxed mb-6 max-w-[220px]">
              Brass and copper objects crafted for the modern home. Made by hand, meant to last.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-ivory/20 flex items-center justify-center hover:border-brass hover:text-brass transition-colors duration-200" aria-label="Instagram">
                <InstagramIcon size={14} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-ivory/20 flex items-center justify-center hover:border-brass hover:text-brass transition-colors duration-200" aria-label="Pinterest">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.995.499 1.806 1.476 1.806 1.772 0 3.133-1.867 3.133-4.562 0-2.387-1.715-4.056-4.163-4.056-2.836 0-4.5 2.126-4.5 4.322 0 .856.33 1.772.741 2.273a.3.3 0 0 1 .069.284c-.075.314-.243.995-.277 1.134-.044.183-.145.222-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.522 0 10-4.477 10-10S17.522 2 12 2z" /></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-ivory/20 flex items-center justify-center hover:border-brass hover:text-brass transition-colors duration-200" aria-label="Facebook">
                <FacebookIcon size={14} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-ivory/20 flex items-center justify-center hover:border-brass hover:text-brass transition-colors duration-200" aria-label="YouTube">
                <YoutubeIcon size={14} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-sans text-[10px] font-semibold tracking-widest uppercase text-ivory/40 mb-5">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-sans text-ivory/60 hover:text-brass transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-ivory/10" />

      {/* Bottom Bar */}
      <div className="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-sans text-ivory/40 tracking-wide">
          © {new Date().getFullYear()} LAITON & CO. All rights reserved. Crafted in India.
        </p>
        {/* Payment Icons */}
        <div className="flex items-center gap-2">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method}
              className="px-2 py-1 border border-ivory/15 text-[9px] font-sans font-semibold text-ivory/40 tracking-wide rounded-sm"
            >
              {method}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
