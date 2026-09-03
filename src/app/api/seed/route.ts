import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";
import { connectDB } from "@/lib/db/connect";
import { AdminUser } from "@/lib/models/AdminUser";
import { hashPassword } from "@/lib/auth/auth";

export async function GET() {
  try {
    await connectDB();

    // 1. Seed database items (Categories & Products)
    await seedDatabase();

    // 2. Ensure Superadmin User exists in MongoDB
    let superadmin = await AdminUser.findOne({ email: "admin@laitonco.com" });
    if (!superadmin) {
      const hash = await hashPassword("Admin@123456");
      superadmin = await AdminUser.create({
        name: "Super Admin",
        email: "admin@laitonco.com",
        passwordHash: hash,
        role: "superadmin",
        permissions: ["*"],
        isActive: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "MongoDB database seeded successfully!",
      admin: {
        email: superadmin.email,
        role: superadmin.role,
      },
    });
  } catch (error: any) {
    console.error("[SEED API ERROR]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Seeding failed" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
