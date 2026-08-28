"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/lib/orders";
import { formatPKR } from "@/lib/format";

const SHIPPING_FEE = 250;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const total = items.length ? subtotal + SHIPPING_FEE : 0;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#111111",
      });
      return;
    }
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const orderId = await createOrder({
        customer: form,
        items: items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          name: i.name,
          brand: i.brand,
          price: i.price,
          size: i.size,
          qty: i.qty,
          image: i.image,
        })),
        subtotal,
        shipping: SHIPPING_FEE,
        total,
        paymentMethod: "Cash on Delivery",
      });

      clearCart();

      await Swal.fire({
        icon: "success",
        title: "Order Placed!",
        html: `Thank you ${form.name}! Your order <b>#${orderId.slice(0, 8).toUpperCase()}</b> has been received.<br/>We'll call you at ${form.phone} to confirm delivery.`,
        confirmButtonText: "Continue Shopping",
        confirmButtonColor: "#4a4a4a",
      });

      router.push("/shop");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Could not place your order. Please try again.",
        confirmButtonColor: "#111111",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh]">
        <div className="container-x text-center py-20">
          <p className="text-ink/50 mb-6">Your bag is empty — add something before checking out.</p>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container-x">
        <p className="section-label">Almost There</p>
        <h1 className="font-display uppercase text-5xl sm:text-6xl mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <h3 className="font-display uppercase text-xl mb-2">Delivery Details</h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-wide text-ink/50 block mb-2">Full Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-ink/50 block mb-2">Phone Number *</label>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  className="w-full px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-ink/50 block mb-2">Delivery Address *</label>
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="House #, Street, Area"
                className="w-full px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-ink/50 block mb-2">City *</label>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Karachi, Lahore, Islamabad..."
                className="w-full px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-ink/50 block mb-2">Order Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink resize-none"
              />
            </div>

            <div className="bg-muted border border-border p-4 text-sm text-ink/60">
              Payment Method: <span className="font-semibold text-ink">Cash on Delivery</span> — pay when
              your order arrives.
            </div>

            <p className="text-xs text-ink/40">
              By placing this order you agree to our exchange policy: exchange only for verified
              issues, no refunds or returns.
            </p>

            <button type="submit" disabled={submitting} className="btn-accent w-full sm:w-auto disabled:opacity-50">
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="border border-border p-6 h-fit">
            <h3 className="font-display uppercase text-xl mb-6">Order Summary</h3>
            <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <li key={item.key} className="flex justify-between text-sm">
                  <span className="text-ink/60 truncate pr-2">
                    {item.name} × {item.qty} (US {item.size})
                  </span>
                  <span className="shrink-0">{formatPKR(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">Shipping</span>
                <span>{formatPKR(SHIPPING_FEE)}</span>
              </div>
              <div className="flex justify-between font-display uppercase text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
