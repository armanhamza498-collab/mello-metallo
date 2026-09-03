import { connectDB } from "./connect";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Collection } from "../models/Collection";

const SEED_CATEGORIES = [
  { name: "Hardware", slug: "hardware", description: "Brass drawer knobs, cabinet pulls, and architectural fittings." },
  { name: "Cookware", slug: "cookware", description: "Hand-hammered brass and copper kadhais, vessels, and pots." },
  { name: "Drinkware", slug: "drinkware", description: "Brass and copper tumblers, water bottles, and dispensers." },
  { name: "Home Decor", slug: "home-decor", description: "Sculptural brass vases, candleholders, and trays." },
  { name: "Serveware", slug: "serveware", description: "Elegant brass thalis, bowls, and serving utensils." },
  { name: "Gifting", slug: "gifts", description: "Curated gift sets packaged in luxury presentation boxes." },
];

const SEED_PRODUCTS = [
  {
    name: "Hammered Antique Brass Drawer Knob",
    slug: "hammered-antique-brass-drawer-knob",
    sku: "LC-DK-001",
    material: "brass",
    price: 480,
    compareAtPrice: 560,
    stock: 45,
    rating: 4.9,
    reviewCount: 128,
    finishes: ["Antique Brass", "Polished Brass"],
    categorySlug: "hardware",
    images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" }],
    shortDescription: "Hand-hammered solid brass knob with a warm antique patina.",
    featured: true,
    bestseller: true,
  },
  {
    name: "Antique Brass Cabinet Handle",
    slug: "antique-brass-cabinet-handle",
    sku: "LC-CH-002",
    material: "brass",
    price: 680,
    compareAtPrice: 800,
    stock: 30,
    rating: 4.8,
    reviewCount: 94,
    finishes: ["Antique Brass", "Brushed Brass"],
    categorySlug: "hardware",
    images: [{ url: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80" }],
    shortDescription: "Architectural solid brass pull for kitchen and wardrobe cabinets.",
    featured: true,
  },
  {
    name: "Hand-Hammered Brass Kadhai",
    slug: "hand-hammered-brass-kadhai",
    sku: "LC-CK-003",
    material: "brass",
    price: 4800,
    compareAtPrice: 5600,
    stock: 12,
    rating: 5.0,
    reviewCount: 43,
    finishes: ["Antique Brass"],
    categorySlug: "cookware",
    images: [{ url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" }],
    shortDescription: "Traditional heavy-gauge brass kadhai lined with pure tin (kalai).",
    featured: true,
    bestseller: true,
  },
  {
    name: "Pure Copper Water Dispenser (5L)",
    slug: "pure-copper-water-dispenser-5l",
    sku: "LC-WD-004",
    material: "copper",
    price: 6400,
    compareAtPrice: 7200,
    stock: 8,
    rating: 4.9,
    reviewCount: 67,
    finishes: ["Hammered Copper"],
    categorySlug: "drinkware",
    images: [{ url: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=800&q=80" }],
    shortDescription: "Hand-hammered pure copper water tank with a brass tap.",
    featured: true,
    bestseller: true,
  },
  {
    name: "Hammered Brass Tumbler",
    slug: "hammered-brass-tumbler",
    sku: "LC-TM-005",
    material: "brass",
    price: 1200,
    compareAtPrice: 1400,
    stock: 25,
    rating: 4.7,
    reviewCount: 82,
    finishes: ["Hammered Brass"],
    categorySlug: "drinkware",
    images: [{ url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80" }],
    shortDescription: "Pure brass drinking vessel designed for daily ritual.",
    bestseller: true,
  },
];

export async function seedDatabase() {
  await connectDB();
  console.log("Seeding database...");

  // Seed Categories
  const categoryMap: Record<string, any> = {};
  for (const cat of SEED_CATEGORIES) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      const created = await Category.create(cat);
      categoryMap[cat.slug] = created._id;
    } else {
      categoryMap[cat.slug] = existing._id;
    }
  }

  // Seed Products
  for (const prod of SEED_PRODUCTS) {
    const existing = await Product.findOne({ slug: prod.slug });
    if (!existing) {
      await Product.create({
        ...prod,
        category: categoryMap[prod.categorySlug],
        status: "published",
      });
    }
  }

  console.log("Database seeded successfully!");
}
