import { connectDB } from "./connect";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Collection } from "../models/Collection";
import { User } from "../models/User";
import { Order } from "../models/Order";
import { Coupon } from "../models/Coupon";
import { Review } from "../models/Review";
import { Banner, BlogPost, HomepageSection } from "../models/Content";
import { FAQ, StoreSetting } from "../models/Settings";
import bcrypt from "bcryptjs";

// ─── COLLECTIONS ──────────────────────────────────────────────

const COLLECTIONS = [
  { name: "New Arrivals", slug: "new-arrivals", description: "The latest additions to our artisan brass and copper collection.", featured: true, image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", alt: "New Arrivals" } },
  { name: "Bestsellers", slug: "bestsellers", description: "Our most-loved brass and copper pieces, chosen by our customers.", featured: true, image: { url: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80", alt: "Bestsellers" } },
  { name: "Heritage Collection", slug: "heritage-collection", description: "Timeless designs inspired by ancient Indian craftsmanship traditions.", featured: true, image: { url: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=800&q=80", alt: "Heritage Collection" } },
  { name: "Modern Luxe", slug: "modern-luxe", description: "Contemporary brass objects designed for the modern minimalist home.", featured: false, image: { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", alt: "Modern Luxe" } },
  { name: "Wellness Edit", slug: "wellness-edit", description: "Copper and brass pieces that support your daily wellness rituals.", featured: true, image: { url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80", alt: "Wellness Edit" } },
  { name: "Gifting Hampers", slug: "gifting-hampers", description: "Beautifully curated brass gift sets for every occasion.", featured: false, image: { url: "https://images.unsplash.com/photo-1513201099705-a9746072f825?w=800&q=80", alt: "Gifting Hampers" } },
];

// ─── PARENT CATEGORIES ────────────────────────────────────────

const PARENT_CATEGORIES = [
  { name: "Drinkware", slug: "drinkware", description: "Ayurvedic pure copper and solid brass water vessels, hammered tumblers, jugs, and royal water dispensers crafted for daily wellness and living tradition.", displayOrder: 1, image: { url: "/images/brass_drinkware_hero_1787586820724.png", alt: "Brass and Copper Drinkware" }, banner: { url: "/images/brass_drinkware_hero_1787586820724.png", alt: "Drinkware Banner" } },
  { name: "Cookware", slug: "cookware", description: "Hand-hammered brass kadhais, tin-lined patilas, heavy copper saucepans, and forged tawas engineered for exceptional heat retention and timeless Indian gastronomy.", displayOrder: 2, image: { url: "/images/brass_cookware_lifestyle_1787586785844.png", alt: "Brass and Copper Cookware" }, banner: { url: "/images/brass_cookware_lifestyle_1787586785844.png", alt: "Cookware Banner" } },
  { name: "Hardware", slug: "hardware", description: "Architectural solid unlacquered brass cabinet pulls, knurled knobs, statement door knockers, and coat hooks that transform cabinetry into fine art.", displayOrder: 3, image: { url: "/images/brass_hardware_hero_1787586704402.png", alt: "Solid Brass Hardware" }, banner: { url: "/images/brass_hardware_hero_1787586704402.png", alt: "Hardware Banner" } },
  { name: "Home Decor", slug: "home-decor", description: "Hammered brass floor urlis, engraved pillar candleholders, sculptural vases, and decorative trays that infuse warm golden warmth into modern interiors.", displayOrder: 4, image: { url: "/images/brass_home_decor_1787586833521.png", alt: "Brass Home Decor" }, banner: { url: "/images/brass_home_decor_1787586833521.png", alt: "Home Decor Banner" } },
  { name: "Serveware", slug: "serveware", description: "Traditional royal brass dinner thali sets, hammered serving bowls, and handcrafted platters designed for celebratory feasts and festive hospitality.", displayOrder: 5, image: { url: "/images/products/brass_thali_set_1790597290494.jpg", alt: "Brass Serveware" }, banner: { url: "/images/products/brass_thali_set_1790597290494.jpg", alt: "Serveware Banner" } },
  { name: "Gifting", slug: "gifting", description: "Heirloom gift hampers featuring pure copper drinkware, brass puja essentials, and bespoke wedding sets packaged in opulent satin-lined keepsake boxes.", displayOrder: 6, image: { url: "/images/products/copper_gift_box_1790597352148.jpg", alt: "Artisan Gift Sets" }, banner: { url: "/images/products/copper_gift_box_1790597352148.jpg", alt: "Gifting Banner" } },
];

// ─── SUBCATEGORIES ────────────────────────────────────────────

const SUBCATEGORIES = [
  { name: "Tumblers & Glasses", slug: "tumblers-glasses", description: "Hand-hammered pure copper and brass drinking glasses for daily hydration and Ayurvedic wellness.", parentSlug: "drinkware", displayOrder: 1, image: { url: "/images/copper_drinkware_1787586869011.png", alt: "Tumblers & Glasses" } },
  { name: "Water Bottles", slug: "water-bottles", description: "Seamless pure copper water bottles with leakproof solid brass caps, built for vitality on the go.", parentSlug: "drinkware", displayOrder: 2, image: { url: "/images/products/copper_water_bottle_1790597102251.jpg", alt: "Water Bottles" } },
  { name: "Water Dispensers & Matkas", slug: "water-dispensers", description: "Royal 5-litre hand-beaten brass water dispensers with pure copper faucets and removable covers.", parentSlug: "drinkware", displayOrder: 3, image: { url: "/images/products/brass_water_dispenser_1790597134328.jpg", alt: "Water Dispensers" } },
  { name: "Jugs & Pitchers", slug: "jugs-pitchers", description: "Elegantly sculpted pure copper and brass serving carafes with ergonomic handles for dining and table service.", parentSlug: "drinkware", displayOrder: 4, image: { url: "/images/products/copper_pitcher_jug_1790597334066.jpg", alt: "Jugs & Pitchers" } },
  { name: "Kadhais & Woks", slug: "kadhai-wok", description: "Heavy-gauge brass kadhais lined with pure tin (kalai) for authentic slow curries, deep frying, and braising.", parentSlug: "cookware", displayOrder: 1, image: { url: "/images/products/brass_kadhai_1790597181856.jpg", alt: "Kadhais & Woks" } },
  { name: "Cooking Pots & Handis", slug: "pots-vessels", description: "Deep heavy copper and brass cooking pots with riveted handles for rich stews, biryanis, and slow boiling.", parentSlug: "cookware", displayOrder: 2, image: { url: "/images/products/copper_cooking_pot_1790656140259.jpg", alt: "Cooking Pots & Handis" } },
  { name: "Tawas & Skillets", slug: "pans-tawa", description: "Traditional heavy flat tawas and skillets delivering even heat distribution for chapatis, rotis, and dosas.", parentSlug: "cookware", displayOrder: 3, image: { url: "/images/products/brass_tawa_pan_1790597370573.jpg", alt: "Tawas & Skillets" } },
  { name: "Ladles & Spatulas", slug: "ladles-utensils", description: "Set of five hand-forged solid brass cooking ladles, perforated skimmers, and spatulas with hanging loops.", parentSlug: "cookware", displayOrder: 4, image: { url: "/images/products/brass_ladle_set_1790656117734.jpg", alt: "Ladles & Spatulas" } },
  { name: "Drawer & Cabinet Knobs", slug: "drawer-knobs", description: "Solid unlacquered knurled, reeded, and hammered brass cabinet knobs that develop a rich organic patina over time.", parentSlug: "hardware", displayOrder: 1, image: { url: "/images/products/brass_cabinet_knobs_1790656185437.jpg", alt: "Drawer & Cabinet Knobs" } },
  { name: "Cabinet Pulls & Handles", slug: "cabinet-handles", description: "Precision architectural solid brass cabinet handles and drawer pulls engineered to elevate premium kitchen cabinetry.", parentSlug: "hardware", displayOrder: 2, image: { url: "/images/brass_hardware_hero_1787586704402.png", alt: "Cabinet Pulls & Handles" } },
  { name: "Door Hardware & Knockers", slug: "door-hardware", description: "Heavy cast brass door handles, statement lion head knockers, and ornate backplates for distinguished entryways.", parentSlug: "hardware", displayOrder: 3, image: { url: "/images/products/brass_door_knocker_1790597251010.jpg", alt: "Door Hardware & Knockers" } },
  { name: "Wall Hooks & Brackets", slug: "hooks-brackets", description: "Solid cast brass entryway hooks and architectural shelf brackets combining strength with sculptural beauty.", parentSlug: "hardware", displayOrder: 4, image: { url: "/images/brass_hardware_hero_1787586704402.png", alt: "Wall Hooks & Brackets" } },
  { name: "Vases & Planters", slug: "vases-planters", description: "Tall hand-hammered brass vases and botanic planters celebrating raw metallic luster and organic form.", parentSlug: "home-decor", displayOrder: 1, image: { url: "/images/brass_home_decor_1787586833521.png", alt: "Vases & Planters" } },
  { name: "Candleholders & Stands", slug: "candleholders", description: "Antique engraved brass pillar candlestick holders and tea-light stands that cast warm, romantic ambient light.", parentSlug: "home-decor", displayOrder: 2, image: { url: "/images/products/brass_candleholder_1790656166695.jpg", alt: "Candleholders & Stands" } },
  { name: "Trays & Keepsake Boxes", slug: "trays-boxes", description: "Handcrafted etched brass decorative serving trays and trinket boxes with intricate floral borders.", parentSlug: "home-decor", displayOrder: 3, image: { url: "/images/products/brass_urli_bowl_1790597314906.jpg", alt: "Trays & Boxes" } },
  { name: "Thali Dining Sets", slug: "thali-sets", description: "Complete royal Indian brass thali dining sets with dinner plates, hammered katoris, glasses, and spoons.", parentSlug: "serveware", displayOrder: 1, image: { url: "/images/products/brass_thali_set_1790597290494.jpg", alt: "Thali Dining Sets" } },
  { name: "Bowls & Katoris", slug: "bowls-katoris", description: "Handcrafted brass serving bowls and dessert katoris for dal, curries, kheer, and traditional festive dining.", parentSlug: "serveware", displayOrder: 2, image: { url: "/images/products/brass_thali_set_1790597290494.jpg", alt: "Bowls & Katoris" } },
  { name: "Platters & Trays", slug: "serving-platters", description: "Substantial hammered brass serving platters with raised handles for canapés, fruits, and centerpieces.", parentSlug: "serveware", displayOrder: 3, image: { url: "/images/brass_home_decor_1787586833521.png", alt: "Platters & Trays" } },
  { name: "Corporate Gifts", slug: "corporate-gifts", description: "Sophisticated brass and copper desk accessories and wellness gift sets tailored for corporate appreciation.", parentSlug: "gifting", displayOrder: 1, image: { url: "/images/products/copper_gift_box_1790597352148.jpg", alt: "Corporate Gifts" } },
  { name: "Wedding Gifts", slug: "wedding-gifts", description: "Auspicious handcrafted brass and copper wedding gift sets packed in royal satin presentation boxes.", parentSlug: "gifting", displayOrder: 2, image: { url: "/images/products/copper_gift_box_1790597352148.jpg", alt: "Wedding Gifts" } },
  { name: "Festival Gifts", slug: "festival-gifts", description: "Curated Diwali and Puja brass gift hampers featuring floating urlis, diyas, and ceremonial vessels.", parentSlug: "gifting", displayOrder: 3, image: { url: "/images/products/brass_urli_bowl_1790597314906.jpg", alt: "Festival Gifts" } },
  { name: "Wellness Gifts", slug: "wellness-gifts", description: "Ayurvedic copper water bottles and tumbler wellness sets designed for mindful health and natural living.", parentSlug: "gifting", displayOrder: 4, image: { url: "/images/products/copper_gift_box_1790597352148.jpg", alt: "Wellness Gifts" } },
];

// ─── PRODUCTS ─────────────────────────────────────────────────

const RAW_PRODUCTS = [
  {
    name: "Hammered Copper Tumbler Set (Set of 6)",
    slug: "hammered-copper-tumbler-set-6",
    sku: "MM-DW-001",
    material: "copper",
    price: 2400,
    compareAtPrice: 2999,
    costPrice: 1200,
    stock: 40,
    rating: 4.9,
    reviewCount: 156,
    featured: true,
    bestseller: true,
    newArrival: false,
    categorySlug: "drinkware",
    subcategorySlug: "tumblers-glasses",
    collectionSlugs: ["bestsellers", "wellness-edit"],
    finishes: ["Hammered Copper", "Polished Copper"],
    tags: ["copper", "tumbler", "drinkware", "set", "hammered", "healthy"],
    shortDescription: "Hand-hammered pure copper tumbler set for healthy daily hydration. Naturally antimicrobial.",
    description: "Crafted from 99.5% pure copper, each tumbler in this set of 6 is individually hand-hammered by master artisans. Drinking water stored in copper vessels is an ancient Ayurvedic practice known to boost immunity and aid digestion.",
    specifications: [{ key: "Material", value: "99.5% Pure Copper" }, { key: "Capacity", value: "350ml each" }, { key: "Set Size", value: "6 Tumblers" }],
    images: [{ url: "/images/copper_drinkware_1787586869011.png", alt: "Hammered Copper Tumbler Set" }],
    weight: 1200,
    countryOfOrigin: "India",
    careInstructions: "Hand wash with mild soap. Polish with lemon juice to restore shine.",
    warranty: "Lifetime craftsmanship warranty.",
  },
  {
    name: "Pure Copper Water Bottle (1L)",
    slug: "pure-copper-water-bottle-1l",
    sku: "MM-DW-002",
    material: "copper",
    price: 1800,
    compareAtPrice: 2200,
    costPrice: 900,
    stock: 55,
    rating: 4.8,
    reviewCount: 234,
    featured: false,
    bestseller: true,
    newArrival: false,
    categorySlug: "drinkware",
    subcategorySlug: "water-bottles",
    collectionSlugs: ["bestsellers", "wellness-edit"],
    finishes: ["Polished Copper", "Antique Copper"],
    tags: ["copper", "water bottle", "wellness", "ayurveda"],
    shortDescription: "Leak-proof pure copper water bottle for on-the-go wellness. 1 litre capacity.",
    description: "Made from 99.5% pure copper with a leak-proof brass cap. Copper-infused water supports immunity, digestion, and joint health as per Ayurvedic science.",
    specifications: [{ key: "Material", value: "99.5% Pure Copper" }, { key: "Capacity", value: "1000ml (1L)" }],
    images: [{ url: "/images/products/copper_water_bottle_1790597102251.jpg", alt: "Pure Copper Water Bottle" }],
    weight: 450,
    countryOfOrigin: "India",
    careInstructions: "Rinse with warm water. Clean with lemon and salt mixture weekly.",
    warranty: "2-year manufacturer warranty.",
  },
  {
    name: "Hammered Brass Water Dispenser (5L)",
    slug: "hammered-brass-water-dispenser-5l",
    sku: "MM-DW-003",
    material: "brass",
    price: 7200,
    compareAtPrice: 8500,
    costPrice: 3600,
    stock: 12,
    rating: 4.9,
    reviewCount: 78,
    featured: true,
    bestseller: false,
    newArrival: true,
    categorySlug: "drinkware",
    subcategorySlug: "water-dispensers",
    collectionSlugs: ["new-arrivals", "heritage-collection"],
    finishes: ["Antique Brass", "Polished Brass"],
    tags: ["brass", "water dispenser", "matka", "5 litre"],
    shortDescription: "Regal hand-hammered brass water dispenser with copper tap. Centrepiece for any dining room.",
    description: "A showstopping brass water dispenser hand-hammered by master craftsmen. 5-litre vessel with polished copper tap and removable lid.",
    specifications: [{ key: "Material", value: "Solid Brass body, Copper tap" }, { key: "Capacity", value: "5 Litres" }],
    images: [{ url: "/images/products/brass_water_dispenser_1790597134328.jpg", alt: "Brass Water Dispenser" }],
    weight: 2800,
    countryOfOrigin: "India",
    warranty: "Lifetime craftsmanship warranty.",
  },
  {
    name: "Copper Pitcher with Lid (2L)",
    slug: "copper-pitcher-with-lid-2l",
    sku: "MM-DW-004",
    material: "copper",
    price: 3200,
    compareAtPrice: 3800,
    costPrice: 1600,
    stock: 22,
    rating: 4.7,
    reviewCount: 64,
    featured: false,
    bestseller: false,
    newArrival: true,
    categorySlug: "drinkware",
    subcategorySlug: "jugs-pitchers",
    collectionSlugs: ["new-arrivals", "wellness-edit"],
    finishes: ["Polished Copper", "Hammered Copper"],
    tags: ["copper", "pitcher", "jug", "2 litre"],
    shortDescription: "Elegant pure copper serving pitcher with hammered finish and fitted lid.",
    description: "A beautifully proportioned 2-litre copper pitcher for storing and serving water, juices, or buttermilk. Hand-hammered with a fitted lid.",
    specifications: [{ key: "Material", value: "Pure Copper" }, { key: "Capacity", value: "2 Litres" }],
    images: [{ url: "/images/products/copper_pitcher_jug_1790597334066.jpg", alt: "Copper Pitcher" }],
    weight: 700,
    countryOfOrigin: "India",
    careInstructions: "Rinse with warm water. Clean with salt and lemon for shine.",
  },
  {
    name: "Hand-Hammered Brass Kadhai — Tin-Lined (2kg)",
    slug: "hand-hammered-brass-kadhai-tin-lined",
    sku: "MM-CK-001",
    material: "brass",
    price: 5600,
    compareAtPrice: 6500,
    costPrice: 2800,
    stock: 15,
    rating: 5.0,
    reviewCount: 89,
    featured: true,
    bestseller: true,
    newArrival: false,
    categorySlug: "cookware",
    subcategorySlug: "kadhai-wok",
    collectionSlugs: ["bestsellers", "heritage-collection"],
    finishes: ["Antique Brass"],
    tags: ["brass", "kadhai", "cookware", "tin lined", "kalai"],
    shortDescription: "Traditional heavy-gauge brass kadhai lined with pure food-grade tin (kalai). Ideal for authentic Indian cooking.",
    description: "The crown jewel of Indian kitchen craft. Heavy-gauge brass kadhai hand-hammered to perfection and lined with food-grade pure tin making it completely safe for cooking. A single kadhai, maintained well, lasts generations.",
    specifications: [{ key: "Material", value: "Heavy-gauge Brass with Tin Lining (Kalai)" }, { key: "Diameter", value: "28cm" }, { key: "Weight", value: "2kg" }],
    images: [{ url: "/images/products/brass_kadhai_1790597181856.jpg", alt: "Brass Kadhai" }],
    weight: 2000,
    countryOfOrigin: "India",
    careInstructions: "Hand wash only. Re-kalai recommended every 1-2 years.",
    warranty: "5-year warranty on craftsmanship.",
  },
  {
    name: "Copper Cooking Pot with Brass Handles (3L)",
    slug: "copper-cooking-pot-brass-handles-3l",
    sku: "MM-CK-002",
    material: "copper",
    price: 4800,
    compareAtPrice: 5600,
    costPrice: 2400,
    stock: 18,
    rating: 4.8,
    reviewCount: 52,
    featured: false,
    bestseller: true,
    newArrival: false,
    categorySlug: "cookware",
    subcategorySlug: "pots-vessels",
    collectionSlugs: ["bestsellers", "heritage-collection"],
    finishes: ["Polished Copper"],
    tags: ["copper", "pot", "vessel", "cookware", "tin lined"],
    shortDescription: "3-litre pure copper cooking pot with brass handles. Tin-lined for safe cooking.",
    description: "A versatile copper cooking pot excelling at slow-cooking dals, soups, and stews. Tin-lined (kalai) for complete food safety. Brass riveted handles stay cool during cooking.",
    specifications: [{ key: "Material", value: "Pure Copper with Tin Lining" }, { key: "Capacity", value: "3 Litres" }],
    images: [{ url: "/images/products/copper_cooking_pot_1790656140259.jpg", alt: "Copper Cooking Pot" }],
    weight: 1800,
    countryOfOrigin: "India",
    careInstructions: "Hand wash with mild soap. Polish with tamarind paste to restore shine.",
  },
  {
    name: "Brass Tawa — Flat Pan (30cm)",
    slug: "brass-tawa-flat-pan-30cm",
    sku: "MM-CK-003",
    material: "brass",
    price: 2800,
    compareAtPrice: 3400,
    costPrice: 1400,
    stock: 20,
    rating: 4.6,
    reviewCount: 38,
    featured: false,
    bestseller: false,
    newArrival: true,
    categorySlug: "cookware",
    subcategorySlug: "pans-tawa",
    collectionSlugs: ["new-arrivals"],
    finishes: ["Polished Brass"],
    tags: ["brass", "tawa", "flat pan", "cookware", "roti"],
    shortDescription: "Traditional solid brass tawa for rotis, parathas, and dosas. 30cm diameter.",
    description: "A traditional brass tawa brings a forgotten ritual back to the modern kitchen. Uniform heat distribution produces perfectly puffed rotis and crisp parathas.",
    specifications: [{ key: "Material", value: "Solid Brass with Tin Lining" }, { key: "Diameter", value: "30cm" }],
    images: [{ url: "/images/products/brass_tawa_pan_1790597370573.jpg", alt: "Brass Tawa" }],
    weight: 1200,
    countryOfOrigin: "India",
    careInstructions: "Season with oil before first use. Hand wash only.",
  },
  {
    name: "Brass Ladle & Utensil Set (5 Pieces)",
    slug: "brass-ladle-utensil-set-5",
    sku: "MM-CK-004",
    material: "brass",
    price: 1800,
    compareAtPrice: 2200,
    costPrice: 900,
    stock: 30,
    rating: 4.7,
    reviewCount: 45,
    featured: false,
    bestseller: false,
    newArrival: true,
    categorySlug: "cookware",
    subcategorySlug: "ladles-utensils",
    collectionSlugs: ["new-arrivals"],
    finishes: ["Polished Brass"],
    tags: ["brass", "ladle", "spoon", "utensils", "set"],
    shortDescription: "Set of 5 solid brass cooking utensils: ladle, slotted spoon, serving spoon, skimmer, and turner.",
    description: "Complete brass utensil set including deep ladle, slotted spoon, serving spoon, skimmer, and flat turner. Naturally antimicrobial and beautiful.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Set Contents", value: "5 pieces" }],
    images: [{ url: "/images/products/brass_ladle_set_1790656117734.jpg", alt: "Brass Ladle Set" }],
    weight: 800,
    countryOfOrigin: "India",
  },
  {
    name: "Hammered Antique Brass Drawer Knob",
    slug: "hammered-antique-brass-drawer-knob",
    sku: "MM-HW-001",
    material: "brass",
    price: 480,
    compareAtPrice: 580,
    costPrice: 240,
    stock: 120,
    rating: 4.9,
    reviewCount: 312,
    featured: true,
    bestseller: true,
    newArrival: false,
    categorySlug: "hardware",
    subcategorySlug: "drawer-knobs",
    collectionSlugs: ["bestsellers"],
    finishes: ["Antique Brass", "Polished Brass", "Satin Brass"],
    tags: ["brass", "knob", "drawer", "hardware", "antique", "cabinet"],
    shortDescription: "Hand-hammered solid brass drawer knob with warm antique patina. Fits all standard drawers.",
    description: "Elevate your kitchen and wardrobe furniture with these exquisite solid brass drawer knobs. Each is individually hand-hammered, creating a subtly varied texture that catches light beautifully.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Diameter", value: "30mm" }, { key: "Fixing", value: "Single M4 bolt (included)" }],
    images: [{ url: "/images/products/brass_cabinet_knobs_1790656185437.jpg", alt: "Antique Brass Drawer Knob" }],
    weight: 85,
    countryOfOrigin: "India",
  },
  {
    name: "Solid Brass Cabinet Handle (128mm)",
    slug: "solid-brass-cabinet-handle-128mm",
    sku: "MM-HW-002",
    material: "brass",
    price: 850,
    compareAtPrice: 1000,
    costPrice: 425,
    stock: 85,
    rating: 4.8,
    reviewCount: 178,
    featured: true,
    bestseller: true,
    newArrival: false,
    categorySlug: "hardware",
    subcategorySlug: "cabinet-handles",
    collectionSlugs: ["bestsellers"],
    finishes: ["Antique Brass", "Polished Brass", "Brushed Brass"],
    tags: ["brass", "handle", "cabinet", "hardware", "pull", "kitchen"],
    shortDescription: "Architectural solid brass bar handle for kitchen cabinets and wardrobes. 128mm hole spacing.",
    description: "A sleek architectural brass bar handle that transforms ordinary cabinets into premium furniture. Substantial, satisfying to grip, with gently rounded edges.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Hole Spacing", value: "128mm" }],
    images: [{ url: "/images/brass_hardware_hero_1787586704402.png", alt: "Solid Brass Cabinet Handle" }],
    weight: 140,
    countryOfOrigin: "India",
  },
  {
    name: "Antique Brass Door Knob with Backplate",
    slug: "antique-brass-door-knob-backplate",
    sku: "MM-HW-003",
    material: "brass",
    price: 1800,
    compareAtPrice: 2200,
    costPrice: 900,
    stock: 35,
    rating: 4.7,
    reviewCount: 67,
    featured: false,
    bestseller: false,
    newArrival: true,
    categorySlug: "hardware",
    subcategorySlug: "door-hardware",
    collectionSlugs: ["new-arrivals", "heritage-collection"],
    finishes: ["Antique Brass"],
    tags: ["brass", "door knob", "hardware", "backplate", "interior door"],
    shortDescription: "Solid brass door knob with ornate backplate. Fits all standard interior doors.",
    description: "A statement door knob in antique solid brass with an intricate floral backplate. Transforms interior doors into architectural features.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Knob Diameter", value: "55mm" }],
    images: [{ url: "/images/products/brass_door_knocker_1790597251010.jpg", alt: "Brass Door Knob" }],
    weight: 420,
    countryOfOrigin: "India",
  },
  {
    name: "Solid Brass Wall Hook — Set of 3",
    slug: "brass-wall-hook-set-3",
    sku: "MM-HW-004",
    material: "brass",
    price: 1200,
    compareAtPrice: 1500,
    costPrice: 600,
    stock: 60,
    rating: 4.6,
    reviewCount: 93,
    featured: false,
    bestseller: false,
    newArrival: false,
    categorySlug: "hardware",
    subcategorySlug: "hooks-brackets",
    collectionSlugs: ["heritage-collection"],
    finishes: ["Antique Brass", "Polished Brass"],
    tags: ["brass", "hook", "wall hook", "coat hook", "hardware", "set"],
    shortDescription: "Solid brass wall hooks for coats, bags, and keys. Set of 3 with all mounting hardware.",
    description: "Generous solid brass wall hooks for hallways, bathrooms, and bedrooms. Each hook has a wide, rounded end and solid brass flange. All mounting hardware included.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Set Contents", value: "3 Hooks with screws" }],
    images: [{ url: "/images/brass_hardware_hero_1787586704402.png", alt: "Brass Wall Hooks" }],
    weight: 300,
    countryOfOrigin: "India",
  },
  {
    name: "Hand-Hammered Brass Vase — Tall (40cm)",
    slug: "hand-hammered-brass-vase-tall-40cm",
    sku: "MM-HD-001",
    material: "brass",
    price: 5500,
    compareAtPrice: 6500,
    costPrice: 2750,
    stock: 20,
    rating: 4.9,
    reviewCount: 56,
    featured: true,
    bestseller: false,
    newArrival: true,
    categorySlug: "home-decor",
    subcategorySlug: "vases-planters",
    collectionSlugs: ["new-arrivals", "modern-luxe"],
    finishes: ["Hammered Brass", "Brushed Brass"],
    tags: ["brass", "vase", "decor", "hammered", "tall", "home"],
    shortDescription: "Sculptural hand-hammered tall brass vase. A statement piece for any modern interior.",
    description: "A bold sculptural vase hand-hammered from a single sheet of brass. The tall silhouette and organic surface create a play of light and shadow. Beautiful with dried grasses or standing alone as a pure art object.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Height", value: "40cm" }],
    images: [{ url: "/images/brass_home_decor_1787586833521.png", alt: "Brass Tall Vase" }],
    weight: 1200,
    countryOfOrigin: "India",
    careInstructions: "Wipe with a dry soft cloth. Apply beeswax occasionally to maintain lustre.",
  },
  {
    name: "Brass Taper Candleholder Set (Set of 2)",
    slug: "brass-taper-candleholder-set-2",
    sku: "MM-HD-002",
    material: "brass",
    price: 2800,
    compareAtPrice: 3500,
    costPrice: 1400,
    stock: 35,
    rating: 4.8,
    reviewCount: 102,
    featured: true,
    bestseller: false,
    newArrival: false,
    categorySlug: "home-decor",
    subcategorySlug: "candleholders",
    collectionSlugs: ["modern-luxe", "bestsellers"],
    finishes: ["Polished Brass", "Antique Brass"],
    tags: ["brass", "candleholder", "candle", "taper", "decor", "set"],
    shortDescription: "Elegant turned brass taper candleholders. Set of 2 in varying heights.",
    description: "Two perfectly paired brass taper candleholders in complementary heights. The turned brass columns have a pleasingly weighty feel and graceful proportions.",
    specifications: [{ key: "Material", value: "Turned Solid Brass" }, { key: "Heights", value: "18cm and 24cm" }],
    images: [{ url: "/images/products/brass_candleholder_1790656166695.jpg", alt: "Brass Candleholders" }],
    weight: 800,
    countryOfOrigin: "India",
  },
  {
    name: "Embossed Brass Decorative Tray",
    slug: "embossed-brass-decorative-tray",
    sku: "MM-HD-003",
    material: "brass",
    price: 3200,
    compareAtPrice: 3800,
    costPrice: 1600,
    stock: 28,
    rating: 4.7,
    reviewCount: 74,
    featured: false,
    bestseller: false,
    newArrival: false,
    categorySlug: "home-decor",
    subcategorySlug: "trays-boxes",
    collectionSlugs: ["heritage-collection"],
    finishes: ["Antique Brass"],
    tags: ["brass", "tray", "decor", "embossed", "serving"],
    shortDescription: "Ornate embossed brass tray with lotus motif border. For display, serving, or organisation.",
    description: "A richly embossed brass tray featuring a traditional lotus and peacock border motif. Handcrafted using the age-old repoussé technique. An instant heirloom.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Dimensions", value: "35 x 25 x 4cm" }],
    images: [{ url: "/images/brass_home_decor_1787586833521.png", alt: "Embossed Brass Tray" }],
    weight: 950,
    countryOfOrigin: "India",
  },
  {
    name: "Traditional Brass Thali Set — 6 Piece",
    slug: "traditional-brass-thali-set-6-piece",
    sku: "MM-SW-001",
    material: "brass",
    price: 4200,
    compareAtPrice: 5000,
    costPrice: 2100,
    stock: 25,
    rating: 4.9,
    reviewCount: 118,
    featured: true,
    bestseller: true,
    newArrival: false,
    categorySlug: "serveware",
    subcategorySlug: "thali-sets",
    collectionSlugs: ["bestsellers", "heritage-collection"],
    finishes: ["Polished Brass"],
    tags: ["brass", "thali", "serveware", "set", "traditional", "puja"],
    shortDescription: "Traditional 6-piece solid brass thali set: thali, 4 katoris, and a glass. Perfect for puja and festive dining.",
    description: "A complete traditional brass thali set for festive meals, puja ceremonies, and authentic Indian dining. Mirror-polished with a fine hammered edge border.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Set Contents", value: "1 Thali, 4 Katoris, 1 Brass Glass" }],
    images: [{ url: "/images/products/brass_thali_set_1790597290494.jpg", alt: "Brass Thali Set" }],
    weight: 1800,
    countryOfOrigin: "India",
  },
  {
    name: "Brass Serving Bowl Set (Set of 4)",
    slug: "brass-serving-bowl-set-4",
    sku: "MM-SW-002",
    material: "brass",
    price: 2600,
    compareAtPrice: 3200,
    costPrice: 1300,
    stock: 40,
    rating: 4.7,
    reviewCount: 82,
    featured: false,
    bestseller: false,
    newArrival: false,
    categorySlug: "serveware",
    subcategorySlug: "bowls-katoris",
    collectionSlugs: ["heritage-collection"],
    finishes: ["Polished Brass", "Hammered Brass"],
    tags: ["brass", "bowl", "katori", "serveware", "set"],
    shortDescription: "Set of 4 solid brass serving bowls in two sizes. Traditional katori style.",
    description: "Versatile set of four solid brass serving bowls — two large and two medium — in traditional katori style. Ideal for serving dal, curries, chutneys, and sweets.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Set Contents", value: "2 Large (12cm) + 2 Medium (9cm)" }],
    images: [{ url: "/images/products/brass_thali_set_1790597290494.jpg", alt: "Brass Serving Bowls" }],
    weight: 900,
    countryOfOrigin: "India",
  },
  {
    name: "Copper Wellness Gift Hamper",
    slug: "copper-wellness-gift-hamper",
    sku: "MM-GF-001",
    material: "copper",
    price: 5800,
    compareAtPrice: 6800,
    costPrice: 2900,
    stock: 30,
    rating: 4.9,
    reviewCount: 145,
    featured: true,
    bestseller: true,
    newArrival: false,
    categorySlug: "gifting",
    subcategorySlug: "wellness-gifts",
    collectionSlugs: ["bestsellers", "gifting-hampers", "wellness-edit"],
    finishes: ["Hammered Copper", "Polished Copper"],
    tags: ["copper", "gift", "hamper", "wellness", "ayurveda"],
    shortDescription: "Luxury copper wellness gift hamper: tumbler set (2), water bottle, and copper tongue cleaner in a premium wooden box.",
    description: "A thoughtfully curated copper wellness gift set. Includes 2 hammered copper tumblers, 1 copper water bottle, and a traditional copper tongue cleaner. Presented in a handcrafted mango wood gift box.",
    specifications: [{ key: "Material", value: "99.5% Pure Copper, Mango Wood Box" }, { key: "Personalisation", value: "Free engraving on water bottle" }],
    images: [{ url: "/images/products/copper_gift_box_1790597352148.jpg", alt: "Copper Wellness Gift Hamper" }],
    weight: 2400,
    countryOfOrigin: "India",
    whatsIncluded: "2 Copper Tumblers, 1 Copper Water Bottle, 1 Copper Tongue Cleaner, Mango Wood Box, Care Guide.",
  },
  {
    name: "Brass Heritage Home Starter Set",
    slug: "brass-heritage-home-starter-set",
    sku: "MM-GF-002",
    material: "brass",
    price: 8500,
    compareAtPrice: 10000,
    costPrice: 4250,
    stock: 18,
    rating: 5.0,
    reviewCount: 67,
    featured: true,
    bestseller: false,
    newArrival: true,
    categorySlug: "gifting",
    subcategorySlug: "wedding-gifts",
    collectionSlugs: ["new-arrivals", "gifting-hampers", "heritage-collection"],
    finishes: ["Antique Brass", "Polished Brass"],
    tags: ["brass", "gift set", "wedding gift", "home", "heritage"],
    shortDescription: "Complete brass home starter set: 4 knobs, handle pair, candleholder set, and decorative tray. Ideal wedding gift.",
    description: "The perfect wedding or housewarming gift. Contains 4 brass drawer knobs, 2 cabinet handles, a taper candleholder set, and an embossed tray. Presented in a premium linen-lined gift box.",
    specifications: [{ key: "Material", value: "Solid Brass throughout" }, { key: "Finish", value: "Antique Brass" }],
    images: [{ url: "/images/products/brass_urli_bowl_1790597314906.jpg", alt: "Brass Heritage Gift Set" }],
    weight: 3000,
    countryOfOrigin: "India",
    whatsIncluded: "4 Drawer Knobs, 2 Cabinet Handles, Candleholder Set, Embossed Tray, Premium Linen Gift Box.",
  },
  {
    name: "Diwali Brass Puja Essentials Set",
    slug: "diwali-brass-puja-essentials-set",
    sku: "MM-GF-003",
    material: "brass",
    price: 3600,
    compareAtPrice: 4500,
    costPrice: 1800,
    stock: 50,
    rating: 4.8,
    reviewCount: 198,
    featured: false,
    bestseller: true,
    newArrival: false,
    categorySlug: "gifting",
    subcategorySlug: "festival-gifts",
    collectionSlugs: ["bestsellers", "gifting-hampers"],
    finishes: ["Polished Brass"],
    tags: ["brass", "puja", "diwali", "festival", "gift", "diya"],
    shortDescription: "Traditional brass puja essentials: 5 diyas, pooja thali, and agarbatti stand. Festive gift box included.",
    description: "A sacred and beautiful Diwali gift set featuring five hand-made brass diyas, a small puja thali with embossed lotus border, and a tall incense stand. Beautifully boxed in a festive gift box.",
    specifications: [{ key: "Material", value: "Solid Brass" }, { key: "Finish", value: "Mirror Polished" }],
    images: [{ url: "/images/products/brass_urli_bowl_1790597314906.jpg", alt: "Diwali Brass Puja Set" }],
    weight: 1600,
    countryOfOrigin: "India",
    whatsIncluded: "5 Brass Diyas, 1 Puja Thali (22cm), 1 Agarbatti Stand, Festive Gift Box, Greeting Card.",
  },
];

// ─── USERS ────────────────────────────────────────────────────

const SEED_USERS = [
  { firstName: "Priya", lastName: "Sharma", email: "priya.sharma@example.com", password: "Customer@123", phone: "+91 98765 43210", address: { firstName: "Priya", lastName: "Sharma", address1: "42, Lajpat Nagar II", city: "New Delhi", state: "Delhi", postalCode: "110024", country: "India", phone: "+91 98765 43210", isDefault: true } },
  { firstName: "Rohan", lastName: "Mehta", email: "rohan.mehta@example.com", password: "Customer@123", phone: "+91 99001 12345", address: { firstName: "Rohan", lastName: "Mehta", address1: "B-15, Bandra West", city: "Mumbai", state: "Maharashtra", postalCode: "400050", country: "India", phone: "+91 99001 12345", isDefault: true } },
  { firstName: "Ananya", lastName: "Iyer", email: "ananya.iyer@example.com", password: "Customer@123", phone: "+91 80123 67890", address: { firstName: "Ananya", lastName: "Iyer", address1: "18, Koramangala 4th Block", city: "Bengaluru", state: "Karnataka", postalCode: "560034", country: "India", phone: "+91 80123 67890", isDefault: true } },
  { firstName: "Vikram", lastName: "Singh", email: "vikram.singh@example.com", password: "Customer@123", phone: "+91 97654 32109", address: { firstName: "Vikram", lastName: "Singh", address1: "22, Civil Lines", city: "Jaipur", state: "Rajasthan", postalCode: "302006", country: "India", phone: "+91 97654 32109", isDefault: true } },
  { firstName: "Deepa", lastName: "Nair", email: "deepa.nair@example.com", password: "Customer@123", phone: "+91 94456 78901", address: { firstName: "Deepa", lastName: "Nair", address1: "7, Anna Salai, Teynampet", city: "Chennai", state: "Tamil Nadu", postalCode: "600018", country: "India", phone: "+91 94456 78901", isDefault: true } },
];

// ─── COUPONS ──────────────────────────────────────────────────

const SEED_COUPONS = [
  { code: "WELCOME15", discountType: "percentage" as const, discountValue: 15, minOrderAmount: 1000, maxDiscountAmount: 1500, usageLimit: 1000, isActive: true, expiresAt: new Date("2027-03-31") },
  { code: "COPPER20", discountType: "percentage" as const, discountValue: 20, minOrderAmount: 2000, maxDiscountAmount: 2000, usageLimit: 500, isActive: true, expiresAt: new Date("2026-12-31") },
  { code: "DIWALI500", discountType: "fixed" as const, discountValue: 500, minOrderAmount: 3000, usageLimit: 200, isActive: true, expiresAt: new Date("2026-11-15") },
  { code: "FREESHIP", discountType: "fixed" as const, discountValue: 199, minOrderAmount: 800, isActive: true, expiresAt: new Date("2027-06-30") },
  { code: "HERITAGE10", discountType: "percentage" as const, discountValue: 10, minOrderAmount: 5000, usageLimit: 300, isActive: true, expiresAt: new Date("2027-01-31") },
];

// ─── BANNERS ──────────────────────────────────────────────────

const SEED_BANNERS = [
  { title: "The Art of Brass & Copper", subtitle: "Handcrafted objects for the modern home. Every piece, a story.", desktopImage: { url: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=1600&q=85" }, ctaText: "Shop Now", ctaUrl: "/shop", ctaSecondaryText: "Explore Collections", ctaSecondaryUrl: "/collections", isActive: true, displayOrder: 1, placement: "hero" as const },
  { title: "Copper Wellness Collection", subtitle: "Discover the ancient science of copper hydration.", desktopImage: { url: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=1600&q=85" }, ctaText: "Shop Drinkware", ctaUrl: "/categories/drinkware", isActive: true, displayOrder: 2, placement: "promotional" as const },
  { title: "Diwali Gifting — Up to 20% Off", subtitle: "Celebrate with the gift of brass. Use code DIWALI500.", desktopImage: { url: "https://images.unsplash.com/photo-1513201099705-a9746072f825?w=1600&q=85" }, ctaText: "Shop Gifts", ctaUrl: "/categories/gifting", isActive: true, displayOrder: 3, placement: "promotional" as const },
];

// ─── BLOG POSTS ───────────────────────────────────────────────

const SEED_BLOGS = [
  {
    title: "Why Copper Vessels Are the Healthiest Way to Store Water",
    slug: "why-copper-vessels-healthiest-water-storage",
    excerpt: "Ancient Ayurvedic science meets modern research. We explore the antimicrobial and health benefits of drinking water from copper vessels.",
    content: `<h2>The Ancient Science of Copper Water</h2><p>For thousands of years, Indian households have stored drinking water in copper vessels. Multiple studies confirm that copper vessels can kill harmful bacteria including E. coli and Salmonella within hours.</p><h2>Benefits of Copper Water</h2><ul><li>Natural antimicrobial properties that purify water</li><li>Supports digestive health and metabolism</li><li>Rich in antioxidants</li><li>Supports joint and bone health</li></ul><h2>How to Use Your Copper Vessel</h2><p>Fill your copper bottle at night and drink the water first thing in the morning. Aim for 2-3 glasses daily. Clean weekly with lemon and salt.</p>`,
    author: "Mello Metallo",
    category: "Wellness",
    tags: ["copper", "wellness", "ayurveda", "health"],
    status: "published" as const,
    featured: true,
    publishDate: new Date("2026-09-01"),
    coverImage: { url: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=1200&q=80", alt: "Copper Water Vessel" },
  },
  {
    title: "How to Care for Your Brass Cookware: A Complete Guide",
    slug: "how-to-care-for-brass-cookware-guide",
    excerpt: "Your brass kadhai and copper pots need love to last a lifetime. Everything you need to know about cleaning, seasoning, and re-tinning.",
    content: `<h2>Daily Cleaning</h2><p>Always hand wash with warm water and mild soap. Never put brass or copper cookware in a dishwasher. Dry immediately after washing.</p><h2>Deep Cleaning</h2><p>Once a week, clean with a mixture of salt, flour, and lemon juice. Apply with a soft cloth in circular motions, then rinse.</p><h2>When to Re-Kalai (Re-Tin)</h2><p>The tin lining may wear over time. You'll know it's time for re-kalai when you see brass showing through the tin lining. A simple process done by local craftsmen.</p>`,
    author: "Mello Metallo",
    category: "Care & Maintenance",
    tags: ["brass", "copper", "cookware", "care", "kalai"],
    status: "published" as const,
    featured: true,
    publishDate: new Date("2026-09-10"),
    coverImage: { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80", alt: "Brass Kadhai Care" },
  },
  {
    title: "The Art of Moradabad: India's Brass Capital",
    slug: "the-art-of-moradabad-india-brass-capital",
    excerpt: "A journey to Moradabad, Uttar Pradesh — the city that supplies the world with brass. We meet the master craftsmen behind every Mello Metallo piece.",
    content: `<h2>City of Brass</h2><p>Moradabad, known globally as 'Peetalngari' (City of Brass), has been India's brass capital for over 400 years. It exports brass objects to over 100 countries.</p><h2>The Craftsmen</h2><p>The kaarigars of Moradabad learn their trade as children, watching fathers and grandfathers work. Techniques of hammering, casting, engraving, and finishing are living traditions.</p><h2>Our Partnership</h2><p>At Mello Metallo, we work directly with 12 artisan families in Moradabad, paying fair prices and ensuring safe working conditions.</p>`,
    author: "Mello Metallo",
    category: "Craftsmanship",
    tags: ["moradabad", "artisan", "craftsmanship", "brass", "heritage"],
    status: "published" as const,
    featured: false,
    publishDate: new Date("2026-09-18"),
    coverImage: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", alt: "Moradabad Brass Craftsmen" },
  },
];

// ─── FAQs ─────────────────────────────────────────────────────

const SEED_FAQS = [
  { question: "Is it safe to cook in brass vessels?", answer: "Yes, provided the brass cookware is lined with food-grade tin (kalai process). At Mello Metallo, all our cooking vessels are tin-lined by specialist craftsmen, making them completely safe for cooking all types of food.", category: "Products", displayOrder: 1 },
  { question: "How do I clean my copper water bottle?", answer: "Rinse with warm water after each use. Weekly, clean the inside with a mixture of salt and lemon juice, then rinse thoroughly. This removes oxidation and maintains the copper's antimicrobial properties. Avoid dishwashers and harsh chemical cleaners.", category: "Care", displayOrder: 2 },
  { question: "Do brass products tarnish over time?", answer: "Yes, brass naturally develops a patina over time. Many people love this aged look. If you prefer the original golden shine, clean regularly with lemon-salt paste. We also offer products in pre-applied antique finish.", category: "Products", displayOrder: 3 },
  { question: "How long does delivery take?", answer: "Standard delivery takes 4-7 business days across India. Expedited shipping (2-3 business days) is available for an additional charge. International delivery takes 10-20 business days.", category: "Shipping", displayOrder: 4 },
  { question: "What is your return and exchange policy?", answer: "We offer a 30-day hassle-free return policy. Items must be in original, unused condition with original packaging. Gift items can be exchanged for equal or lesser value.", category: "Returns", displayOrder: 5 },
  { question: "Can I customise or engrave products?", answer: "Yes! We offer complimentary laser engraving on water bottles and gift sets for orders above ₹3,000. For bulk corporate gifting and custom orders, please contact us at corporate@mellometallo.com.", category: "Customisation", displayOrder: 6 },
  { question: "What is the 'kalai' (tin-lining) process?", answer: "Kalai is the traditional Indian process of lining brass and copper cookware with food-grade tin. This creates a non-reactive surface safe for cooking acidic foods like tomatoes. The tin lining may need renewal every 1-3 years.", category: "Products", displayOrder: 7 },
  { question: "Do you offer corporate and bulk orders?", answer: "Absolutely. We work with hotels, restaurants, architects, and corporate gifting teams. Bulk discounts start from 10 pieces. Email corporate@mellometallo.com with your requirements.", category: "Business", displayOrder: 8 },
  { question: "Are your products authentic and handcrafted?", answer: "Yes. Every Mello Metallo product is handcrafted by artisan families in Moradabad, India. We visit our artisan partners regularly, and every piece is individually quality-checked before shipping.", category: "Products", displayOrder: 9 },
  { question: "How do I apply a coupon code?", answer: "Add items to your cart and proceed to checkout. On the checkout page, enter your coupon code in the 'Apply Coupon' field and click 'Apply'. The discount will be deducted from your order total immediately.", category: "Orders", displayOrder: 10 },
];

// ─── STORE SETTINGS ───────────────────────────────────────────

const STORE_SETTINGS = [
  { key: "storeName", value: "Mello Metallo" },
  { key: "storeTagline", value: "Handcrafted Brass & Copper for the Modern Home" },
  { key: "storeEmail", value: "hello@mellometallo.com" },
  { key: "storePhone", value: "+91 97123 45678" },
  { key: "currency", value: "INR" },
  { key: "freeShippingThreshold", value: 1500 },
  { key: "taxRate", value: 18 },
  { key: "defaultShippingCost", value: 199 },
  { key: "maintenanceMode", value: false },
  { key: "socialLinks", value: { instagram: "https://instagram.com/mellometallo", facebook: "https://facebook.com/mellometallo", pinterest: "https://pinterest.com/mellometallo" } },
];

// ─── REVIEW DATA ──────────────────────────────────────────────

const REVIEW_DATA = [
  { rating: 5, title: "Absolutely stunning quality!", body: "The quality of these brass products is exceptional. You can feel the weight and craftsmanship the moment you hold it. I ordered the copper tumbler set and my guests are always impressed.", authorName: "Priya Sharma", authorEmail: "priya.sharma@example.com", verifiedPurchase: true },
  { rating: 5, title: "Worth every rupee", body: "Got the brass kadhai and it's transformed my cooking. Heat distribution is even and the kalai lining is perfect. Dal and kheer taste noticeably better.", authorName: "Rohan Mehta", authorEmail: "rohan.mehta@example.com", verifiedPurchase: true },
  { rating: 4, title: "Beautiful piece, minor wait", body: "The hammered brass drawer knobs look incredible on my kitchen cabinets. They've completely transformed the look. Worth the wait.", authorName: "Ananya Iyer", authorEmail: "ananya.iyer@example.com", verifiedPurchase: true },
  { rating: 5, title: "Perfect wedding gift", body: "Ordered the Brass Heritage Home Starter Set as a wedding gift. The recipient was blown away. The packaging alone felt like a luxury gift.", authorName: "Vikram Singh", authorEmail: "vikram.singh@example.com", verifiedPurchase: true },
  { rating: 5, title: "My daily ritual now", body: "I've been drinking copper water every morning for 2 months and feel the difference. The bottle is beautifully made, doesn't leak, and the patina looks amazing.", authorName: "Deepa Nair", authorEmail: "deepa.nair@example.com", verifiedPurchase: true },
  { rating: 4, title: "Great quality, a bit heavy", body: "The brass thali set is magnificent for special occasions. It's heavy — which means it's solid and authentic. Very happy with the purchase.", authorName: "Suresh Patel", authorEmail: "suresh.patel@example.com", verifiedPurchase: false },
  { rating: 5, title: "Heirloom quality", body: "These products are made to last generations. I bought the brass vase and it's the centrepiece of my living room. True craftsmanship.", authorName: "Meera Krishnan", authorEmail: "meera.k@example.com", verifiedPurchase: false },
];

// ─── MAIN SEED FUNCTION ───────────────────────────────────────

export async function seedDatabase() {
  await connectDB();
  console.log("🌱 Starting comprehensive database seed...");

  // 1. Collections
  console.log("  Seeding collections...");
  const collectionMap: Record<string, string> = {};
  for (const col of COLLECTIONS) {
    let existing = await Collection.findOne({ slug: col.slug });
    if (!existing) existing = await Collection.create({ ...col, isActive: true });
    collectionMap[col.slug] = existing._id.toString();
  }

  // 2. Parent Categories
  console.log("  Seeding parent categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of PARENT_CATEGORIES) {
    let existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      existing = await Category.create({ ...cat, isActive: true });
    } else {
      await Category.updateOne({ slug: cat.slug }, { $set: { description: cat.description, displayOrder: cat.displayOrder, image: cat.image } });
    }
    categoryMap[cat.slug] = existing._id.toString();
  }

  // 3. Subcategories
  console.log("  Seeding subcategories...");
  for (const sub of SUBCATEGORIES) {
    const parentId = categoryMap[sub.parentSlug];
    if (!parentId) continue;
    const existing = await Category.findOne({ slug: sub.slug });
    if (!existing) {
      const created = await Category.create({
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        parent: parentId,
        displayOrder: sub.displayOrder,
        isActive: true,
        image: (sub as any).image,
        banner: (sub as any).image,
      });
      categoryMap[sub.slug] = created._id.toString();
    } else {
      await Category.updateOne(
        { slug: sub.slug },
        {
          $set: {
            name: sub.name,
            description: sub.description,
            parent: parentId,
            displayOrder: sub.displayOrder,
            image: (sub as any).image,
            banner: (sub as any).image,
            isActive: true,
          },
        }
      );
      categoryMap[sub.slug] = existing._id.toString();
    }
  }

  // 4. Products
  console.log("  Seeding products...");
  const productIds: string[] = [];
  for (const prod of RAW_PRODUCTS) {
    const catId = categoryMap[prod.categorySlug];
    const subId = (prod as any).subcategorySlug ? categoryMap[(prod as any).subcategorySlug] : undefined;
    const colIds = ((prod as any).collectionSlugs || []).map((s: string) => collectionMap[s]).filter(Boolean);
    const { categorySlug, subcategorySlug, collectionSlugs, ...rest } = prod as any;

    let existing = await Product.findOne({ slug: prod.slug });
    if (!existing) {
      existing = await Product.create({
        ...rest,
        category: catId,
        subcategory: subId,
        collections: colIds,
        status: "published",
        trackInventory: true,
        allowBackorders: false,
        variants: [],
        seo: { title: `${prod.name} | Mello Metallo`, description: prod.shortDescription },
      });
    } else {
      await Product.updateOne(
        { slug: prod.slug },
        {
          $set: {
            images: prod.images,
            category: catId,
            subcategory: subId,
            collections: colIds,
            status: "published",
          },
        }
      );
    }
    productIds.push(existing._id.toString());
  }

  // 5. Users
  console.log("  Seeding users...");
  const userIds: string[] = [];
  for (const u of SEED_USERS) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      existing = await User.create({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        passwordHash,
        role: "customer",
        isActive: true,
        emailVerified: true,
        defaultCurrency: "INR",
        addresses: [u.address],
      });
    }
    userIds.push(existing._id.toString());
  }

  // 6. Orders
  console.log("  Seeding orders...");
  const orderStatuses = [
    { fulfillmentStatus: "delivered" as const, paymentStatus: "paid" as const },
    { fulfillmentStatus: "shipped" as const, paymentStatus: "paid" as const },
    { fulfillmentStatus: "processing" as const, paymentStatus: "paid" as const },
    { fulfillmentStatus: "confirmed" as const, paymentStatus: "paid" as const },
    { fulfillmentStatus: "pending" as const, paymentStatus: "pending" as const },
    { fulfillmentStatus: "delivered" as const, paymentStatus: "paid" as const },
    { fulfillmentStatus: "cancelled" as const, paymentStatus: "refunded" as const },
  ];

  const ordersToCreate = [
    { orderNumber: "MM-2026-0001", customerIdx: 0, items: [{ productIdx: 0, qty: 1 }, { productIdx: 8, qty: 2 }], couponCode: "WELCOME15", statusIdx: 0, trackingNumber: "INDP1234567890", courier: "Blue Dart" },
    { orderNumber: "MM-2026-0002", customerIdx: 1, items: [{ productIdx: 4, qty: 1 }], statusIdx: 1, trackingNumber: "DHLX0987654321", courier: "DHL" },
    { orderNumber: "MM-2026-0003", customerIdx: 2, items: [{ productIdx: 1, qty: 2 }, { productIdx: 15, qty: 1 }], couponCode: "COPPER20", statusIdx: 2, courier: undefined, trackingNumber: undefined },
    { orderNumber: "MM-2026-0004", customerIdx: 3, items: [{ productIdx: 17, qty: 1 }], statusIdx: 3, courier: undefined, trackingNumber: undefined },
    { orderNumber: "MM-2026-0005", customerIdx: 4, items: [{ productIdx: 12, qty: 1 }, { productIdx: 13, qty: 1 }], statusIdx: 4, courier: undefined, trackingNumber: undefined },
    { orderNumber: "MM-2026-0006", customerIdx: 0, items: [{ productIdx: 18, qty: 1 }, { productIdx: 19, qty: 1 }], couponCode: "DIWALI500", statusIdx: 5, trackingNumber: "FEDX5678901234", courier: "FedEx" },
    { orderNumber: "MM-2026-0007", customerIdx: 1, items: [{ productIdx: 9, qty: 4 }], statusIdx: 6, courier: undefined, trackingNumber: undefined },
  ];

  for (const ord of ordersToCreate) {
    const existing = await Order.findOne({ orderNumber: ord.orderNumber });
    if (existing) continue;
    const user = await User.findById(userIds[ord.customerIdx]);
    if (!user) continue;

    const items: any[] = [];
    let subtotal = 0;
    for (const item of ord.items) {
      const idx = Math.min(item.productIdx, productIds.length - 1);
      const product = await Product.findById(productIds[idx]);
      if (!product) continue;
      const unitPrice = product.price;
      const totalPrice = unitPrice * item.qty;
      subtotal += totalPrice;
      items.push({ product: product._id, productName: product.name, productSlug: product.slug, sku: product.sku, image: product.images[0]?.url || "", quantity: item.qty, unitPrice, totalPrice, currency: "INR" });
    }

    const couponDiscount = ord.couponCode === "WELCOME15" ? Math.round(Math.min(subtotal * 0.15, 1500)) : ord.couponCode === "COPPER20" ? Math.round(Math.min(subtotal * 0.20, 2000)) : ord.couponCode === "DIWALI500" ? 500 : 0;
    const shippingCost = subtotal >= 1500 ? 0 : 199;
    const tax = Math.round((subtotal - couponDiscount) * 0.05);
    const total = subtotal - couponDiscount + shippingCost + tax;
    const { fulfillmentStatus, paymentStatus } = orderStatuses[ord.statusIdx];

    const timeline: any[] = [{ status: "pending", note: "Order placed successfully", createdBy: "system", timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000) }];
    if (fulfillmentStatus !== "pending" && fulfillmentStatus !== "cancelled") {
      timeline.push({ status: "confirmed", note: "Order confirmed and payment verified", createdBy: "admin", timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000) });
    }
    if (["processing", "shipped", "delivered"].includes(fulfillmentStatus)) {
      timeline.push({ status: "processing", note: "Order is being packed and prepared for dispatch", createdBy: "staff", timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000) });
    }
    if (["shipped", "delivered"].includes(fulfillmentStatus)) {
      timeline.push({ status: "shipped", note: `Shipped via ${ord.courier || "Standard Courier"}. Tracking: ${ord.trackingNumber || "—"}`, createdBy: "staff", timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000) });
    }
    if (fulfillmentStatus === "delivered") {
      timeline.push({ status: "delivered", note: "Package delivered successfully", createdBy: "system", timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000) });
    }
    if (fulfillmentStatus === "cancelled") {
      timeline.push({ status: "cancelled", note: "Order cancelled at customer request", createdBy: "admin", timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000) });
    }

    const addr = user.addresses[0] || {};
    await Order.create({
      orderNumber: ord.orderNumber,
      customer: user._id,
      customerEmail: user.email,
      customerName: `${user.firstName} ${user.lastName}`,
      customerPhone: user.phone || "",
      items,
      shippingAddress: addr,
      billingAddress: addr,
      subtotal,
      discount: couponDiscount,
      couponCode: ord.couponCode,
      couponDiscount,
      shippingCost,
      tax,
      total,
      currency: "INR",
      paymentStatus,
      paymentMethod: "UPI",
      paymentReference: `UPI${Date.now()}${Math.floor(Math.random() * 9999)}`,
      fulfillmentStatus,
      shippingMethod: "Standard",
      trackingNumber: ord.trackingNumber,
      courier: ord.courier,
      timeline,
    });
  }

  // 7. Reviews
  console.log("  Seeding reviews...");
  for (let i = 0; i < REVIEW_DATA.length; i++) {
    const rev = REVIEW_DATA[i];
    const productId = productIds[i % productIds.length];
    const exists = await Review.findOne({ authorEmail: rev.authorEmail, product: productId });
    if (!exists) {
      await Review.create({ product: productId, authorName: rev.authorName, authorEmail: rev.authorEmail, rating: rev.rating, title: rev.title, body: rev.body, verifiedPurchase: rev.verifiedPurchase, status: "approved", featured: rev.rating === 5, images: [] });
      const reviews = await Review.find({ product: productId, status: "approved" });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length });
    }
  }

  // 8. Coupons
  console.log("  Seeding coupons...");
  for (const coupon of SEED_COUPONS) {
    const exists = await Coupon.findOne({ code: coupon.code });
    if (!exists) await Coupon.create(coupon);
  }

  // 9. Banners
  console.log("  Seeding banners...");
  for (const banner of SEED_BANNERS) {
    const exists = await Banner.findOne({ title: banner.title });
    if (!exists) await Banner.create(banner);
  }

  // 10. Blog Posts
  console.log("  Seeding blog posts...");
  for (const post of SEED_BLOGS) {
    const exists = await BlogPost.findOne({ slug: post.slug });
    if (!exists) await BlogPost.create(post);
  }

  // 11. FAQs
  console.log("  Seeding FAQs...");
  for (const faq of SEED_FAQS) {
    const exists = await FAQ.findOne({ question: faq.question });
    if (!exists) await FAQ.create(faq);
  }

  // 12. Store Settings
  console.log("  Seeding store settings...");
  for (const setting of STORE_SETTINGS) {
    await StoreSetting.findOneAndUpdate({ key: setting.key }, { $set: { value: setting.value } }, { upsert: true });
  }

  // 13. Homepage Sections
  console.log("  Seeding homepage sections...");
  const homepageSections = [
    { type: "hero", title: "Hero Banner", isEnabled: true, displayOrder: 1, content: { headline: "The Art of Brass & Copper", subheadline: "Handcrafted objects for the modern home. Every piece, a living tradition." } },
    { type: "categories", title: "Shop by Category", isEnabled: true, displayOrder: 2, content: { heading: "Shop by Category" } },
    { type: "featured-collection", title: "Featured Collection", isEnabled: true, displayOrder: 3, content: { heading: "Heritage Collection" } },
    { type: "bestsellers", title: "Bestsellers", isEnabled: true, displayOrder: 4, content: { heading: "Our Bestsellers" } },
    { type: "artisan-story", title: "Artisan Story", isEnabled: true, displayOrder: 5, content: {} },
    { type: "newsletter", title: "Newsletter", isEnabled: true, displayOrder: 10, content: { heading: "Join the Mello Metallo Circle", subheading: "Be the first to know about new collections, artisan stories, and exclusive offers." } },
  ];
  for (const section of homepageSections) {
    await HomepageSection.findOneAndUpdate({ type: section.type }, { $set: section }, { upsert: true });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`   ✓ ${COLLECTIONS.length} Collections`);
  console.log(`   ✓ ${PARENT_CATEGORIES.length} Parent Categories + ${SUBCATEGORIES.length} Subcategories`);
  console.log(`   ✓ ${RAW_PRODUCTS.length} Products`);
  console.log(`   ✓ ${SEED_USERS.length} Customer Accounts`);
  console.log(`   ✓ ${ordersToCreate.length} Orders`);
  console.log(`   ✓ ${REVIEW_DATA.length} Reviews`);
  console.log(`   ✓ ${SEED_COUPONS.length} Coupons`);
  console.log(`   ✓ ${SEED_BANNERS.length} Banners`);
  console.log(`   ✓ ${SEED_BLOGS.length} Blog Posts`);
  console.log(`   ✓ ${SEED_FAQS.length} FAQs`);
  console.log(`   ✓ ${STORE_SETTINGS.length} Store Settings`);
}
