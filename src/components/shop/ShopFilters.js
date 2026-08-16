"use client";

import { FiSearch, FiX } from "react-icons/fi";

export default function ShopFilters({
  categories,
  brands,
  filters,
  setFilters,
  resultsCount,
  loading,
}) {
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const hasActiveFilters =
    filters.category !== "All" || filters.brand !== "All" || filters.search;

  return (
    <div className="mb-10">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search sneakers, brands..."
            className="w-full pl-9 pr-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => update("category", c)}
              className={`px-4 py-2 text-xs font-display uppercase tracking-wide border transition-colors cursor-pointer ${
                filters.category === c
                  ? "bg-ink text-paper border-ink"
                  : "border-border text-ink/60 hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={filters.brand}
          onChange={(e) => update("brand", e.target.value)}
          className="px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink lg:ml-auto"
        >
          <option value="All">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="px-4 py-3 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-ink/40">{loading ? "Loading..." : `${resultsCount} pairs found`}</p>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters({ category: "All", brand: "All", search: "", sort: "newest" })}
            className="flex items-center gap-1 text-xs text-accent hover:underline cursor-pointer"
          >
            <FiX size={12} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
