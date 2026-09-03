import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { StoreSetting } from "@/lib/models/Settings";

const DEFAULT_CURRENCIES = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 1.0, active: true },
  { code: "USD", name: "US Dollar", symbol: "$", rate: 0.012, active: true },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.011, active: true },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.0094, active: true },
  { code: "AED", name: "UAE Dirham", symbol: "AED", rate: 0.044, active: true },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 0.016, active: true },
];

export async function GET() {
  try {
    await connectDB();
    const setting = await StoreSetting.findOne({ key: "currencies" });
    let currencies = setting?.value ?? DEFAULT_CURRENCIES;

    // Fetch live rates from Frankfurter API
    try {
      const res = await fetch("https://api.frankfurter.dev/v1/latest?base=INR&symbols=USD,EUR,GBP,AED,SGD", {
        next: { revalidate: 3600 }, // cache for 1 hour
      });
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          currencies = (currencies as typeof DEFAULT_CURRENCIES).map((c) => {
            if (c.code === "INR") return c;
            const liveRate = data.rates[c.code];
            return liveRate ? { ...c, rate: parseFloat(liveRate.toFixed(6)), liveRate: true } : c;
          });
        }
      }
    } catch {
      // Silently fail — return stored rates
    }

    const baseCurrency = (await StoreSetting.findOne({ key: "baseCurrency" }))?.value ?? "INR";

    return NextResponse.json({ success: true, currencies, baseCurrency });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch currency settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    await Promise.all([
      StoreSetting.findOneAndUpdate(
        { key: "currencies" },
        { $set: { value: body.currencies } },
        { upsert: true, new: true }
      ),
      StoreSetting.findOneAndUpdate(
        { key: "baseCurrency" },
        { $set: { value: body.baseCurrency } },
        { upsert: true, new: true }
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save currency settings" }, { status: 500 });
  }
}
