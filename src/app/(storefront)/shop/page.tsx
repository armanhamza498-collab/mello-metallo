import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "@/components/storefront/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop All Brass & Copper Objects",
  description: "Browse the complete LAITON & CO collection of handcrafted brass and copper homeware — hardware, cookware, drinkware, home decor and gift sets.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-sans text-muted">Loading collection...</div>}>
      <ShopClient />
    </Suspense>
  );
}
