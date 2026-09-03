import { Schema, model, models, Document, Types } from "mongoose";

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: Schema.Types.ObjectId,
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: Number,
    name: String,
    sku: String,
    image: String,
    variantName: String,
  },
  { _id: true }
);

export interface ICart extends Document {
  user?: Types.ObjectId;
  sessionId?: string;
  items: (typeof CartItemSchema)[];
  couponCode?: string;
  currency: string;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: String,
    items: [CartItemSchema],
    couponCode: String,
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

CartSchema.index({ user: 1 });
CartSchema.index({ sessionId: 1 });

export const Cart = models.Cart || model<ICart>("Cart", CartSchema);
