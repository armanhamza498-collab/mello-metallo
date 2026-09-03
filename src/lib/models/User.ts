import { Schema, model, models, Document, Types } from "mongoose";

// ─── Address Schema ───────────────────────────────────────────
const AddressSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    company: String,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: String,
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "customer";
  addresses: (typeof AddressSchema)[];
  wishlist: Types.ObjectId[];
  defaultCurrency: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    phone: String,
    role: { type: String, default: "customer" },
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    defaultCurrency: { type: String, default: "INR" },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

export const User = models.User || model<IUser>("User", UserSchema);
