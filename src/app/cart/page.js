"use client";

import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCartStore } from "@/store/useCartStore";
import { formatPKR } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div className="pt-32 pb-24 min-h-[70vh]">
      <div className="container-x">
        <p className="section-label">Your Bag</p>
        <h1 className="font-display uppercase text-5xl sm:text-6xl mb-12">Shopping Bag</h1>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink/50 mb-6">Your bag is currently empty.</p>
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 divide-y divide-border border-t border-b border-border">
              {items.map((item) => (
                <div key={item.key} className="flex gap-5 py-6">
                  <div className="relative w-28 h-28 bg-muted shrink-0 overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-ink/40">{item.brand}</p>
                    <p className="font-display uppercase text-base truncate">{item.name}</p>
                    <p className="text-sm text-ink/50 mt-1">Size US {item.size}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border">
                        <button onClick={() => decreaseQty(item.key)} className="w-9 h-9 flex items-center justify-center cursor-pointer hover:text-accent">
                          <FiMinus size={13} />
                        </button>
                        <span className="w-9 text-center text-sm">{item.qty}</span>
                        <button onClick={() => increaseQty(item.key)} className="w-9 h-9 flex items-center justify-center cursor-pointer hover:text-accent">
                          <FiPlus size={13} />
                        </button>
                      </div>
                      <span className="font-semibold">{formatPKR(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-ink/30 hover:text-accent transition-colors cursor-pointer h-fit">
                    <FiTrash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border border-border p-6 h-fit">
              <h3 className="font-display uppercase text-xl mb-6">Order Summary</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-ink/60">Subtotal</span>
                <span>{formatPKR(total)}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-ink/60">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-display uppercase text-lg border-t border-border pt-4 mb-6">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
              <Link href="/checkout" className="btn-accent w-full">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
