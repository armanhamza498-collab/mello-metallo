import { Schema, model, models, Document } from "mongoose";

// ─── Banner Model ─────────────────────────────────────────────
export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  desktopImage: { url: string; publicId?: string };
  mobileImage?: { url: string; publicId?: string };
  ctaText?: string;
  ctaUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  displayOrder: number;
  placement: "hero" | "promotional" | "category" | "collection";
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: String,
    desktopImage: {
      url: { type: String, required: true },
      publicId: String,
    },
    mobileImage: { url: String, publicId: String },
    ctaText: String,
    ctaUrl: String,
    ctaSecondaryText: String,
    ctaSecondaryUrl: String,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    placement: {
      type: String,
      enum: ["hero", "promotional", "category", "collection"],
      default: "hero",
    },
  },
  { timestamps: true }
);

export const Banner = models.Banner || model<IBanner>("Banner", BannerSchema);

// ─── Homepage Section Model ───────────────────────────────────
export interface IHomepageSection extends Document {
  type: string;   // hero, categories, featured-collection, bestsellers, etc.
  title?: string;
  isEnabled: boolean;
  displayOrder: number;
  content: Record<string, unknown>; // flexible JSON content per section type
  updatedAt: Date;
}

const HomepageSectionSchema = new Schema<IHomepageSection>(
  {
    type: { type: String, required: true, unique: true },
    title: String,
    isEnabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const HomepageSection =
  models.HomepageSection ||
  model<IHomepageSection>("HomepageSection", HomepageSectionSchema);

// ─── Blog Post Model ──────────────────────────────────────────
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: { url: string; publicId?: string; alt?: string };
  author: string;
  category: string;
  tags: string[];
  seo: { title?: string; description?: string; ogImage?: string };
  publishDate?: Date;
  status: "draft" | "published";
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: String,
    content: { type: String, default: "" },
    coverImage: { url: String, publicId: String, alt: String },
    author: { type: String, default: "Mello Metallo" },
    category: { type: String, default: "Journal" },
    tags: [String],
    seo: { title: String, description: String, ogImage: String },
    publishDate: Date,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1, publishDate: -1 });

export const BlogPost =
  models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);

// ─── Audit Log Model ──────────────────────────────────────────
export interface IAuditLog extends Document {
  adminUser: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminUser: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: String,
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ adminEmail: 1 });
AuditLogSchema.index({ resource: 1 });

export const AuditLog =
  models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);

// ─── Inventory Transaction Model ─────────────────────────────
export interface IInventoryTransaction extends Document {
  product: Schema.Types.ObjectId;
  variantId?: Schema.Types.ObjectId;
  sku: string;
  type: "restock" | "deduction" | "adjustment" | "return";
  quantity: number;
  previousStock: number;
  newStock: number;
  note?: string;
  orderId?: Schema.Types.ObjectId;
  adminUser?: string;
  createdAt: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: Schema.Types.ObjectId,
    sku: { type: String, required: true },
    type: {
      type: String,
      enum: ["restock", "deduction", "adjustment", "return"],
      required: true,
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    note: String,
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    adminUser: String,
  },
  { timestamps: true }
);

InventoryTransactionSchema.index({ product: 1, createdAt: -1 });
InventoryTransactionSchema.index({ sku: 1 });

export const InventoryTransaction =
  models.InventoryTransaction ||
  model<IInventoryTransaction>(
    "InventoryTransaction",
    InventoryTransactionSchema
  );
