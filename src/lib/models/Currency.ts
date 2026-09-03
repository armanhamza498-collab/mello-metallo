import { Schema, model, models, Document } from "mongoose";

export interface ICurrency extends Document {
  code: string;       // ISO 4217: INR, USD, EUR, GBP, SGD, AED
  symbol: string;     // ₹, $, €, £, S$, د.إ
  name: string;       // Indian Rupee, US Dollar, etc.
  rate: number;       // Exchange rate relative to base currency (INR)
  decimalPlaces: number;
  isEnabled: boolean;
  isDefault: boolean;
  position: "before" | "after"; // symbol position
  spaceBetween: boolean;
  updatedAt: Date;
}

const CurrencySchema = new Schema<ICurrency>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    decimalPlaces: { type: Number, default: 2 },
    isEnabled: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    position: { type: String, enum: ["before", "after"], default: "before" },
    spaceBetween: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CurrencySchema.index({ code: 1 });
CurrencySchema.index({ isDefault: 1 });

export const Currency =
  models.Currency || model<ICurrency>("Currency", CurrencySchema);
