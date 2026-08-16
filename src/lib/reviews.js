import { supabase } from "./supabaseClient";

function mapReview(row) {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.products?.name,
    productSlug: row.products?.slug,
    productImage: row.products?.dp_image,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export async function fetchReviewsForProduct(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapReview);
}

// Every review across every product, newest first — used by the admin dashboard
// (unbounded) and the homepage testimonials section (small `limit`).
export async function fetchAllReviews({ limit } = {}) {
  let query = supabase
    .from("reviews")
    .select("*, products(name, slug, dp_image)")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapReview);
}

export async function addReview({ productId, name, rating, comment }) {
  const { data, error } = await supabase
    .from("reviews")
    .insert({ product_id: productId, name, rating, comment })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function deleteReview(id) {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}
