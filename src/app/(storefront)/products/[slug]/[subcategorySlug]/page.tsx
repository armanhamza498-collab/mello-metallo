import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string; subcategorySlug: string }>;
}

export default async function SubcategoryPageRedirect({ params }: Props) {
  const { slug, subcategorySlug } = await params;
  redirect(`/categories/${slug}/${subcategorySlug}`);
}
