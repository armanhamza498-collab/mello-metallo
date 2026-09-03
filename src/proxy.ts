import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, verifyAdminToken } from "@/lib/auth/auth";

// Public paths (no auth required)
const PUBLIC_PATHS = [
  "/",
  "/shop",
  "/products",
  "/collections",
  "/categories",
  "/journal",
  "/care",
  "/about",
  "/contact",
  "/search",
  "/api/auth",
  "/api/products",
  "/api/categories",
  "/api/collections",
  "/api/currency",
  "/api/search",
  "/api/newsletter",
  "/api/reviews",
  "/api/seed",
  "/admin/login",
];

// Admin sub-paths that require specific roles
const STAFF_ONLY_PATHS = ["/admin/orders", "/admin/inventory"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = req.cookies.get("laiton_admin_token")?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const payload = verifyAdminToken(adminToken);
    if (!payload) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete("laiton_admin_token");
      return res;
    }

    // Attach user info to request headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-admin-id", payload.id);
    requestHeaders.set("x-admin-email", payload.email);
    requestHeaders.set("x-admin-role", payload.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ── Protected customer routes ─────────────────────────────
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    const userToken = req.cookies.get("laiton_user_token")?.value;

    if (!userToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = verifyUserToken(userToken);
    if (!payload) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("laiton_user_token");
      return res;
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ── Protected API routes ──────────────────────────────────
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/auth") {
    const adminToken = req.cookies.get("laiton_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyAdminToken(adminToken);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-admin-id", payload.id);
    requestHeaders.set("x-admin-email", payload.email);
    requestHeaders.set("x-admin-role", payload.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith("/api/user")) {
    const userToken = req.cookies.get("laiton_user_token")?.value;
    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyUserToken(userToken);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// Next.js proxy export
export default proxy;
export { proxy as middleware };

