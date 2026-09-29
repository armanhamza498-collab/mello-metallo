import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import ProductDetailClient from "@/components/storefront/product/ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();

  const product = await Product.findOne({ slug }).lean();
  if (product) {
    return {
      title: `${product.name} — Mello Metallo`,
      description:
        product.shortDescription ||
        `Handcrafted ${product.name} in solid brass and copper homeware.`,
    };
  }

  const category = await Category.findOne({ slug }).lean();
  if (category) {
    return {
      title: `${category.name} Collection — Mello Metallo`,
      description:
        category.description ||
        `Shop handcrafted ${category.name} objects designed for modern living.`,
    };
  }

  const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formatted} — Mello Metallo`,
  };
}

export default async function ProductOrCategoryPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  // If slug matches a category, redirect to canonical /categories/ URL
  const cat = await Category.findOne({ slug, isActive: true }).lean();
  if (cat) {
    if (cat.parent) {
      const parent = await Category.findById(cat.parent).lean();
      if (parent) {
        redirect(`/categories/${parent.slug}/${cat.slug}`);
      }
    }
    redirect(`/categories/${slug}`);
  }

  // Otherwise render the product detail client
  return <ProductDetailClient slug={slug} />;
}
