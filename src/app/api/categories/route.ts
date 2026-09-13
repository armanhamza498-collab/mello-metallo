import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";

export async function GET() {
  try {
    await connectDB();

    // Top-level categories only (no parent)
    const categories = await Category.find({
      parent: null,
      isActive: true,
    })
      .select("name slug displayOrder")
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
