import type { Metadata } from "next";
import HeroSection from "@/components/storefront/home/HeroSection";
import MaterialIntro from "@/components/storefront/home/MaterialIntro";
import CategoryGrid from "@/components/storefront/home/CategoryGrid";
import FeaturedCollection from "@/components/storefront/home/FeaturedCollection";
import BestsellersCarousel from "@/components/storefront/home/BestsellersCarousel";
import ArtisanStory from "@/components/storefront/home/ArtisanStory";
import WhyBrass from "@/components/storefront/home/WhyBrass";
import LifestyleLookbook from "@/components/storefront/home/LifestyleLookbook";
import GiftingSection from "@/components/storefront/home/GiftingSection";
import TrustSection from "@/components/storefront/home/TrustSection";
import ReviewsSection from "@/components/storefront/home/ReviewsSection";
import NewsletterSection from "@/components/storefront/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Mello Metallo — Brass & Copper Objects for the Modern Home",
  description:
    "Handcrafted brass and copper homeware designed for modern living. Discover drawer knobs, cookware, drinkware, home decor and gift sets.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MaterialIntro />
      <CategoryGrid />
      <FeaturedCollection />
      <BestsellersCarousel />
      <ArtisanStory />
      <WhyBrass />
      <LifestyleLookbook />
      <GiftingSection />
      <TrustSection />
      <ReviewsSection />
      <NewsletterSection />
    </>
  );
}
