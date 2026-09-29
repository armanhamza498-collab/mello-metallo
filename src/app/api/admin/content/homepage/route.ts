import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { HomepageSection } from "@/lib/models/Content";

// Default sections structure if DB is empty
const DEFAULT_SECTIONS = [
  {
    type: "hero",
    title: "Hero Section",
    isEnabled: true,
    displayOrder: 0,
    content: {
      heading: "Objects of Enduring Character.",
      subheading: "Handcrafted brass and copper objects, shaped by time-honoured Indian craft.",
      ctaText: "Shop the Collection",
      ctaUrl: "/shop",
      image: "",
    },
  },
  {
    type: "featured-collection",
    title: "Featured Collection",
    isEnabled: true,
    displayOrder: 1,
    content: {
      heading: "The Brass Edit",
      description: "Curated pieces that bring warmth and character to everyday living.",
      ctaText: "Explore Collection",
      ctaUrl: "/collections",
      image: "",
    },
  },
  {
    type: "value-props",
    title: "Value Propositions",
    isEnabled: true,
    displayOrder: 2,
    content: {
      items: [
        { icon: "🔨", title: "Handcrafted", description: "Every piece shaped by skilled artisans" },
        { icon: "🌿", title: "Sustainable", description: "Natural materials, zero plastic" },
        { icon: "🚚", title: "Free Shipping", description: "On orders above ₹5,000" },
        { icon: "✨", title: "Lifetime Quality", description: "Brass & copper age beautifully" },
      ],
    },
  },
  {
    type: "bestsellers",
    title: "Bestsellers Section",
    isEnabled: true,
    displayOrder: 3,
    content: {
      heading: "Bestsellers",
      description: "The pieces our customers love most.",
    },
  },
  {
    type: "craftsmanship",
    title: "Craftsmanship Story",
    isEnabled: true,
    displayOrder: 4,
    content: {
      heading: "Made by Hand, Built to Last",
      description: "Each piece in our collection is crafted using traditional Indian metalworking techniques passed down through generations.",
      ctaText: "Our Story",
      ctaUrl: "/craftsmanship",
      image: "",
    },
  },
  {
    type: "journal",
    title: "Journal / Blog",
    isEnabled: true,
    displayOrder: 5,
    content: {
      heading: "From the Journal",
      description: "Stories of craft, care, and conscious living.",
    },
  },
  {
    type: "newsletter",
    title: "Newsletter",
    isEnabled: true,
    displayOrder: 6,
    content: {
      heading: "Join the Mello Metallo Circle",
      description: "Be the first to know about new collections, artisan stories, and exclusive offers.",
      ctaText: "Subscribe",
    },
  },
];

export async function GET() {
  try {
    await connectDB();
    let sections = await HomepageSection.find({}).sort({ displayOrder: 1 }).lean();

    if (!sections || sections.length === 0) {
      // Seed defaults
      sections = await HomepageSection.insertMany(DEFAULT_SECTIONS);
    }

    return NextResponse.json({ success: true, sections });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch homepage sections" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    // body is an array of section updates or a single section update
    const updates = Array.isArray(body) ? body : [body];

    const results = await Promise.all(
      updates.map((section) =>
        HomepageSection.findOneAndUpdate(
          { type: section.type },
          {
            $set: {
              title: section.title,
              isEnabled: section.isEnabled,
              displayOrder: section.displayOrder,
              content: section.content,
            },
          },
          { new: true, upsert: true }
        )
      )
    );

    return NextResponse.json({ success: true, sections: results });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update homepage sections" }, { status: 500 });
  }
}
