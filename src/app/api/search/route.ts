import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Collection } from "@/lib/models/Collection";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ results: [], products: [], categories: [], collections: [] });
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const [products, categories, collections] = await Promise.all([
      Product.find({
        status: "published",
        $or: [
          { name: searchRegex },
          { tags: searchRegex },
          { sku: searchRegex },
          { shortDescription: searchRegex },
        ],
      })
        .select("name slug price images material rating")
        .limit(limit)
        .lean(),

      Category.find({ name: searchRegex, isActive: true })
        .select("name slug")
        .limit(4)
        .lean(),

      Collection.find({ name: searchRegex, isActive: true })
        .select("name slug")
        .limit(4)
        .lean(),
    ]);

    return NextResponse.json({ products, categories, collections });
  } catch (err) {
    console.error("[SEARCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
