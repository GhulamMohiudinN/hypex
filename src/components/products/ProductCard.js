"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPKR } from "@/lib/format";

export default function ProductCard({ product }) {
  const image = product.dpImage || product.images?.[0];
  const hoverImage = product.images?.[1] || image;

  return (
    <Link href={`/shop/${product.slug}`} className="group block product-card">
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.sold && (
          <span className="absolute top-3 left-3 z-10 bg-ink text-paper text-[10px] font-display uppercase tracking-widest px-3 py-1.5">
            Sold Out
          </span>
        )}
        {image && (
          <>
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <Image
              src={hoverImage}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover absolute inset-0 opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
            />
          </>
        )}
      </div>
      <div className="pt-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-ink/40">{product.brand}</p>
          <h3 className="font-display uppercase text-base leading-tight truncate group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </div>
        <span className="font-semibold text-sm shrink-0">{formatPKR(product.price)}</span>
      </div>
    </Link>
  );
}
