"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { fetchAllProducts } from "@/lib/products";

export default function RelatedProducts({ product }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await fetchAllProducts();
        const filtered = all
          .filter((p) => p.id !== product.id)
          .filter((p) => p.category === product.category || p.brand === product.brand)
          .slice(0, 4);
        if (active) setRelated(filtered);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      active = false;
    };
  }, [product]);

  if (related.length === 0) return null;

  return (
    <div>
      <h3 className="font-display uppercase text-2xl mb-8">You May Also Like</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
