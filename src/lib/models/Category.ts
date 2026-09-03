import { Schema, model, models, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: ICategory["_id"];
  image?: { url: string; publicId?: string; alt?: string };
  banner?: { url: string; publicId?: string; alt?: string };
  seo: { title?: string; description?: string; ogImage?: string };
  displayOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: {
      url: String,
      publicId: String,
      alt: String,
    },
    banner: {
      url: String,
      publicId: String,
      alt: String,
    },
    seo: {
      title: String,
      description: String,
      ogImage: String,
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// slug index is automatically created via unique: true above
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1 });

export const Category =
  models.Category || model<ICategory>("Category", CategorySchema);
