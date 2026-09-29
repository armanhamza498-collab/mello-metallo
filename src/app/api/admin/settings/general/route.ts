import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { StoreSetting } from "@/lib/models/Settings";

const DEFAULTS = {
  storeName: "Mello Metallo",
  supportEmail: "hello@mellometallo.com",
  supportPhone: "+91 98765 43210",
  address: "42 Artisan Quarter, Jaipur, Rajasthan 302001, India",
  currency: "INR",
  timezone: "Asia/Kolkata",
};

export async function GET() {
  try {
    await connectDB();
    const setting = await StoreSetting.findOne({ key: "general" });
    return NextResponse.json({ success: true, settings: setting?.value ?? DEFAULTS });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    await StoreSetting.findOneAndUpdate(
      { key: "general" },
      { $set: { value: body } },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save settings" }, { status: 500 });
  }
}
