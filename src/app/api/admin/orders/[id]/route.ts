import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    // Try by orderNumber first (e.g. LC-1001), then by MongoDB _id
    const order = await Order.findOne({ orderNumber: id }).populate("items.product", "name images").lean()
      || await Order.findById(id).populate("items.product", "name images").lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    // Push timeline event if status changed
    const updateData: Record<string, unknown> = { ...body };
    if (body.fulfillmentStatus) {
      updateData.$push = {
        timeline: {
          status: body.fulfillmentStatus,
          note: body.timelineNote || `Status updated to ${body.fulfillmentStatus}`,
          createdBy: "admin",
          timestamp: new Date(),
        },
      };
      delete updateData.timelineNote;
    }

    const order = await Order.findOneAndUpdate(
      { $or: [{ orderNumber: id }, { _id: id }] },
      updateData,
      { new: true }
    );
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update order" }, { status: 500 });
  }
}
