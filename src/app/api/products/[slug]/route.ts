import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    // Match by slug (case-insensitive)
    const product = await Product.findOne({
      slug: { $regex: new RegExp(`^${slug}$`, "i") },
    })
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("collections", "name slug")
      .populate("adminSelectedRelated", "name slug price compareAtPrice images rating material")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products by category/material if admin hasn't selected them
    let related = (product as any).adminSelectedRelated;
    if (!related || related.length === 0) {
      related = await Product.find({
        _id: { $ne: (product as any)._id },
        $or: [
          { category: (product as any).category?._id },
          { material: (product as any).material },
        ],
      })
        .select("name slug price compareAtPrice images rating material")
        .limit(8)
        .lean();
    }

    return NextResponse.json({ product: { ...product, related } });
  } catch (err) {
    console.error("[PRODUCT SLUG]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
