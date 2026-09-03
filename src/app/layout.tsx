import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "LAITON & CO — Brass & Copper Objects for the Modern Home",
    template: "%s | LAITON & CO",
  },
  description:
    "Handcrafted brass and copper homeware designed for modern living. Discover our collection of brass hardware, cookware, drinkware, home decor, and gift sets.",
  keywords: [
    "brass homeware",
    "copper homeware",
    "handcrafted brass",
    "brass drawer knobs",
    "brass cabinet handles",
    "brass cookware",
    "brass drinkware",
    "Indian craftsmanship",
    "luxury homeware",
    "brass hardware",
  ],
  authors: [{ name: "LAITON & CO" }],
  creator: "LAITON & CO",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "LAITON & CO",
    title: "LAITON & CO — Brass & Copper Objects for the Modern Home",
    description:
      "Handcrafted brass and copper homeware designed for modern living.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LAITON & CO — Brass & Copper Homeware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LAITON & CO — Brass & Copper Objects for the Modern Home",
    description:
      "Handcrafted brass and copper homeware designed for modern living.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
