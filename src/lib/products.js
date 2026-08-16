import { supabase, PRODUCT_IMAGES_BUCKET } from "./supabaseClient";

// DB rows use snake_case columns (idiomatic Postgres); every function here maps
// rows to the same camelCase shape the Firestore version used, so components
// (ProductCard, ProductForm, ShopClient, etc.) never had to change.
function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    category: row.category,
    price: row.price,
    sizes: row.sizes || [],
    description: row.description,
    featured: row.featured,
    sold: row.sold,
    images: row.images || [],
    dpImage: row.dp_image,
    createdAt: row.created_at,
  };
}

export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return mapProduct(data);
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return mapProduct(data);
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      category: product.category,
      price: product.price,
      sizes: product.sizes,
      description: product.description,
      featured: product.featured ?? false,
      sold: product.sold ?? false,
      images: product.images,
      dp_image: product.dpImage,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateProduct(id, product) {
  const payload = {};
  if (product.name !== undefined) payload.name = product.name;
  if (product.slug !== undefined) payload.slug = product.slug;
  if (product.brand !== undefined) payload.brand = product.brand;
  if (product.category !== undefined) payload.category = product.category;
  if (product.price !== undefined) payload.price = product.price;
  if (product.sizes !== undefined) payload.sizes = product.sizes;
  if (product.description !== undefined) payload.description = product.description;
  if (product.featured !== undefined) payload.featured = product.featured;
  if (product.sold !== undefined) payload.sold = product.sold;
  if (product.images !== undefined) payload.images = product.images;
  if (product.dpImage !== undefined) payload.dp_image = product.dpImage;

  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleSoldStatus(id, sold) {
  const { error } = await supabase.from("products").update({ sold }).eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(file, productSlug, label) {
  const path = `${productSlug}/${label}-${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(url) {
  try {
    const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
    const idx = url?.indexOf(marker);
    if (idx === -1 || idx === undefined) return; // not a Supabase Storage URL (e.g. a seeded local /images path)
    const path = url.slice(idx + marker.length);
    const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
    if (error) throw error;
  } catch (err) {
    console.warn("Could not delete storage image:", err?.message);
  }
}
