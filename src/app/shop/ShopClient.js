"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import ProductCard from "@/components/products/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { fetchAllProducts } from "@/lib/products";

export default function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    brand: "All",
    search: "",
    sort: "newest",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await fetchAllProducts();
        if (active) {
          setProducts(items);
          setStatus("ready");
        }
      } catch (err) {
        console.error("Failed to load products", err);
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.category !== "All") {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.brand !== "All") {
      list = list.filter((p) => p.brand === filters.brand);
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      );
    }
    if (filters.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, filters]);

  useEffect(() => {
    if (status !== "ready") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".shop-card", {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [filtered, status]);

  return (
    <div className="pt-32 pb-24">
      <div className="container-x">
        <div className="mb-10">
          <p className="section-label">The Collection</p>
          <h1 className="font-display uppercase text-5xl sm:text-6xl">All Sneakers</h1>
        </div>

        <ShopFilters
          categories={categories}
          brands={brands}
          filters={filters}
          setFilters={setFilters}
          resultsCount={filtered.length}
          loading={status === "loading"}
        />

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
            Couldn&apos;t load products. Check your Supabase configuration in{" "}
            <code>.env.local</code>.
          </p>
        )}

        {status === "ready" && filtered.length === 0 && (
          <p className="text-ink/50 text-sm py-20 text-center">
            No sneakers match your filters.
          </p>
        )}

        {status === "ready" && filtered.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((p) => (
              <div key={p.id} className="shop-card">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
