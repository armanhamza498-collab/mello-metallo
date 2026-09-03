import { Schema, model, models, Document } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; publicId?: string; alt?: string };
  banner?: { url: string; publicId?: string; alt?: string };
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: { url: String, publicId: String, alt: String },
    banner: { url: String, publicId: String, alt: String },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Collection =
  models.Collection || model<ICollection>("Collection", CollectionSchema);
