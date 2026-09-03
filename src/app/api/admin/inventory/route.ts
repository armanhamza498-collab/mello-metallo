import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search");
    const lowStock = searchParams.get("lowStock") === "true";

    const query: Record<string, unknown> = { status: "published" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }
    if (lowStock) {
      query.$expr = { $lte: ["$stock", "$lowStockThreshold"] };
    }

    const products = await Product.find(query)
      .select("name sku stock lowStockThreshold status images category")
      .populate("category", "name")
      .sort({ stock: 1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    // Support bulk update: [{ id, stock, adjustment }] or single { id, stock }
    if (Array.isArray(body)) {
      const ops = body.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { stock: item.stock } },
        },
      }));
      await Product.bulkWrite(ops);
      return NextResponse.json({ success: true, updated: ops.length });
    }

    if (!body.id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    let updateQuery: Record<string, unknown>;
    if (typeof body.adjustment === "number") {
      // Relative adjustment (e.g. +5 or -3)
      updateQuery = { $inc: { stock: body.adjustment } };
    } else {
      // Absolute stock set
      updateQuery = { $set: { stock: body.stock } };
    }

    const product = await Product.findByIdAndUpdate(body.id, updateQuery, { new: true });
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update inventory" }, { status: 500 });
  }
}
