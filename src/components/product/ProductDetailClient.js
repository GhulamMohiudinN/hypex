"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiCheck, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import ImageGallery from "./ImageGallery";
import ReviewsSection from "./ReviewsSection";
import RelatedProducts from "./RelatedProducts";
import { useCartStore } from "@/store/useCartStore";
import { formatPKR } from "@/lib/format";

export default function ProductDetailClient({ product }) {
  const [size, setSize] = useState(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setSize(null);
  }, [product.id]);

  const handleAddToCart = () => {
    if (product.sold) return;
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    addItem(product, size, 1);
    toast.success(`${product.name} added to bag`);
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container-x">
        <div className="text-xs text-ink/40 mb-8 flex items-center gap-2">
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ImageGallery images={product.images || []} name={product.name} />

          <div>
            <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">{product.brand}</p>
            <h1 className="font-display uppercase text-4xl sm:text-5xl leading-[0.95] mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold mb-6">{formatPKR(product.price)}</p>

            {product.sold ? (
              <span className="inline-block bg-ink text-paper text-xs font-display uppercase tracking-widest px-4 py-2 mb-6">
                Sold Out
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-success text-xs font-medium mb-6">
                <FiCheck size={14} /> In Stock &amp; Ready to Ship
              </span>
            )}

            <p className="text-ink/60 leading-relaxed mb-8 max-w-lg">{product.description}</p>

            {!product.sold && (
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-ink/50 mb-3">
                  Select Size (US)
                </p>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || []).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-14 h-12 flex items-center justify-center border text-sm transition-colors cursor-pointer ${
                        size === s
                          ? "bg-ink text-paper border-ink"
                          : "border-border hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.sold}
              className="btn-accent w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.sold ? "Sold Out" : "Add to Bag"}
            </button>

            <div className="grid sm:grid-cols-2 gap-4 mt-10 pt-8 border-t border-border">
              <div className="flex items-start gap-3">
                <FiTruck className="mt-0.5 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-ink/50">Available nationwide, 2-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiShield className="mt-0.5 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-medium">Expert Verified OG</p>
                  <p className="text-xs text-ink/50">100% authentic, checked before every dispatch</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <FiRefreshCw className="mt-0.5 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-medium">Strong Exchange Policy</p>
                  <p className="text-xs text-ink/50">Exchange only for verified issues — no refunds or returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <ReviewsSection productId={product.id} />
        </div>

        <div className="mt-24">
          <RelatedProducts product={product} />
        </div>
      </div>
    </div>
  );
}
