import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Total & Filtered Orders Aggregation
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      pendingOrders,
      recentOrders,
      statusCounts,
      revenueAggregation,
      dailyRevenueData,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({
        $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      }),
      Order.countDocuments({ fulfillmentStatus: "pending" }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber customerName total fulfillmentStatus createdAt")
        .lean(),
      Order.aggregate([
        { $group: { _id: "$fulfillmentStatus", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { fulfillmentStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      ]),
      // Daily revenue for past 7 days
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
            fulfillmentStatus: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Convert status counts array to map
    const ordersByStatus = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    statusCounts.forEach((item: { _id: string; count: number }) => {
      const key = item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Pending";
      if (key in ordersByStatus) {
        (ordersByStatus as Record<string, number>)[key] = item.count;
      }
    });

    // Top products by rating/stock or sales
    const topProducts = await Product.find({ status: "published" })
      .sort({ rating: -1, reviewCount: -1, stock: -1 })
      .limit(5)
      .select("name price stock rating reviewCount sku")
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockProducts,
        avgOrderValue,
        pendingOrders,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.orderNumber,
        customer: o.customerName,
        total: `₹${o.total.toLocaleString("en-IN")}`,
        status: o.fulfillmentStatus,
        date: new Date(o.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      ordersByStatus: Object.entries(ordersByStatus).map(([status, count]) => ({
        status,
        count,
      })),
      revenueData: dailyRevenueData.map((d) => ({
        day: d._id,
        revenue: d.revenue,
        orders: d.orders,
      })),
      topProducts: topProducts.map((p) => ({
        name: p.name,
        orders: p.reviewCount || 0,
        revenue: `₹${p.price.toLocaleString("en-IN")}`,
        rating: p.rating || 5,
        sku: p.sku,
      })),
    });
  } catch (error: any) {
    console.error("[DASHBOARD API ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
