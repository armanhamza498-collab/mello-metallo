import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";
import { Review } from "@/lib/models/Review";
import { z } from "zod";

// ─── Admin Products CRUD ──────────────────────────────────────

export async function GET_products(req: NextRequest) {
  await connectDB();
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const q = searchParams.get("q");
  const status = searchParams.get("status");
  const material = searchParams.get("material");
  const category = searchParams.get("category");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (material) filter.material = material;
  if (category) filter.category = category;
  if (q) filter.$or = [
    { name: new RegExp(q, "i") },
    { sku: new RegExp(q, "i") },
  ];

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .select("-description -productStory -careInstructions")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
}

const ProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  description: z.string().default(""),
  shortDescription: z.string().default(""),
  material: z.enum(["brass", "copper", "mixed"]),
  category: z.string(),
  price: z.number().min(0),
  compareAtPrice: z.number().optional(),
  costPrice: z.number().optional(),
  stock: z.number().default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  newArrival: z.boolean().default(true),
  countryOfOrigin: z.string().default("India"),
  tags: z.array(z.string()).default([]),
  finishes: z.array(z.string()).default([]),
  collections: z.array(z.string()).default([]),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  images: z.array(z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() })).default([]),
  seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
}).passthrough();

export async function POST_product(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation error", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const product = await Product.create(parsed.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "SKU or slug already exists" }, { status: 409 });
    }
    console.error("[ADMIN PRODUCT CREATE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT_product(req: NextRequest, id: string) {
  try {
    const body = await req.json();
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[ADMIN PRODUCT UPDATE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE_product(id: string) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ADMIN PRODUCT DELETE]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── Admin Dashboard Stats ────────────────────────────────────
export async function GET_dashboard(req: NextRequest) {
  await connectDB();
  const { searchParams } = req.nextUrl;
  const period = searchParams.get("period") || "30"; // days
  const since = new Date();
  since.setDate(since.getDate() - parseInt(period));

  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    pendingOrders,
    recentOrders,
    topProducts,
    ordersByStatus,
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: since } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    User.countDocuments({ createdAt: { $gte: since } }),
    Product.countDocuments({ status: "published" }),
    Product.countDocuments({ $expr: { $lte: ["$stock", "$lowStockThreshold"] }, status: "published" }),
    Order.countDocuments({ fulfillmentStatus: "pending" }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber customerName total fulfillmentStatus paymentStatus createdAt currency")
      .lean(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", name: { $first: "$items.productName" }, totalQty: { $sum: "$items.quantity" }, revenue: { $sum: "$items.totalPrice" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]),
    Order.aggregate([
      { $group: { _id: "$fulfillmentStatus", count: { $sum: 1 } } },
    ]),
  ]);

  return NextResponse.json({
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      pendingOrders,
    },
    recentOrders,
    topProducts,
    ordersByStatus,
  });
}
