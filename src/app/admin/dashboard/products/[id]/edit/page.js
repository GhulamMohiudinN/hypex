"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { fetchProductById } from "@/lib/products";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchProductById(id);
        if (active) {
          setProduct(data);
          setStatus("ready");
        }
      } catch (err) {
        console.error(err);
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div>
      <h1 className="font-display uppercase text-3xl mb-8">Edit Product</h1>
      {status === "loading" && <p className="text-ink/50">Loading...</p>}
      {status === "error" && <p className="text-accent">Could not load product.</p>}
      {status === "ready" && product && <ProductForm product={product} />}
    </div>
  );
}
