import { supabase } from "./supabaseClient";

function mapOrder(row) {
  return {
    id: row.id,
    customer: row.customer,
    items: row.items,
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createOrder(order) {
  // Customers can only INSERT orders (not SELECT them back — that's admin-only, so one
  // shopper can't read another's name/address). Generating the id here means we never
  // need a post-insert `.select()`, which would otherwise be blocked by that same RLS
  // policy and fail even though the order was created successfully.
  const id = crypto.randomUUID();

  const { error } = await supabase.from("orders").insert({
    id,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    payment_method: order.paymentMethod,
    status: "pending",
  });
  if (error) throw error;
  return id;
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapOrder);
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}
