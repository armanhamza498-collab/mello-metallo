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
    description: `Shop the curated ${formatted} collection of solid brass and copper objects.`,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ShopClient defaultCollection={slug} />;
}
