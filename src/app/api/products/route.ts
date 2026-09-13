import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Collection } from "@/lib/models/Collection";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const sort = searchParams.get("sort") || "featured";
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const collection = searchParams.get("collection");
    const material = searchParams.get("material");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const finish = searchParams.get("finish");
    const availability = searchParams.get("availability");
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const newArrival = searchParams.get("newArrival");
    const q = searchParams.get("q") || searchParams.get("search");

    // Build filter
    const filter: Record<string, unknown> = {};

    // Category — resolve slug → ObjectId
    if (category) {
      const slug = category.toLowerCase().replace(/ /g, "-");
      const catDoc = await Category.findOne({
        $or: [
          { slug },
          { name: { $regex: new RegExp(slug.replace(/-/g, " "), "i") } },
        ],
      }).lean<{ _id: unknown }>();

      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        // Fallback: match by tag or material if category slug doesn't exist as Category doc
        filter.$or = [
          { tags: { $regex: new RegExp(slug, "i") } },
          { material: { $regex: new RegExp(slug, "i") } },
        ];
      }
    }

    // Subcategory — resolve slug → ObjectId, filter by product.subcategory field
    if (subcategory) {
      const subSlug = subcategory.toLowerCase().replace(/ /g, "-");
      const subDoc = await Category.findOne({
        $or: [
          { slug: subSlug },
          { name: { $regex: new RegExp(subSlug.replace(/-/g, " "), "i") } },
        ],
      }).lean<{ _id: unknown }>();

      if (subDoc) {
        filter.subcategory = subDoc._id;
      } else {
        filter.$or = [
          { tags: { $regex: new RegExp(subSlug, "i") } },
        ];
      }
    }


    // Collection — resolve slug → Collection ObjectId, Category ObjectId, or Tag/Material
    if (collection) {
      const colSlug = collection.toLowerCase().replace(/ /g, "-");
      const colDoc = await Collection.findOne({
        $or: [
          { slug: colSlug },
          { name: { $regex: new RegExp(colSlug.replace(/-/g, " "), "i") } },
        ],
      }).lean<{ _id: unknown }>();

      if (colDoc) {
        filter.collections = colDoc._id;
      } else {
        // Check if collection matches a Category doc
        const catDoc = await Category.findOne({
          $or: [
            { slug: colSlug },
            { name: { $regex: new RegExp(colSlug.replace(/-/g, " "), "i") } },
          ],
        }).lean<{ _id: unknown }>();

        if (catDoc) {
          filter.category = catDoc._id;
        } else {
          // Fallback matching by tag, material, or name
          filter.$or = [
            { material: { $regex: new RegExp(colSlug, "i") } },
            { tags: { $regex: new RegExp(colSlug, "i") } },
            { name: { $regex: new RegExp(colSlug.replace(/-/g, " "), "i") } },
          ];
        }
      }
    }

    if (material) filter.material = { $regex: new RegExp(`^${material}$`, "i") };
    if (finish) filter.finishes = { $elemMatch: { $regex: new RegExp(finish, "i") } };
    if (featured === "true") filter.featured = true;
    if (bestseller === "true") filter.bestseller = true;
    if (newArrival === "true") filter.newArrival = true;
    if (availability === "In Stock" || availability === "instock") filter.stock = { $gt: 0 };
    if (availability === "Out of Stock" || availability === "outofstock") filter.stock = 0;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = parseFloat(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = parseFloat(maxPrice);
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Sort mapping
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      bestseller: { bestseller: -1, rating: -1 },
      featured: { featured: -1, createdAt: -1 },
    };

    const sortOption = sortMap[sort] || sortMap.featured;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(
          "name slug sku material price compareAtPrice images rating reviewCount stock featured bestseller newArrival finishes status"
        )
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[PRODUCTS GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
