import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";
import { getUserFromCookie } from "@/lib/auth/auth";

// GET /api/auth/orders  — customer's own orders
export async function GET() {
  const payload = await getUserFromCookie();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const orders = await Order.find({ customer: payload.id })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[ORDERS GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/auth/orders — update user profile
export async function PATCH(req: NextRequest) {
  const payload = await getUserFromCookie();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const allowedFields: Record<string, unknown> = {};
    if (body.firstName) allowedFields.firstName = body.firstName;
    if (body.lastName) allowedFields.lastName = body.lastName;
    if (body.phone !== undefined) allowedFields.phone = body.phone;

    const user = await User.findByIdAndUpdate(
      payload.id,
      { $set: allowedFields },
      { new: true }
    ).select("-passwordHash -__v");

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[PROFILE PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/auth/orders — add an address
export async function POST(req: NextRequest) {
  const payload = await getUserFromCookie();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (body.action === "add_address") {
      user.addresses.push(body.address);
      await user.save();
      return NextResponse.json({ addresses: user.addresses });
    }

    if (body.action === "remove_address") {
      user.addresses = user.addresses.filter(
        (a: { _id?: unknown }) => String(a._id) !== body.addressId
      );
      await user.save();
      return NextResponse.json({ addresses: user.addresses });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[ADDRESS POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
