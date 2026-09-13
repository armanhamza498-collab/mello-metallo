import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";

// Seed data: categories (no image) + subcategories (with image + description)
const SEED_DATA = [
  {
    name: "Cabinet Hardware",
    slug: "cabinet-hardware",
    displayOrder: 1,
    subcategories: [
      {
        name: "Cabinet Knobs",
        slug: "cabinet-knobs",
        description: "Solid brass cabinet knobs in a variety of finishes — from unlacquered living brass to antique and polished styles. Each knob is handcrafted to add character to your kitchen and furniture.",
        displayOrder: 1,
        image: {
          url: "https://images.unsplash.com/photo-1585586723682-b4df7c864aab?w=800&q=80",
          alt: "Cabinet Knobs",
        },
      },
      {
        name: "Cabinet Pulls",
        slug: "cabinet-pulls",
        description: "Elegantly crafted brass cabinet pulls that combine function with timeless beauty. Available in bar pulls, cup pulls, and bin pull styles.",
        displayOrder: 2,
        image: {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          alt: "Cabinet Pulls",
        },
      },
      {
        name: "Cabinet Latches",
        slug: "cabinet-latches",
        description: "Solid brass cabinet latches designed to keep your cabinetry secure while adding a refined traditional touch.",
        displayOrder: 3,
        image: {
          url: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80",
          alt: "Cabinet Latches",
        },
      },
      {
        name: "Hooks & Rings",
        slug: "hooks-rings",
        description: "Handcrafted brass hooks and ring pulls — perfect for towel rails, wardrobes, and decorative wall mounting.",
        displayOrder: 4,
        image: {
          url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
          alt: "Hooks and Rings",
        },
      },
    ],
  },
  {
    name: "Door Hardware",
    slug: "door-hardware",
    displayOrder: 2,
    subcategories: [
      {
        name: "Door Knobs",
        slug: "door-knobs",
        description: "Solid brass door knobs in classic and contemporary profiles. Engineered for smooth daily use and designed to age beautifully.",
        displayOrder: 1,
        image: {
          url: "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?w=800&q=80",
          alt: "Door Knobs",
        },
      },
      {
        name: "Door Handles",
        slug: "door-handles",
        description: "Lever-style door handles in solid brass. Ergonomic, durable, and crafted to complement both period and modern interiors.",
        displayOrder: 2,
        image: {
          url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
          alt: "Door Handles",
        },
      },
      {
        name: "Escutcheons",
        slug: "escutcheons",
        description: "Decorative brass keyhole covers and escutcheon plates that add an elegant finishing detail to any door.",
        displayOrder: 3,
        image: {
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
          alt: "Escutcheons",
        },
      },
    ],
  },
  {
    name: "Kitchen & Cookware",
    slug: "kitchen-cookware",
    displayOrder: 3,
    subcategories: [
      {
        name: "Brass Kadhai",
        slug: "brass-kadhai",
        description: "Heavy-gauge brass kadhais lined with tin, crafted using traditional methods passed down through generations. Perfect for slow-cooking authentic Indian recipes.",
        displayOrder: 1,
        image: {
          url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
          alt: "Brass Kadhai",
        },
      },
      {
        name: "Serving Vessels",
        slug: "serving-vessels",
        description: "Handcrafted brass serving bowls, handi, and pot sets that bring warmth and elegance to your dining table.",
        displayOrder: 2,
        image: {
          url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
          alt: "Serving Vessels",
        },
      },
      {
        name: "Thali Sets",
        slug: "thali-sets",
        description: "Complete brass thali sets with bowls, plates, and serving spoons — a treasured part of traditional Indian dining culture.",
        displayOrder: 3,
        image: {
          url: "https://images.unsplash.com/photo-1585586723682-b4df7c864aab?w=800&q=80",
          alt: "Thali Sets",
        },
      },
    ],
  },
  {
    name: "Drinkware",
    slug: "drinkware",
    displayOrder: 4,
    subcategories: [
      {
        name: "Brass Tumblers",
        slug: "brass-tumblers",
        description: "Traditional solid brass drinking tumblers. Naturally antimicrobial, these tumblers are ideal for water, buttermilk, and herbal infusions.",
        displayOrder: 1,
        image: {
          url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
          alt: "Brass Tumblers",
        },
      },
      {
        name: "Copper Water Bottles",
        slug: "copper-water-bottles",
        description: "Hand-hammered pure copper water bottles and pitchers. Store water overnight to naturally ionize and purify.",
        displayOrder: 2,
        image: {
          url: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=800&q=80",
          alt: "Copper Water Bottles",
        },
      },
      {
        name: "Serving Sets",
        slug: "serving-sets",
        description: "Complete brass and copper serving sets — pitcher, tumblers, and tray — for elegant home entertaining.",
        displayOrder: 3,
        image: {
          url: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80",
          alt: "Serving Sets",
        },
      },
    ],
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    displayOrder: 5,
    subcategories: [
      {
        name: "Vases & Planters",
        slug: "vases-planters",
        description: "Sculptural solid brass vases and planters that bring organic warmth and metallic lustre to any space — contemporary or traditional.",
        displayOrder: 1,
        image: {
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
          alt: "Vases and Planters",
        },
      },
      {
        name: "Candle Holders",
        slug: "candle-holders",
        description: "Handcrafted brass candle holders and diyas that cast a warm golden glow. Perfect for festive decor and everyday ambience.",
        displayOrder: 2,
        image: {
          url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
          alt: "Candle Holders",
        },
      },
      {
        name: "Bowls & Trays",
        slug: "bowls-trays",
        description: "Decorative solid brass bowls and serving trays — functional art pieces that elevate your living spaces.",
        displayOrder: 3,
        image: {
          url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
          alt: "Bowls and Trays",
        },
      },
    ],
  },
  {
    name: "Gifting",
    slug: "gifting",
    displayOrder: 6,
    subcategories: [
      {
        name: "Wedding Gifts",
        slug: "wedding-gifts",
        description: "Beautifully curated brass and copper gift sets for weddings — timeless, meaningful, and handcrafted to last a lifetime.",
        displayOrder: 1,
        image: {
          url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
          alt: "Wedding Gifts",
        },
      },
      {
        name: "Housewarming",
        slug: "housewarming",
        description: "Auspicious brass homewares gifted to celebrate new beginnings. From lakshmi idols to decorative bowls and diyas.",
        displayOrder: 2,
        image: {
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
          alt: "Housewarming Gifts",
        },
      },
      {
        name: "Corporate Gifts",
        slug: "corporate-gifts",
        description: "Premium solid brass corporate gift collections — elegant enough to impress and meaningful enough to be treasured.",
        displayOrder: 3,
        image: {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          alt: "Corporate Gifts",
        },
      },
    ],
  },
];

export async function POST() {
  try {
    await connectDB();

    const results: { categories: number; subcategories: number; skipped: number } = {
      categories: 0,
      subcategories: 0,
      skipped: 0,
    };

    for (const catData of SEED_DATA) {
      // Upsert parent category
      let parent = await Category.findOne({ slug: catData.slug });
      if (!parent) {
        parent = await Category.create({
          name: catData.name,
          slug: catData.slug,
          isActive: true,
          displayOrder: catData.displayOrder,
          parent: null,
        });
        results.categories++;
      } else {
        results.skipped++;
      }

      // Upsert subcategories
      for (const sub of catData.subcategories) {
        const existing = await Category.findOne({ slug: sub.slug });
        if (!existing) {
          await Category.create({
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            image: sub.image,
            parent: parent._id,
            isActive: true,
            displayOrder: sub.displayOrder,
          });
          results.subcategories++;
        } else {
          results.skipped++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${results.categories} categories and ${results.subcategories} subcategories. Skipped ${results.skipped} existing.`,
      results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seed failed";
    console.error("[SEED CATEGORIES]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
