import { Schema, model, models, Document, Types } from "mongoose";

const ReviewImageSchema = new Schema(
  { url: String, publicId: String },
  { _id: false }
);

export interface IReview extends Document {
  product: Types.ObjectId;
  user?: Types.ObjectId;
  authorName: string;
  authorEmail: string;
  rating: number;
  title?: string;
  body: string;
  images: (typeof ReviewImageSchema)[];
  verifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  adminReply?: string;
  orderId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    body: { type: String, required: true },
    images: [ReviewImageSchema],
    verifiedPurchase: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    featured: { type: Boolean, default: false },
    adminReply: String,
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, status: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ rating: 1 });

export const Review = models.Review || model<IReview>("Review", ReviewSchema);
