"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/products/ProductCard";
import { fetchFeaturedProducts, fetchAllProducts } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const ref = useScrollReveal(".reveal-card");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let items = await fetchFeaturedProducts();
        if (items.length === 0) {
          items = (await fetchAllProducts()).slice(0, 8);
        }
        if (active) {
          setProducts(items.slice(0, 8));
          setStatus("ready");
        }
      } catch (err) {
        console.error("Failed to load featured products", err);
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <SectionHeading label="Fresh Drops" title="Featured Pairs" />
          <Link href="/shop" className="btn-outline self-start sm:self-auto">
            View All
          </Link>
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="h-3 bg-muted mt-4 w-2/3" />
                <div className="h-4 bg-muted mt-2 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="text-ink/50 text-sm">
            Couldn&apos;t load products right now. Check your Supabase configuration in{" "}
            <code>.env.local</code>.
          </p>
        )}

        {status === "ready" && products.length === 0 && (
          <p className="text-ink/50 text-sm">
            No products yet — add your first pair from the admin dashboard.
          </p>
        )}

        {status === "ready" && products.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
              <div key={p.id} className="reveal-card">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
