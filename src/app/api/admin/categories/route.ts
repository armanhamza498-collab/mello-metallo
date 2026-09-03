import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import slugify from "slugify";

const DEFAULT_CATEGORIES = [
  { name: "Hardware", slug: "hardware", description: "Knobs, handles, and pulls for cabinets and doors", displayOrder: 1 },
  { name: "Cookware", slug: "cookware", description: "Traditional brass and copper cooking vessels", displayOrder: 2 },
  { name: "Drinkware", slug: "drinkware", description: "Brass tumblers, copper water bottles, and pitchers", displayOrder: 3 },
  { name: "Serveware", slug: "serveware", description: "Serving bowls, trays, and thali sets", displayOrder: 4 },
  { name: "Home Decor", slug: "home-decor", description: "Vases, candle holders, and decorative objects", displayOrder: 5 },
  { name: "Gifting", slug: "gifting", description: "Curated gift sets for weddings, housewarmings, and special occasions", displayOrder: 6 },
];

export async function GET() {
  try {
    await connectDB();
    let categories = await Category.find({}).sort({ displayOrder: 1, name: 1 }).lean();

    if (!categories || categories.length === 0) {
      categories = await Category.insertMany(DEFAULT_CATEGORIES);
    }

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    const slug = body.slug || slugify(body.name, { lower: true, strict: true });

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 400 });
    }

    const category = await Category.create({
      name: body.name,
      slug,
      description: body.description,
      image: body.image,
      isActive: body.isActive ?? true,
      displayOrder: body.displayOrder || 0,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    if (!body._id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    await connectDB();
    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete category" }, { status: 500 });
  }
}
