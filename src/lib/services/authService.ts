import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import {
  hashPassword,
  verifyPassword,
  signUserToken,
  setUserCookie,
  clearUserCookie,
  getUserFromCookie,
} from "@/lib/auth/auth";
import { z } from "zod";

// ─── Register ─────────────────────────────────────────────────
const RegisterSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number"),
  phone: z.string().optional(),
});

export async function POST_register(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await User.create({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      phone: parsed.data.phone,
    });

    const token = signUserToken({
      id: user._id.toString(),
      email: user.email,
      role: "customer",
      name: `${user.firstName} ${user.lastName}`,
    });

    await setUserCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("[AUTH REGISTER]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── Login ────────────────────────────────────────────────────
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST_login(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signUserToken({
      id: user._id.toString(),
      email: user.email,
      role: "customer",
      name: `${user.firstName} ${user.lastName}`,
    });

    await setUserCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("[AUTH LOGIN]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── Logout ───────────────────────────────────────────────────
export async function POST_logout() {
  await clearUserCookie();
  return NextResponse.json({ success: true });
}

// ─── Me ───────────────────────────────────────────────────────
export async function GET_me() {
  const payload = await getUserFromCookie();
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(payload.id).select(
    "-passwordHash -__v"
  );
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
