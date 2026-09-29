const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ASSET_MAP = {
  copper_water_bottle: "public/images/products/copper_water_bottle_1790597102251.jpg",
  brass_water_dispenser: "public/images/products/brass_water_dispenser_1790597134328.jpg",
  brass_kadhai: "public/images/products/brass_kadhai_1790597181856.jpg",
  brass_door_knocker: "public/images/products/brass_door_knocker_1790597251010.jpg",
  brass_thali_set: "public/images/products/brass_thali_set_1790597290494.jpg",
  brass_urli_bowl: "public/images/products/brass_urli_bowl_1790597314906.jpg",
  copper_pitcher: "public/images/products/copper_pitcher_jug_1790597334066.jpg",
  copper_gift_box: "public/images/products/copper_gift_box_1790597352148.jpg",
  brass_tawa: "public/images/products/brass_tawa_pan_1790597370573.jpg",
  brass_ladle_set: "public/images/products/brass_ladle_set_1790656117734.jpg",
  copper_cooking_pot: "public/images/products/copper_cooking_pot_1790656140259.jpg",
  brass_candleholder: "public/images/products/brass_candleholder_1790656166695.jpg",
  brass_cabinet_knobs: "public/images/products/brass_cabinet_knobs_1790656185437.jpg",
  copper_drinkware: "public/images/copper_drinkware_1787586869011.png",
  brass_cookware: "public/images/brass_cookware_lifestyle_1787586785844.png",
  brass_drinkware: "public/images/brass_drinkware_hero_1787586820724.png",
  brass_hardware: "public/images/brass_hardware_hero_1787586704402.png",
  brass_home_decor: "public/images/brass_home_decor_1787586833521.png",
  artisan_workshop: "public/images/artisan_workshop_1787586852558.png",
};

async function main() {
  console.log("☁️  Uploading assets to Cloudinary...");
  const uploadedUrls = {};

  for (const [key, relPath] of Object.entries(ASSET_MAP)) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    try {
      console.log(`  Uploading ${key} (${relPath})...`);
      const res = await cloudinary.uploader.upload(fullPath, {
        folder: "mello_metallo",
        public_id: key,
        overwrite: true,
        resource_type: "image",
      });
      uploadedUrls[key] = {
        url: res.secure_url,
        publicId: res.public_id,
        width: res.width,
        height: res.height,
      };
      console.log(`  ✓ ${key} => ${res.secure_url}`);
    } catch (err) {
      console.error(`  ✗ Failed to upload ${key}:`, err.message);
    }
  }

  // Save the manifest locally
  fs.writeFileSync(
    "src/lib/cloudinary_manifest.json",
    JSON.stringify(uploadedUrls, null, 2)
  );
  console.log("💾 Saved uploaded manifest to src/lib/cloudinary_manifest.json");

  // Connect to MongoDB
  console.log("\n📦 Connecting to MongoDB to update products, categories, subcategories...");
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;

  // 1. PRODUCT MAPPING
  const PRODUCT_IMAGE_ASSIGNMENTS = [
    {
      slug: "hammered-copper-tumbler-set-6",
      key: "copper_drinkware",
      alt: "Hammered Copper Tumbler Set of 6",
    },
    {
      slug: "pure-copper-water-bottle-1l",
      key: "copper_water_bottle",
      alt: "Ayurvedic Pure Copper Water Bottle (1L)",
    },
    {
      slug: "hammered-brass-water-dispenser-5l",
      key: "brass_water_dispenser",
      alt: "Hand-Hammered Brass Water Dispenser with Copper Tap (5L)",
    },
    {
      slug: "copper-pitcher-with-lid-2l",
      key: "copper_pitcher",
      alt: "Handcrafted Copper Pitcher with Brass Handle (2L)",
    },
    {
      slug: "hand-hammered-brass-kadhai-tin-lined",
      key: "brass_kadhai",
      alt: "Hand-Hammered Brass Kadhai with Tin Kalai Lining (2kg)",
    },
    {
      slug: "copper-cooking-pot-brass-handles-3l",
      key: "copper_cooking_pot",
      alt: "Pure Copper Cooking Pot with Brass Loop Handles (3L)",
    },
    {
      slug: "brass-tawa-flat-pan-30cm",
      key: "brass_tawa",
      alt: "Heavy Solid Brass Flat Roti Tawa (30cm)",
    },
    {
      slug: "brass-ladle-utensil-set-5pc",
      key: "brass_ladle_set",
      alt: "Hand-Forged Solid Brass Cooking Ladle and Spoon Set (5 Pieces)",
    },
    {
      slug: "hammered-antique-brass-drawer-knob",
      key: "brass_cabinet_knobs",
      alt: "Hammered Antique Solid Brass Cabinet Drawer Knob",
    },
    {
      slug: "solid-brass-cabinet-handle-128mm",
      key: "brass_hardware",
      alt: "Solid Cast Brass Fluted Cabinet Pull Handle (128mm)",
    },
    {
      slug: "antique-brass-door-knob-backplate",
      key: "brass_door_knocker",
      alt: "Ornate Architectural Brass Door Knocker and Plate",
    },
    {
      slug: "solid-brass-wall-hook-set-3",
      key: "brass_hardware",
      alt: "Solid Cast Brass Decorative Wall Coat Hooks Set of 3",
    },
    {
      slug: "hand-hammered-brass-vase-tall",
      key: "brass_home_decor",
      alt: "Hand-Hammered Tall Brass Flower Vase (40cm)",
    },
    {
      slug: "brass-taper-candleholder-set-2",
      key: "brass_candleholder",
      alt: "Engraved Antique Brass Pillar Candleholder Set of 2",
    },
    {
      slug: "embossed-brass-decorative-tray",
      key: "brass_home_decor",
      alt: "Embossed Brass Serving and Centerpiece Display Tray",
    },
    {
      slug: "traditional-brass-thali-set-6pc",
      key: "brass_thali_set",
      alt: "Royal Brass Dinner Thali Dining Set with Katoris (6 Pieces)",
    },
    {
      slug: "brass-serving-bowl-set-4",
      key: "brass_thali_set",
      alt: "Handcrafted Brass Serving Bowl and Katori Set of 4",
    },
    {
      slug: "copper-wellness-gift-hamper",
      key: "copper_gift_box",
      alt: "Ayurvedic Pure Copper Wellness Festive Gift Hamper Box",
    },
    {
      slug: "brass-heritage-home-starter-set",
      key: "brass_urli_bowl",
      alt: "Traditional Brass Floating Urli Bowl with Candles and Decor",
    },
    {
      slug: "diwali-brass-puja-essentials-set",
      key: "brass_urli_bowl",
      alt: "Diwali Brass Puja and Festive Living Essentials Set",
    },
  ];

  console.log("\n🔄 Updating 20 Products in MongoDB with Cloudinary images...");
  for (const item of PRODUCT_IMAGE_ASSIGNMENTS) {
    const asset = uploadedUrls[item.key];
    if (!asset) continue;

    const res = await db.collection("products").updateOne(
      { slug: item.slug },
      {
        $set: {
          images: [
            {
              url: asset.url,
              publicId: asset.publicId,
              alt: item.alt,
              width: asset.width,
              height: asset.height,
            },
          ],
        },
      }
    );
    console.log(`  ✓ Product [${item.slug}] updated (modified: ${res.modifiedCount})`);
  }

  // 2. CATEGORY MAPPING & UPDATE
  console.log("\n🔄 Updating Categories in MongoDB...");
  const CATEGORY_UPDATES = [
    {
      slug: "drinkware",
      name: "Drinkware",
      key: "brass_drinkware",
      description:
        "Ayurvedic pure copper and solid brass water vessels, hammered tumblers, jugs, and royal water dispensers crafted for daily wellness and living tradition.",
    },
    {
      slug: "cookware",
      name: "Cookware",
      key: "brass_cookware",
      description:
        "Hand-hammered brass kadhais, tin-lined patilas, heavy copper saucepans, and forged tawas engineered for exceptional heat retention and timeless Indian gastronomy.",
    },
    {
      slug: "hardware",
      name: "Hardware",
      key: "brass_hardware",
      description:
        "Architectural solid unlacquered brass cabinet pulls, knurled knobs, statement door knockers, and coat hooks that transform cabinetry into fine art.",
    },
    {
      slug: "home-decor",
      name: "Home Decor",
      key: "brass_home_decor",
      description:
        "Hammered brass floor urlis, engraved pillar candleholders, sculptural vases, and decorative trays that infuse warm golden warmth into modern interiors.",
    },
    {
      slug: "serveware",
      name: "Serveware",
      key: "brass_thali_set",
      description:
        "Traditional royal brass dinner thali sets, hammered serving bowls, and handcrafted platters designed for celebratory feasts and festive hospitality.",
    },
    {
      slug: "gifting",
      name: "Gifting",
      key: "copper_gift_box",
      description:
        "Heirloom gift hampers featuring pure copper drinkware, brass puja essentials, and bespoke wedding sets packaged in opulent satin-lined keepsake boxes.",
    },
  ];

  for (const cat of CATEGORY_UPDATES) {
    const asset = uploadedUrls[cat.key];
    if (!asset) continue;

    await db.collection("categories").updateOne(
      { slug: cat.slug },
      {
        $set: {
          description: cat.description,
          image: { url: asset.url, publicId: asset.publicId, alt: cat.name },
          banner: { url: asset.url, publicId: asset.publicId, alt: cat.name },
        },
      },
      { upsert: true }
    );
    console.log(`  ✓ Category [${cat.slug}] updated with Cloudinary image & description`);
  }

  // 3. SUBCATEGORY MAPPING & UPDATE
  console.log("\n🔄 Updating Subcategories with Cloudinary images & rich descriptions...");
  const SUBCATEGORY_UPDATES = [
    // Drinkware
    {
      slug: "tumblers-glasses",
      name: "Tumblers & Glasses",
      key: "copper_drinkware",
      description: "Hand-hammered pure copper and brass drinking glasses for daily hydration and Ayurvedic wellness.",
    },
    {
      slug: "water-bottles",
      name: "Water Bottles",
      key: "copper_water_bottle",
      description: "Seamless pure copper water bottles with leakproof solid brass caps, built for vitality on the go.",
    },
    {
      slug: "water-dispensers",
      name: "Water Dispensers & Matkas",
      key: "brass_water_dispenser",
      description: "Royal 5-litre hand-beaten brass water dispensers with pure copper faucets and removable covers.",
    },
    {
      slug: "jugs-pitchers",
      name: "Jugs & Pitchers",
      key: "copper_pitcher",
      description: "Elegantly sculpted pure copper and brass serving carafes with ergonomic handles for dining and table service.",
    },
    // Cookware
    {
      slug: "kadhai-wok",
      name: "Kadhais & Woks",
      key: "brass_kadhai",
      description: "Heavy-gauge brass kadhais lined with pure tin (kalai) for authentic slow curries, deep frying, and braising.",
    },
    {
      slug: "pots-vessels",
      name: "Cooking Pots & Handis",
      key: "copper_cooking_pot",
      description: "Deep heavy copper and brass cooking pots with riveted handles for rich stews, biryanis, and slow boiling.",
    },
    {
      slug: "pans-tawa",
      name: "Tawas & Skillets",
      key: "brass_tawa",
      description: "Traditional heavy flat tawas and skillets delivering even heat distribution for chapatis, rotis, and dosas.",
    },
    {
      slug: "ladles-utensils",
      name: "Ladles & Spatulas",
      key: "brass_ladle_set",
      description: "Set of five hand-forged solid brass cooking ladles, perforated skimmers, and spatulas with hanging loops.",
    },
    // Hardware
    {
      slug: "drawer-knobs",
      name: "Drawer & Cabinet Knobs",
      key: "brass_cabinet_knobs",
      description: "Solid unlacquered knurled, reeded, and hammered brass cabinet knobs that develop a rich organic patina over time.",
    },
    {
      slug: "cabinet-handles",
      name: "Cabinet Pulls & Handles",
      key: "brass_hardware",
      description: "Precision architectural solid brass cabinet handles and drawer pulls engineered to elevate premium kitchen cabinetry.",
    },
    {
      slug: "door-hardware",
      name: "Door Hardware & Knockers",
      key: "brass_door_knocker",
      description: "Heavy cast brass door handles, statement lion head knockers, and ornate backplates for distinguished entryways.",
    },
    {
      slug: "hooks-brackets",
      name: "Wall Hooks & Brackets",
      key: "brass_hardware",
      description: "Solid cast brass entryway hooks and architectural shelf brackets combining strength with sculptural beauty.",
    },
    // Home Decor
    {
      slug: "vases-planters",
      name: "Vases & Planters",
      key: "brass_home_decor",
      description: "Tall hand-hammered brass vases and botanic planters celebrating raw metallic luster and organic form.",
    },
    {
      slug: "candleholders",
      name: "Candleholders & Stands",
      key: "brass_candleholder",
      description: "Antique engraved brass pillar candlestick holders and tea-light stands that cast warm, romantic ambient light.",
    },
    {
      slug: "trays-boxes",
      name: "Trays & Keepsake Boxes",
      key: "brass_urli_bowl",
      description: "Handcrafted etched brass decorative serving trays and trinket boxes with intricate floral borders.",
    },
    // Serveware
    {
      slug: "thali-sets",
      name: "Thali Dining Sets",
      key: "brass_thali_set",
      description: "Complete royal Indian brass thali dining sets with dinner plates, hammered katoris, glasses, and spoons.",
    },
    {
      slug: "bowls-katoris",
      name: "Bowls & Katoris",
      key: "brass_thali_set",
      description: "Handcrafted brass serving bowls and dessert katoris for dal, curries, kheer, and traditional festive dining.",
    },
    {
      slug: "serving-platters",
      name: "Platters & Trays",
      key: "brass_home_decor",
      description: "Substantial hammered brass serving platters with raised handles for canapés, fruits, and centerpieces.",
    },
    // Gifting
    {
      slug: "corporate-gifts",
      name: "Corporate Gifts",
      key: "copper_gift_box",
      description: "Sophisticated brass and copper desk accessories and wellness gift sets tailored for corporate appreciation.",
    },
    {
      slug: "wedding-gifts",
      name: "Wedding Gifts",
      key: "copper_gift_box",
      description: "Auspicious handcrafted brass and copper wedding gift sets packed in royal satin presentation boxes.",
    },
    {
      slug: "festival-gifts",
      name: "Festival Gifts",
      key: "brass_urli_bowl",
      description: "Curated Diwali and Puja brass gift hampers featuring floating urlis, diyas, and ceremonial vessels.",
    },
    {
      slug: "wellness-gifts",
      name: "Wellness Gifts",
      key: "copper_gift_box",
      description: "Ayurvedic copper water bottles and tumbler wellness sets designed for mindful health and natural living.",
    },
  ];

  for (const sub of SUBCATEGORY_UPDATES) {
    const asset = uploadedUrls[sub.key];
    if (!asset) continue;

    const res = await db.collection("categories").updateOne(
      { slug: sub.slug },
      {
        $set: {
          description: sub.description,
          image: { url: asset.url, publicId: asset.publicId, alt: sub.name },
          banner: { url: asset.url, publicId: asset.publicId, alt: sub.name },
        },
      }
    );
    console.log(`  ✓ Subcategory [${sub.slug}] updated (modified: ${res.modifiedCount})`);
  }

  console.log("\n🎉 All products, categories, and subcategories successfully updated in Cloudinary & MongoDB!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
