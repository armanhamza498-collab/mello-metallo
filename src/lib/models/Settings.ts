import { Schema, model, models, Document } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FAQSchema.index({ displayOrder: 1 });

export const FAQ = models.FAQ || model<IFAQ>("FAQ", FAQSchema);

// ─── Store Settings Model ─────────────────────────────────────
export interface IStoreSetting extends Document {
  key: string;
  value: unknown;
  updatedAt: Date;
}

const StoreSettingSchema = new Schema<IStoreSetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const StoreSetting =
  models.StoreSetting || model<IStoreSetting>("StoreSetting", StoreSettingSchema);
