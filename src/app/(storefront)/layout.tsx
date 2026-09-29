import type { Metadata } from "next";
import { Suspense } from "react";
import StorefrontHeader from "@/components/storefront/layout/StorefrontHeader";
import StorefrontFooter from "@/components/storefront/layout/StorefrontFooter";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import ScrollToTop from "@/components/storefront/layout/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "Mello Metallo — Brass & Copper Objects for the Modern Home",
    template: "%s | Mello Metallo",
  },
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <StorefrontHeader />
      <main className="min-h-screen">{children}</main>
      <CartDrawer />
      <StorefrontFooter />
    </>
  );
}
