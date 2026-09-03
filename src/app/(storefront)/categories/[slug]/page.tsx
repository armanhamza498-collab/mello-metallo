import type { Metadata } from "next";
import ShopClient from "@/components/storefront/shop/ShopClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formatted} Collection — LAITON & CO`,
    description: `Shop handcrafted brass and copper ${formatted} for modern homes. Designed slowly, made to endure.`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ShopClient defaultCategory={slug} />;
}
