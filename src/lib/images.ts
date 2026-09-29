// ─── MELLO METALLO — VERIFIED BRASS & COPPER ASSETS ──────────────

export const BRAND_IMAGES = {
  // Local High-Res Custom Generated Assets
  artisanWorkshop: "/images/artisan_workshop_1787586852558.png",
  brassCookware: "/images/brass_cookware_lifestyle_1787586785844.png",
  brassDrinkware: "/images/brass_drinkware_hero_1787586820724.png",
  brassHardware: "/images/brass_hardware_hero_1787586704402.png",
  brassHomeDecor: "/images/brass_home_decor_1787586833521.png",
  copperDrinkware: "/images/copper_drinkware_1787586869011.png",

  // Verified High-Res Unsplash Brass & Copper Photography
  heroBackground: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=85",
  brassKnobs: "/images/brass_hardware_hero_1787586704402.png",
  brassPulls: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80",
  brassKadhai: "/images/brass_cookware_lifestyle_1787586785844.png",
  copperVessels: "/images/copper_drinkware_1787586869011.png",
  brassTumblers: "/images/brass_drinkware_hero_1787586820724.png",
  brassDecor: "/images/brass_home_decor_1787586833521.png",
  giftBox: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
};

// Fallback image array strictly related to brass & copper
export const BRASS_IMAGE_POOL = [
  BRAND_IMAGES.brassCookware,
  BRAND_IMAGES.copperDrinkware,
  BRAND_IMAGES.brassDrinkware,
  BRAND_IMAGES.brassHardware,
  BRAND_IMAGES.brassHomeDecor,
  BRAND_IMAGES.artisanWorkshop,
];

export function getBrassImage(type?: string, index: number = 0): string {
  if (!type) return BRASS_IMAGE_POOL[index % BRASS_IMAGE_POOL.length];

  const lower = type.toLowerCase();
  if (lower.includes("copper")) return BRAND_IMAGES.copperDrinkware;
  if (lower.includes("hardware") || lower.includes("knob") || lower.includes("handle")) return BRAND_IMAGES.brassHardware;
  if (lower.includes("cookware") || lower.includes("kadhai")) return BRAND_IMAGES.brassCookware;
  if (lower.includes("drinkware") || lower.includes("tumbler") || lower.includes("bottle")) return BRAND_IMAGES.brassDrinkware;
  if (lower.includes("decor") || lower.includes("vase") || lower.includes("sculpture")) return BRAND_IMAGES.brassHomeDecor;
  if (lower.includes("artisan") || lower.includes("craft") || lower.includes("workshop")) return BRAND_IMAGES.artisanWorkshop;

  return BRASS_IMAGE_POOL[index % BRASS_IMAGE_POOL.length];
}
