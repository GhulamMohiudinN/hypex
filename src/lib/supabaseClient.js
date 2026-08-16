import { createClient } from "@supabase/supabase-js";

// Fall back to harmless placeholders instead of throwing when env vars aren't set yet
// (createClient throws synchronously on an empty URL, which would crash `next build`'s
// route analysis before the storefront even loads). Real requests against a placeholder
// simply fail as a normal network error, which the calling code already catches.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const PRODUCT_IMAGES_BUCKET = "products";
