import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles, ChevronDown, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import SubcategoryProductGridClient from "@/components/storefront/product/SubcategoryProductGridClient";

interface Props {
  params: Promise<{ slug: string; subcategorySlug: string }>;
}

async function getSubcategoryData(categorySlug: string, subcategorySlug: string) {
  try {
    await connectDB();
    const parentCategory = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
    if (!parentCategory) return null;

    const subcategory = await Category.findOne({
      slug: subcategorySlug,
      parent: parentCategory._id,
      isActive: true,
    }).lean();

    if (!subcategory) return null;

    // Fetch products belonging to this subcategory
    const products = await Product.find({
      status: "published",
      subcategory: subcategory._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      parentCategory: {
        _id: String(parentCategory._id),
        name: parentCategory.name,
        slug: parentCategory.slug,
      },
      subcategory: {
        _id: String(subcategory._id),
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description,
        image: subcategory.image,
        banner: subcategory.banner,
      },
      products: products.map((p: any) => ({
        _id: String(p._id),
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        material: p.material,
        images: p.images || [],
        rating: p.rating || 5,
        reviewCount: p.reviewCount || 0,
        stock: p.stock ?? 10,
        featured: p.featured ?? false,
        bestseller: p.bestseller ?? false,
        newArrival: p.newArrival ?? false,
      })),
    };
  } catch (err) {
    console.error("[SUBCATEGORY_FETCH_ERROR]", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subcategorySlug } = await params;
  const data = await getSubcategoryData(slug, subcategorySlug);

  if (data?.subcategory) {
    return {
      title: `${data.subcategory.name} — Handcrafted ${data.parentCategory.name} | Mello Metallo`,
      description:
        data.subcategory.description ||
        `Discover handcrafted ${data.subcategory.name.toLowerCase()} in solid brass and copper.`,
    };
  }

  const formatted = subcategorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formatted} — Mello Metallo`,
  };
}

export default async function SubcategoryPage({ params }: Props) {
  const { slug, subcategorySlug } = await params;
  const data = await getSubcategoryData(slug, subcategorySlug);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-3xl text-[#1A1612] mb-3">Subcategory Not Found</h1>
          <p className="font-sans text-sm text-[#7A756E] mb-6">
            The subcategory you are looking for may have moved or been updated.
          </p>
          <Link
            href={`/categories/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B7355] text-white text-xs uppercase tracking-wider font-semibold"
          >
            Back to Category <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const { parentCategory, subcategory, products } = data;
  const heroImage =
    subcategory.banner?.url ||
    subcategory.image?.url ||
    "/images/brass_cookware_lifestyle_1787586785844.png";

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ── Subcategory Hero Banner (Image & Rich Description) ── */}
      <section className="relative min-h-[500px] md:min-h-[560px] flex flex-col justify-between overflow-hidden bg-[#110F0D]">
        <img
          src={heroImage}
          alt={subcategory.name}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Cinematic dark luxury overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B09]/95 via-[#110F0D]/80 to-[#110F0D]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110F0D] via-[#110F0D]/40 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 container-site pt-32 pb-16 flex-1 flex flex-col justify-center">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 mb-6 text-xs font-sans text-[#C4AB8A]/80 flex-wrap">
            <Link href="/" className="hover:text-[#F8F5EF] transition-colors">
              Home
            </Link>
            <ChevronRight size={11} className="text-[#8B7355]" />
            <Link href="/shop" className="hover:text-[#F8F5EF] transition-colors">
              Shop
            </Link>
            <ChevronRight size={11} className="text-[#8B7355]" />
            <Link
              href={`/categories/${parentCategory.slug}`}
              className="hover:text-[#F8F5EF] transition-colors"
            >
              {parentCategory.name}
            </Link>
            <ChevronRight size={11} className="text-[#8B7355]" />
            <span className="text-[#F8F5EF] font-medium">{subcategory.name}</span>
          </nav>

          {/* Subcategory Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-[#C4AB8A]" />
            <Sparkles size={12} className="text-[#C4AB8A]" />
            <span className="font-sans text-[11px] tracking-[0.25em] uppercase font-semibold text-[#C4AB8A]">
              {parentCategory.name} • Master Craft
            </span>
          </div>

          {/* Subcategory Headline */}
          <h1
            className="font-serif font-light text-[#F8F5EF] leading-[1.1] mb-5 tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)" }}
          >
            {subcategory.name}
          </h1>

          {/* Subcategory Rich Description */}
          {subcategory.description && (
            <p className="font-sans text-[#D4CFC5] text-base md:text-[1.1rem] leading-[1.8] max-w-2xl mb-10">
              {subcategory.description}
            </p>
          )}

          {/* Scroll Down to Products Button */}
          <div className="flex items-center gap-4">
            <a
              href="#products-section"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#8B7355] hover:bg-[#6B5640] text-[#F8F5EF] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <span>Explore Products ({products.length})</span>
              <ChevronDown
                size={15}
                className="group-hover:translate-y-1 transition-transform"
              />
            </a>

            <Link
              href={`/categories/${parentCategory.slug}`}
              className="inline-flex items-center gap-2 text-[#D4CFC5] hover:text-[#F8F5EF] font-sans text-xs tracking-wider uppercase transition-colors px-4 py-3"
            >
              <span>All {parentCategory.name}</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Scroll Cue Animation at bottom */}
        <div className="relative z-10 container-site pb-6 flex items-center justify-between border-t border-[#F8F5EF]/10 text-xs font-sans text-[#A8A196]">
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#C4AB8A]" />
            100% Handcrafted Brass &amp; Copper with Lifetime Warranty
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#C4AB8A]">
            Scroll down to view products ↓
          </span>
        </div>
      </section>

      {/* ── Products Section (Shown after scroll) ──────────────── */}
      <section
        id="products-section"
        className="container-site py-16 scroll-mt-12"
      >
        <SubcategoryProductGridClient
          products={products}
          subcategoryName={subcategory.name}
          parentCategoryName={parentCategory.name}
          parentCategorySlug={parentCategory.slug}
        />
      </section>
    </div>
  );
}
