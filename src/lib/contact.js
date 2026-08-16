import { supabase } from "./supabaseClient";

export async function submitContactMessage({ name, email, message }) {
  const { error } = await supabase.from("messages").insert({ name, email, message });
  if (error) throw error;
}
