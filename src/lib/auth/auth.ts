import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "laitonco_user_default_secret_key_2026";
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || "laitonco_admin_default_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_ADMIN_EXPIRES_IN = process.env.JWT_ADMIN_EXPIRES_IN || "1d";

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

// ─── Hashing ──────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Customer Token ───────────────────────────────────────────
export function signUserToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyUserToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Admin Token ──────────────────────────────────────────────
export function signAdminToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_ADMIN_SECRET, {
    expiresIn: JWT_ADMIN_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAdminToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_ADMIN_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Cookie Helpers ───────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setUserCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("laiton_user_token", token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("laiton_admin_token", token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("laiton_user_token");
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("laiton_admin_token");
}

export async function getUserFromCookie(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("laiton_user_token")?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function getAdminFromCookie(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("laiton_admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// ─── Password Validation ──────────────────────────────────────
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8)
    return { valid: false, message: "Password must be at least 8 characters" };
  if (!/[A-Z]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  if (!/[0-9]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  return { valid: true };
}
