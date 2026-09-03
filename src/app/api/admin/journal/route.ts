import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/lib/models/Content";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, posts, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch journal posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const slug = body.slug || slugify(body.title, { lower: true, strict: true });
    const post = await BlogPost.create({ ...body, slug });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    if (!body._id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    const post = await BlogPost.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    await connectDB();
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete post" }, { status: 500 });
  }
}
