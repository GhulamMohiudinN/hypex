"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCartStore } from "@/store/useCartStore";
import { formatPKR } from "@/lib/format";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);

  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(panelRef.current, { xPercent: 100 });
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
      gsap.to(panelRef.current, { xPercent: 0, duration: 0.5, ease: "power3.out" });
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(panelRef.current, { xPercent: 100, duration: 0.4, ease: "power3.in" });
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, onComplete: closeCart });
  };

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-paper flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-border">
          <h3 className="font-display uppercase text-2xl">Your Bag ({items.length})</h3>
          <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center cursor-pointer" aria-label="Close cart">
            <FiX size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <p className="text-ink/50">Your bag is empty.</p>
              <button onClick={handleClose} className="btn-outline">
                <Link href="/shop">Continue Shopping</Link>
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4">
                  <div className="relative w-24 h-24 bg-muted shrink-0 overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-ink/40">{item.brand}</p>
                    <p className="font-display uppercase text-sm truncate">{item.name}</p>
                    <p className="text-xs text-ink/50 mt-0.5">Size US {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => decreaseQty(item.key)}
                          className="w-7 h-7 flex items-center justify-center cursor-pointer hover:text-accent"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => increaseQty(item.key)}
                          className="w-7 h-7 flex items-center justify-center cursor-pointer hover:text-accent"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <span className="font-semibold text-sm">{formatPKR(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-ink/30 hover:text-accent transition-colors cursor-pointer h-fit"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-6 space-y-4">
            <div className="flex justify-between font-display uppercase text-lg">
              <span>Subtotal</span>
              <span>{formatPKR(total)}</span>
            </div>
            <p className="text-xs text-ink/40">Shipping & COD charges calculated at checkout.</p>
            <Link href="/checkout" onClick={handleClose} className="btn-accent w-full">
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
