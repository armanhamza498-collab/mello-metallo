import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Currency } from "@/lib/models/Currency";

export async function GET() {
  try {
    await connectDB();
    const currencies = await Currency.find({ isEnabled: true }).lean();

    // Seed default currencies if none exist
    if (currencies.length === 0) {
      const defaults = [
        { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 1, decimalPlaces: 0, isDefault: true, position: "before", spaceBetween: false },
        { code: "USD", symbol: "$", name: "US Dollar", rate: 0.012, decimalPlaces: 2, position: "before", spaceBetween: false },
        { code: "EUR", symbol: "€", name: "Euro", rate: 0.011, decimalPlaces: 2, position: "before", spaceBetween: false },
        { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0094, decimalPlaces: 2, position: "before", spaceBetween: false },
        { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 0.016, decimalPlaces: 2, position: "before", spaceBetween: false },
        { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 0.044, decimalPlaces: 2, position: "after", spaceBetween: true },
      ];
      await Currency.insertMany(defaults);
      return NextResponse.json({ currencies: defaults });
    }

    return NextResponse.json({ currencies });
  } catch (err) {
    console.error("[CURRENCY GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
