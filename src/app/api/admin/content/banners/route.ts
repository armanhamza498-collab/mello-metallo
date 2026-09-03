import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Banner } from "@/lib/models/Content";

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const banner = await Banner.create(body);
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create banner" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    if (!body._id) return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
    const banner = await Banner.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
    await connectDB();
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete banner" }, { status: 500 });
  }
}
