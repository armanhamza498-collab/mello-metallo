import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { StoreSetting } from "@/lib/models/Settings";

const DEFAULTS = {
  zones: [
    {
      name: "India",
      countries: ["IN"],
      methods: [
        { name: "Standard Delivery", price: 350, freeAbove: 5000, estimatedDays: "5-7" },
        { name: "Express Delivery", price: 800, freeAbove: null, estimatedDays: "2-3" },
      ],
    },
    {
      name: "International",
      countries: ["*"],
      methods: [
        { name: "International Standard", price: 2500, freeAbove: 15000, estimatedDays: "10-15" },
      ],
    },
  ],
};

export async function GET() {
  try {
    await connectDB();
    const setting = await StoreSetting.findOne({ key: "shipping" });
    return NextResponse.json({ success: true, shipping: setting?.value ?? DEFAULTS });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch shipping settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    await StoreSetting.findOneAndUpdate(
      { key: "shipping" },
      { $set: { value: body } },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save shipping settings" }, { status: 500 });
  }
}
