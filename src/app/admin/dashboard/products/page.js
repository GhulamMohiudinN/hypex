"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiPlusCircle, FiSearch } from "react-icons/fi";
import { fetchAllProducts, deleteProduct, toggleSoldStatus, deleteProductImage } from "@/lib/products";
import { formatPKR } from "@/lib/format";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");

  const load = async () => {
    setStatus("loading");
    try {
      const items = await fetchAllProducts();
      setProducts(items);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (product) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `Delete "${product.name}"?`,
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#4a4a4a",
    });
    if (!confirm.isConfirmed) return;

    try {
      await Promise.all((product.images || []).map((url) => deleteProductImage(url)));
      await deleteProduct(product.id);
      setProducts((p) => p.filter((x) => x.id !== product.id));
      toast.success("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete product");
    }
  };

  const handleToggleSold = async (product) => {
    try {
      await toggleSoldStatus(product.id, !product.sold);
      setProducts((p) => p.map((x) => (x.id === product.id ? { ...x, sold: !x.sold } : x)));
      toast.success(product.sold ? "Marked as available" : "Marked as sold");
    } catch (err) {
      console.error(err);
      toast.error("Could not update product");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display uppercase text-3xl">Products ({products.length})</h1>
        <Link href="/admin/dashboard/products/new" className="btn-accent">
          <FiPlusCircle className="mr-2" /> Add Product
        </Link>
      </div>

      <div className="relative max-w-sm mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
        />
      </div>

      <div className="bg-paper border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/40 border-b border-border">
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={6} className="p-4">
                    <div className="h-8 bg-muted animate-pulse" />
                  </td>
                </tr>
              ))}

            {status === "ready" &&
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-none">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-muted shrink-0">
                        {p.dpImage || p.images?.[0] ? (
                          <Image src={p.dpImage || p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                        ) : null}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-ink/60">{p.brand}</td>
                  <td className="p-4 text-ink/60">{p.category}</td>
                  <td className="p-4">{formatPKR(p.price)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleSold(p)}
                      className={`text-[11px] uppercase tracking-wide px-2.5 py-1 font-medium cursor-pointer ${
                        p.sold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.sold ? "Sold Out" : "In Stock"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/dashboard/products/${p.id}/edit`}
                        className="text-ink/50 hover:text-ink cursor-pointer"
                        aria-label="Edit"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-ink/50 hover:text-accent cursor-pointer"
                        aria-label="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {status === "ready" && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink/40">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
