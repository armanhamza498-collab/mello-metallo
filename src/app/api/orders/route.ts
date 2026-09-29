import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Coupon } from "@/lib/models/Coupon";
import { User } from "@/lib/models/User";
import { getUserFromCookie } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      subtotal,
      discount = 0,
      shippingCost = 0,
      total,
      paymentMethod = "cod",
      couponCode,
      customerEmail,
      customerName,
      customerPhone,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is logged in
    const authUser = await getUserFromCookie();
    let customerId = authUser?.id;

    if (!customerId) {
      const existingUser = await User.findOne({ email: customerEmail.toLowerCase() });
      if (existingUser) {
        customerId = existingUser._id;
      }
    }

    // Increment coupon usedCount if valid
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    // Generate unique order number
    const count = await Order.countDocuments();
    const year = new Date().getFullYear();
    const orderNumber = `MM-${year}-${String(count + 1).padStart(4, "0")}`;

    const newOrder = await Order.create({
      orderNumber,
      customer: customerId || undefined,
      customerEmail: customerEmail.toLowerCase(),
      customerName,
      customerPhone,
      items: items.map((i: any) => ({
        product: i.id || i.product,
        productName: i.name || i.productName,
        productSlug: i.slug || i.productSlug,
        sku: i.sku || `SKU-${Date.now().toString().slice(-4)}`,
        image: i.image,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.unitPrice * i.quantity,
        currency: "INR",
      })),
      shippingAddress: {
        firstName: shippingAddress?.firstName || customerName.split(" ")[0],
        lastName: shippingAddress?.lastName || customerName.split(" ").slice(1).join(" "),
        address1: shippingAddress?.address || shippingAddress?.address1,
        city: shippingAddress?.city,
        state: shippingAddress?.state,
        postalCode: shippingAddress?.zip || shippingAddress?.postalCode,
        country: "India",
        phone: customerPhone,
      },
      billingAddress: {
        firstName: shippingAddress?.firstName || customerName.split(" ")[0],
        lastName: shippingAddress?.lastName || customerName.split(" ").slice(1).join(" "),
        address1: shippingAddress?.address || shippingAddress?.address1,
        city: shippingAddress?.city,
        state: shippingAddress?.state,
        postalCode: shippingAddress?.zip || shippingAddress?.postalCode,
        country: "India",
        phone: customerPhone,
      },
      subtotal,
      discount,
      shippingCost,
      tax: 0,
      total,
      currency: "INR",
      couponCode: couponCode || undefined,
      couponDiscount: discount,
      isGift: false,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      paymentMethod,
      fulfillmentStatus: "pending",
      timeline: [
        {
          status: "Order Placed",
          note: `Order placed via online checkout (${paymentMethod.toUpperCase()})`,
          createdBy: "Customer",
          timestamp: new Date(),
        },
      ],
    });

    // If registered user, update order count and spend
    if (customerId) {
      await User.findByIdAndUpdate(customerId, {
        $inc: { totalOrders: 1, totalSpent: total },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder._id,
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        paymentStatus: newOrder.paymentStatus,
        fulfillmentStatus: newOrder.fulfillmentStatus,
      },
    });
  } catch (error: any) {
    console.error("[ORDER_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
