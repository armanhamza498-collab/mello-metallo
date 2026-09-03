import { NextRequest, NextResponse } from "next/server";
import { POST_register, POST_login, POST_logout, GET_me } from "@/lib/services/authService";

export async function GET() {
  return GET_me();
}

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  if (action === "register") return POST_register(req);
  if (action === "login") return POST_login(req);
  if (action === "logout") return POST_logout();

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
