import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Collection } from "@/lib/models/Collection";
import slugify from "slugify";

const DEFAULT_COLLECTIONS = [
  { name: "The Heritage Edit", slug: "heritage", description: "Timeless brass and copper artifacts rooted in Indian tradition", featured: true },
  { name: "Modern Brass Hardware", slug: "brass-hardware", description: "Minimalist and hammered brass knobs and handles", featured: true },
  { name: "Ritual Drinkware", slug: "drinkware-collection", description: "Pure copper and brass drinkware designed for daily wellness", featured: true },
  { name: "Artisan Kitchenware", slug: "artisan-kitchen", description: "Handcrafted cooking vessels made to last generations", featured: false },
];

export async function GET() {
  try {
    await connectDB();
    let collections = await Collection.find({}).sort({ createdAt: -1 }).lean();

    if (!collections || collections.length === 0) {
      collections = await Collection.insertMany(DEFAULT_COLLECTIONS);
    }

    return NextResponse.json({ success: true, collections });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const slug = body.slug || slugify(body.name, { lower: true, strict: true });
    const existing = await Collection.findOne({ slug });
    if (existing) return NextResponse.json({ error: "Collection slug already exists" }, { status: 400 });
    const collection = await Collection.create({ ...body, slug });
    return NextResponse.json({ success: true, collection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create collection" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    if (!body._id) return NextResponse.json({ error: "Collection ID required" }, { status: 400 });
    const collection = await Collection.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Collection ID required" }, { status: 400 });
    await connectDB();
    await Collection.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete collection" }, { status: 500 });
  }
}
