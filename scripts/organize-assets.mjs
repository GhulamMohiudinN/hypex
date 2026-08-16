// One-off asset organizer.
// Groups raw exported images in /assests by their shared "post id" (the number
// right after `hypex.pk_`), copies each group into /public/images/products/<n>/,
// copies the 3 raw videos into /public/videos/, copies the logo into /public/images/,
// and writes /src/data/asset-manifest.json describing the groups so the product
// seed data can reference real image paths.

import { readdirSync, mkdirSync, copyFileSync, statSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "assests");
const OUT_IMAGES = path.join(ROOT, "public", "images", "products");
const OUT_VIDEOS = path.join(ROOT, "public", "videos");
const OUT_PUBLIC_IMAGES = path.join(ROOT, "public", "images");
const OUT_MANIFEST = path.join(ROOT, "src", "data", "asset-manifest.json");

mkdirSync(OUT_IMAGES, { recursive: true });
mkdirSync(OUT_VIDEOS, { recursive: true });
mkdirSync(OUT_PUBLIC_IMAGES, { recursive: true });
mkdirSync(path.join(ROOT, "src", "data"), { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => statSync(path.join(SRC_DIR, f)).isFile());

const groups = new Map(); // postId -> { images: [], videos: [] }
let logoFile = null;

for (const file of files) {
  const lower = file.toLowerCase();
  if (lower.includes("logo")) {
    logoFile = file;
    continue;
  }
  const ext = path.extname(file).toLowerCase();
  const match = file.match(/^hypex\.pk_(\d+)_(\d+)_/i);
  if (!match) continue;
  const postId = match[1];
  const secondaryId = match[2];
  if (!groups.has(postId)) groups.set(postId, { images: [], videos: [] });
  const bucket = groups.get(postId);
  if (ext === ".mp4" || ext === ".mov") {
    bucket.videos.push({ file, secondaryId });
  } else {
    bucket.images.push({ file, secondaryId });
  }
}

// Sort group keys chronologically (they are unix-ish timestamps) for stable ordering
const sortedPostIds = [...groups.keys()].sort((a, b) => Number(a) - Number(b));

const manifest = { products: [], videos: [], logo: null };
let productIndex = 1;

for (const postId of sortedPostIds) {
  const bucket = groups.get(postId);

  // Videos captured separately (hero videos), not treated as a product gallery
  if (bucket.videos.length > 0 && bucket.images.length === 0) {
    for (const v of bucket.videos.sort((a, b) => a.secondaryId.localeCompare(b.secondaryId))) {
      const destName = `hero-${manifest.videos.length + 1}${path.extname(v.file)}`;
      copyFileSync(path.join(SRC_DIR, v.file), path.join(OUT_VIDEOS, destName));
      manifest.videos.push(`/videos/${destName}`);
    }
    continue;
  }

  if (bucket.images.length === 0) continue;

  const productSlug = `p${productIndex}`;
  const destDir = path.join(OUT_IMAGES, productSlug);
  mkdirSync(destDir, { recursive: true });

  const sortedImages = bucket.images.sort((a, b) => a.secondaryId.localeCompare(b.secondaryId));
  const destPaths = [];
  sortedImages.forEach((img, i) => {
    const ext = path.extname(img.file).toLowerCase();
    const destName = `${i + 1}${ext}`;
    copyFileSync(path.join(SRC_DIR, img.file), path.join(destDir, destName));
    destPaths.push(`/images/products/${productSlug}/${destName}`);
  });

  manifest.products.push({
    id: productSlug,
    postId,
    images: destPaths,
  });
  productIndex += 1;
}

if (logoFile) {
  const ext = path.extname(logoFile);
  copyFileSync(path.join(SRC_DIR, logoFile), path.join(OUT_PUBLIC_IMAGES, `logo${ext}`));
  manifest.logo = `/images/logo${ext}`;
}

writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2));

console.log(`Grouped ${manifest.products.length} products, ${manifest.videos.length} hero videos, logo: ${manifest.logo}`);
manifest.products.forEach((p) => console.log(`  ${p.id}: ${p.images.length} images (postId ${p.postId})`));
