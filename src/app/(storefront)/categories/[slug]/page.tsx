import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles, ChevronDown } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import ShopClient from "@/components/storefront/shop/ShopClient";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategoryWithSubs(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug, isActive: true }).lean();
    if (!category) return null;

    const subcategories = await Category.find({
      parent: category._id,
      isActive: true,
    })
      .sort({ displayOrder: 1 })
      .lean();

    return {
      category: {
        _id: String(category._id),
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        banner: category.banner,
      },
      subcategories: subcategories.map((s: any) => ({
        _id: String(s._id),
        name: s.name,
        slug: s.slug,
        description: s.description,
        image: s.image,
        displayOrder: s.displayOrder,
      })),
    };
  } catch (err) {
    console.error("[CATEGORY_FETCH_ERROR]", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryWithSubs(slug);
  if (data?.category) {
    return {
      title: `${data.category.name} Collection — Mello Metallo`,
      description:
        data.category.description ||
        `Handcrafted brass and copper ${data.category.name} objects designed for modern living.`,
    };
  }
  const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formatted} Collection — Mello Metallo`,
    description: `Shop handcrafted brass and copper ${formatted}.`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryWithSubs(slug);

  if (!data || !data.category) {
    return <ShopClient defaultCategory={slug} />;
  }

  const { category, subcategories } = data;
  const bannerImg =
    category.banner?.url ||
    category.image?.url ||
    "/images/brass_cookware_lifestyle_1787586785844.png";

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ── Category Hero Banner ─────────────────────────────── */}
      <section className="relative min-h-[440px] md:min-h-[500px] flex flex-col justify-between overflow-hidden bg-[#110F0D]">
        <img
          src={bannerImg}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-80"
        />
        {/* Layered dark luxury gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B09]/95 via-[#110F0D]/75 to-[#110F0D]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110F0D] via-[#110F0D]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 container-site pt-32 pb-12 flex-1 flex flex-col justify-center">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs font-sans text-[#C4AB8A]/80">
            <Link href="/" className="hover:text-[#F8F5EF] transition-colors">
              Home
            </Link>
            <ChevronRight size={11} className="text-[#8B7355]" />
            <Link href="/shop" className="hover:text-[#F8F5EF] transition-colors">
              Shop
            </Link>
            <ChevronRight size={11} className="text-[#8B7355]" />
            <span className="text-[#F8F5EF] font-medium">{category.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-[#C4AB8A]" />
            <Sparkles size={11} className="text-[#C4AB8A]" />
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C4AB8A]">
              Artisan Collection
            </span>
          </div>

          <h1
            className="font-serif font-light text-[#F8F5EF] leading-tight mb-4 tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            {category.name}
          </h1>

          {category.description && (
            <p className="font-sans text-[#D4CFC5] text-sm md:text-base leading-relaxed max-w-2xl mb-8">
              {category.description}
            </p>
          )}

          {subcategories.length > 0 && (
            <div className="flex items-center gap-3">
              <a
                href="#subcategories-grid"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B7355] hover:bg-[#6B5640] text-[#F8F5EF] font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-300"
              >
                Browse Subcategories
                <ChevronDown size={14} />
              </a>
              <a
                href="#category-products"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#C4AB8A]/40 text-[#F8F5EF] hover:border-[#C4AB8A] hover:bg-white/5 font-sans text-xs tracking-wider uppercase font-medium transition-all duration-300"
              >
                View All Products
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Subcategories Grid Section ──────────────────────── */}
      {subcategories.length > 0 && (
        <section
          id="subcategories-grid"
          className="container-site py-16 scroll-mt-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E8E2D8]">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8B7355] font-semibold mb-1">
                Explore Categories
              </p>
              <h2 className="font-serif text-3xl text-[#1A1612]">
                {category.name} Subcategories
              </h2>
            </div>
            <p className="font-sans text-xs text-[#7A756E]">
              Select a subcategory to view detailed images, stories &amp; products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subcategories.map((sub, idx) => {
              const subImg =
                sub.image?.url ||
                category.image?.url ||
                "/images/brass_cookware_lifestyle_1787586785844.png";

              return (
                <Link
                  key={sub._id}
                  href={`/categories/${slug}/${sub.slug}`}
                  className="group flex flex-col bg-white border border-[#E8E2D8] hover:border-[#8B7355] rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Subcategory Image Container */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-[#1A1612]">
                    <img
                      src={subImg}
                      alt={sub.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#110F0D]/80 backdrop-blur-sm text-[#C4AB8A] font-mono text-[10px] tracking-wider uppercase border border-[#C4AB8A]/30 rounded">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Subcategory Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif text-xl text-[#1A1612] group-hover:text-[#8B7355] transition-colors mb-2">
                      {sub.name}
                    </h3>
                    <p className="font-sans text-xs text-[#7A756E] leading-relaxed line-clamp-2 mb-4 flex-1">
                      {sub.description ||
                        `Handcrafted ${sub.name.toLowerCase()} designed slowly with living artisan traditions.`}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE3] text-[11px] font-sans font-semibold tracking-wider uppercase text-[#8B7355] group-hover:text-[#6B5640]">
                      <span>View Products</span>
                      <ArrowRight
                        size={13}
                        className="transform group-hover:translate-x-1.5 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Category Products Section ───────────────────────── */}
      <section
        id="category-products"
        className="container-site py-12 border-t border-[#E8E2D8]"
      >
        <div className="mb-8">
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8B7355] font-semibold mb-1">
            All Products
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[#1A1612]">
            Browse All {category.name}
          </h2>
        </div>
        <ShopClient defaultCategory={slug} />
      </section>
    </div>
  );
}
