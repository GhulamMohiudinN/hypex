// Seeds the initial 35 products (organized by scripts/organize-assets.mjs) into
// Supabase. Uses the service_role key so it bypasses Row Level Security — never
// expose that key to the browser, it's only ever read here, server-side.
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Supabase Dashboard ->
// Project Settings -> API -> service_role secret) in addition to the
// NEXT_PUBLIC_SUPABASE_URL already used by the app.
//
// Run with: npm run seed

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.local");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "asset-manifest.json");

function loadEnvLocal() {
  if (!existsSync(ENV_PATH)) return;
  const lines = readFileSync(ENV_PATH, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "\nMissing NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "Get the service_role key from Supabase Dashboard -> Project Settings -> API,\n" +
      "and add it as SUPABASE_SERVICE_ROLE_KEY=... in .env.local (it is gitignored).\n"
  );
  process.exit(1);
}

const SNEAKER_SIZES = [40, 41, 42, 43, 44, 45];
const SANDAL_SIZES = [38, 39, 40, 41, 42, 43];
const BOOT_SIZES = [40, 41, 42, 43, 44];

const catalogSeed = [
  { id: "p1", name: "Air Jordan 1 Low – Fragment Blue", brand: "Jordan", category: "Sneakers", price: 9500, sizes: SNEAKER_SIZES, featured: true },
  { id: "p2", name: "Dunk Low SB – Raygun Tie-Dye", brand: "Nike SB", category: "Sneakers", price: 8000, sizes: SNEAKER_SIZES },
  { id: "p3", name: "Arizona Buckle Sandals – Brown", brand: "Birkenstock", category: "Sandals", price: 3200, sizes: SANDAL_SIZES },
  { id: "p4", name: "Dunk Low SB – Purple Box", brand: "Nike SB", category: "Sneakers", price: 8200, sizes: SNEAKER_SIZES },
  { id: "p5", name: "Grand Court Sneakers – White Navy", brand: "Adidas", category: "Sneakers", price: 4500, sizes: SNEAKER_SIZES },
  { id: "p6", name: "530 Runner – Silver Red", brand: "New Balance", category: "Sneakers", price: 6500, sizes: SNEAKER_SIZES },
  { id: "p7", name: "XC-72 Trail Runner – Navy Red", brand: "New Balance", category: "Sneakers", price: 6800, sizes: SNEAKER_SIZES },
  { id: "p8", name: "Dunk Low SB – TightBooth", brand: "Nike SB", category: "Sneakers", price: 8300, sizes: SNEAKER_SIZES, featured: true },
  { id: "p9", name: "Air Jordan 1 Low – Blue Moon", brand: "Jordan", category: "Sneakers", price: 9200, sizes: SNEAKER_SIZES },
  { id: "p10", name: "6-Inch Premium Boot – Wheat", brand: "Timberland", category: "Boots", price: 7500, sizes: BOOT_SIZES },
  { id: "p11", name: "Dunk Low – Panda", brand: "Nike", category: "Sneakers", price: 7800, sizes: SNEAKER_SIZES, featured: true },
  { id: "p12", name: "Arizona Runner – Silver", brand: "Puma", category: "Sneakers", price: 5200, sizes: SNEAKER_SIZES },
  { id: "p13", name: "Skel-Top Low – Blue", brand: "Amiri", category: "Sneakers", price: 12000, sizes: SNEAKER_SIZES },
  { id: "p14", name: "Campus 00s – Sand Monogram", brand: "Adidas", category: "Sneakers", price: 6200, sizes: SNEAKER_SIZES },
  { id: "p15", name: "Dunk Low SB – Instrument", brand: "Nike SB", category: "Sneakers", price: 8100, sizes: SNEAKER_SIZES },
  { id: "p16", name: "Dunk Low – Varsity Green", brand: "Nike", category: "Sneakers", price: 7900, sizes: SNEAKER_SIZES },
  { id: "p17", name: "Air Jordan 1 Low – Bred Toe", brand: "Jordan", category: "Sneakers", price: 9800, sizes: SNEAKER_SIZES, featured: true },
  { id: "p18", name: "Style 36 – Cream Blue", brand: "Vans", category: "Sneakers", price: 4200, sizes: SNEAKER_SIZES },
  { id: "p19", name: "Air Jordan 1 Low – Fragment Cream", brand: "Jordan", category: "Sneakers", price: 9600, sizes: SNEAKER_SIZES },
  { id: "p20", name: "Air Force 1 Low – White Black", brand: "Nike", category: "Sneakers", price: 6900, sizes: SNEAKER_SIZES },
  { id: "p21", name: "Air Jordan 1 Low – Triple Black", brand: "Jordan", category: "Sneakers", price: 9000, sizes: SNEAKER_SIZES, sold: true },
  { id: "p22", name: "Dunk Low SB – Green Clover", brand: "Nike SB", category: "Sneakers", price: 8400, sizes: SNEAKER_SIZES },
  { id: "p23", name: "1906R – Silver Green", brand: "New Balance", category: "Sneakers", price: 7200, sizes: SNEAKER_SIZES },
  { id: "p24", name: "Dunk Low – Pink Rust", brand: "Nike", category: "Sneakers", price: 7600, sizes: SNEAKER_SIZES },
  { id: "p25", name: "Air Jordan 1 Low – Easter Pastel", brand: "Jordan", category: "Sneakers", price: 9700, sizes: SNEAKER_SIZES, featured: true },
  { id: "p26", name: "Air Jordan 3 Retro – Pine Green", brand: "Jordan", category: "Sneakers", price: 11500, sizes: SNEAKER_SIZES },
  { id: "p27", name: "Suede Classic – Burgundy", brand: "Puma", category: "Sneakers", price: 4800, sizes: SNEAKER_SIZES },
  { id: "p28", name: "Air Jordan 1 Low – Arctic Punch", brand: "Jordan", category: "Sneakers", price: 9300, sizes: SNEAKER_SIZES, sold: true },
  { id: "p29", name: "Chuck 70 Low – Black", brand: "Converse", category: "Sneakers", price: 5400, sizes: SNEAKER_SIZES },
  { id: "p30", name: "B23 Oblique Low-Top – Grey", brand: "Dior", category: "Sneakers", price: 18500, sizes: SNEAKER_SIZES, featured: true },
  { id: "p31", name: "Air Force 1 Low – White Gum", brand: "Nike", category: "Sneakers", price: 6700, sizes: SNEAKER_SIZES },
  { id: "p32", name: "Racing Cat Sneakers – Navy", brand: "Puma", category: "Sneakers", price: 5600, sizes: SNEAKER_SIZES },
  { id: "p33", name: "Dunk Low – Grey Fog", brand: "Nike", category: "Sneakers", price: 7700, sizes: SNEAKER_SIZES },
  { id: "p34", name: "Campus 00s – Grey Blue", brand: "Adidas", category: "Sneakers", price: 6300, sizes: SNEAKER_SIZES },
  { id: "p35", name: "Yeezy Boost 350 V2 – Natural", brand: "Adidas", category: "Sneakers", price: 15500, sizes: SNEAKER_SIZES, featured: true },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function descriptionFor(item) {
  return `Authentic pre-loved ${item.brand} ${item.name.split("–")[0].trim()} in the "${item.name.split("–")[1]?.trim() ?? "signature"}" colorway. Carefully inspected and cleaned before listing — a genuine pair, not a first copy. Cash on delivery available across Pakistan.`;
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  // supabase-js always spins up a Realtime client under the hood, which needs a
  // WebSocket implementation. Node 20 has no global WebSocket (Node 22+ does), so
  // without this it throws immediately even though this script never uses Realtime.
  realtime: { transport: ws },
});

async function seed() {
  const imagesByProductId = new Map(manifest.products.map((p) => [p.id, p.images]));

  const { data: existing, error: fetchError } = await supabase.from("products").select("slug");
  if (fetchError) throw fetchError;
  const existingSlugs = new Set((existing || []).map((r) => r.slug));

  const rows = [];
  for (const item of catalogSeed) {
    const images = imagesByProductId.get(item.id) || [];
    if (images.length === 0) {
      console.warn(`Skipping ${item.id} — no images found in manifest`);
      continue;
    }
    const slug = slugify(item.name);
    if (existingSlugs.has(slug)) continue;

    rows.push({
      name: item.name,
      slug,
      brand: item.brand,
      category: item.category,
      price: item.price,
      sizes: item.sizes,
      description: descriptionFor(item),
      featured: item.featured ?? false,
      sold: item.sold ?? false,
      images,
      dp_image: images[0],
    });
  }

  if (rows.length === 0) {
    console.log("\nNothing to seed — all products already exist.\n");
    return;
  }

  const { error: insertError } = await supabase.from("products").insert(rows);
  if (insertError) throw insertError;

  console.log(`\nSeed complete: ${rows.length} products created, ${catalogSeed.length - rows.length} already existed.\n`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
