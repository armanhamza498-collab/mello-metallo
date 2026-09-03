import mongoose, { Schema, model, models, Document, Types } from "mongoose";

// ─── Embedded Schemas ────────────────────────────────────────

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, default: "" },
    width: Number,
    height: Number,
  },
  { _id: false }
);

const DimensionSchema = new Schema(
  {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: "cm" },
  },
  { _id: false }
);

const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const VariantSchema = new Schema(
  {
    sku: { type: String, required: true },
    finish: String,
    size: String,
    pack: String,
    color: String,
    price: { type: Number, required: true },
    compareAtPrice: Number,
    costPrice: Number,
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    weight: Number,
    dimensions: DimensionSchema,
    images: [ImageSchema],
    barcode: String,
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SEOSchema = new Schema(
  {
    title: String,
    description: String,
    ogImage: String,
    canonicalUrl: String,
  },
  { _id: false }
);

// ─── Product Schema ───────────────────────────────────────────

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  material: "brass" | "copper" | "mixed";
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  collections: Types.ObjectId[];
  tags: string[];
  finishes: string[];
  variants: typeof VariantSchema[];
  images: typeof ImageSchema[];
  videoUrl?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  taxClass: string;
  stock: number;
  lowStockThreshold: number;
  allowBackorders: boolean;
  trackInventory: boolean;
  specifications: typeof SpecificationSchema[];
  dimensions?: typeof DimensionSchema;
  weight?: number;
  weightUnit: string;
  countryOfOrigin: string;
  craftsmanship?: string;
  careInstructions?: string;
  whatsIncluded?: string;
  warranty?: string;
  shippingInfo?: string;
  productStory?: string;
  seo: typeof SEOSchema;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  status: "draft" | "published" | "archived";
  relatedProducts: Types.ObjectId[];
  adminSelectedRelated: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    material: {
      type: String,
      enum: ["brass", "copper", "mixed"],
      required: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    tags: [String],
    finishes: [String],
    variants: [VariantSchema],
    images: [ImageSchema],
    videoUrl: String,
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    taxClass: { type: String, default: "standard" },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    allowBackorders: { type: Boolean, default: false },
    trackInventory: { type: Boolean, default: true },
    specifications: [SpecificationSchema],
    dimensions: DimensionSchema,
    weight: Number,
    weightUnit: { type: String, default: "g" },
    countryOfOrigin: { type: String, default: "India" },
    craftsmanship: String,
    careInstructions: String,
    whatsIncluded: String,
    warranty: String,
    shippingInfo: String,
    productStory: String,
    seo: SEOSchema,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    adminSelectedRelated: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// Indexes (slug & sku unique indexes are automatically created above)
ProductSchema.index({ category: 1 });
ProductSchema.index({ collections: 1 });
ProductSchema.index({ material: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ featured: 1, status: 1 });
ProductSchema.index({ bestseller: 1, status: 1 });
ProductSchema.index({ newArrival: 1, status: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });

export const Product =
  models.Product || model<IProduct>("Product", ProductSchema);
