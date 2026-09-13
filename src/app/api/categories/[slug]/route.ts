import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    await connectDB();

    // Find the parent category by slug
    const category = await Category.findOne({ slug, isActive: true })
      .select("name slug description displayOrder")
      .lean<{ _id: unknown; name: string; slug: string; description?: string; displayOrder: number }>();

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Find subcategories (children) — these have images and descriptions
    const subcategories = await Category.find({
      parent: category._id,
      isActive: true,
    })
      .select("name slug description image displayOrder")
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, category, subcategories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
