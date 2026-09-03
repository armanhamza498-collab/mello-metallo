import { NextRequest, NextResponse } from "next/server";

// Placeholder newsletter endpoint — integrate with Resend, Mailchimp, etc.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    // TODO: Add to email provider
    console.log("[NEWSLETTER] New subscriber:", email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
