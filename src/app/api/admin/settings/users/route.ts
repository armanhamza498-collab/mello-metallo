import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { AdminUser } from "@/lib/models/AdminUser";

export async function GET() {
  try {
    await connectDB();
    const users = await AdminUser.find({}).select("-passwordHash").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch admin users" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
    await connectDB();
    await AdminUser.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete admin user" }, { status: 500 });
  }
}
