import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type AdminRole = "superadmin" | "admin" | "staff";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Default permissions per role
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  superadmin: ["*"],
  admin: [
    "products:*",
    "categories:*",
    "collections:*",
    "orders:*",
    "customers:read",
    "reviews:*",
    "coupons:*",
    "inventory:*",
    "content:*",
    "settings:read",
    "analytics:read",
  ],
  staff: [
    "products:read",
    "products:update",
    "orders:read",
    "orders:update",
    "inventory:read",
    "inventory:update",
  ],
};

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "staff"],
      required: true,
    },
    permissions: [String],
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    avatar: String,
  },
  { timestamps: true }
);

// Email index is automatically created via unique: true above

export const AdminUser =
  models.AdminUser || model<IAdminUser>("AdminUser", AdminUserSchema);
