import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export async function generateMetadata({ params }) {
  try {
    const product = await fetchProductBySlug(params.slug);
    if (!product) return { title: "Product Not Found" };
    return {
      title: product.name,
      description: product.description,
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }) {
  let product = null;
  try {
    product = await fetchProductBySlug(params.slug);
  } catch (err) {
    console.error("Failed to fetch product", err);
  }

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
