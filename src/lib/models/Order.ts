import { Schema, model, models, Document, Types } from "mongoose";

// ─── Order Item ───────────────────────────────────────────────
const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    productSlug: String,
    variantId: Schema.Types.ObjectId,
    variantName: String,
    sku: { type: String, required: true },
    image: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

// ─── Timeline Event ───────────────────────────────────────────
const TimelineEventSchema = new Schema(
  {
    status: String,
    note: String,
    createdBy: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ─── Address (embedded) ───────────────────────────────────────
const ShippingAddressSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    company: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { _id: false }
);

export interface IOrder extends Document {
  orderNumber: string;
  customer?: Types.ObjectId;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: (typeof OrderItemSchema)[];
  shippingAddress: typeof ShippingAddressSchema;
  billingAddress: typeof ShippingAddressSchema;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  couponCode?: string;
  couponDiscount?: number;
  giftMessage?: string;
  giftRecipient?: string;
  isGift: boolean;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  paymentMethod?: string;
  paymentReference?: string;
  fulfillmentStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  shippingMethod?: string;
  trackingNumber?: string;
  courier?: string;
  timeline: (typeof TimelineEventSchema)[];
  internalNotes?: string;
  customerNotes?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: String,
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    billingAddress: ShippingAddressSchema,
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    giftMessage: String,
    giftRecipient: String,
    isGift: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    paymentMethod: String,
    paymentReference: String,
    fulfillmentStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    shippingMethod: String,
    trackingNumber: String,
    courier: String,
    timeline: [TimelineEventSchema],
    internalNotes: String,
    customerNotes: String,
    invoiceUrl: String,
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customer: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ fulfillmentStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
