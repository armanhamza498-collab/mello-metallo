import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { FAQ } from "@/lib/models/Settings";

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({}).sort({ displayOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, faqs });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const faq = await FAQ.create(body);
    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create FAQ" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    if (!body._id) return NextResponse.json({ error: "FAQ ID required" }, { status: 400 });
    const faq = await FAQ.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, faq });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "FAQ ID required" }, { status: 400 });
    await connectDB();
    await FAQ.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete FAQ" }, { status: 500 });
  }
}
