"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiUploadCloud, FiX, FiStar, FiTrash2 } from "react-icons/fi";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
} from "@/lib/products";
import { slugify, descriptionFor } from "@/lib/productText";

const CATEGORIES = ["Sneakers", "Sandals", "Boots"];
const DEFAULT_SIZES = "40, 41, 42, 43, 44, 45";

export default function ProductForm({ product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "Sneakers",
    price: product?.price || "",
    sizes: product?.sizes?.join(", ") || DEFAULT_SIZES,
    description: product?.description || "",
    featured: product?.featured || false,
    sold: product?.sold || false,
  });
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const slug = slugify(form.name || "product");
      const uploaded = [];
      for (const file of files) {
        const url = await uploadProductImage(file, slug, "img");
        uploaded.push(url);
      }
      setImages((imgs) => [...imgs, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed. Check Supabase Storage setup.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = async (idx) => {
    const url = images[idx];
    setImages((imgs) => imgs.filter((_, i) => i !== idx));
    await deleteProductImage(url);
  };

  const makeDp = (idx) => {
    setImages((imgs) => {
      const copy = [...imgs];
      const [chosen] = copy.splice(idx, 1);
      return [chosen, ...copy];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price) {
      toast.error("Please fill in name, brand and price");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setSaving(true);
    try {
      const sizes = form.sizes
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n));

      const payload = {
        name: form.name,
        slug: slugify(form.name),
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        sizes,
        description: form.description || descriptionFor({ brand: form.brand, name: form.name }),
        featured: form.featured,
        sold: form.sold,
        images,
        dpImage: images[0],
      };

      if (isEdit) {
        await updateProduct(product.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product added");
      }
      router.push("/admin/dashboard/products");
    } catch (err) {
      console.error(err);
      toast.error("Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this product?",
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#4a4a4a",
    });
    if (!confirm.isConfirmed) return;

    try {
      await Promise.all(images.map((url) => deleteProductImage(url)));
      await deleteProduct(product.id);
      toast.success("Product deleted");
      router.push("/admin/dashboard/products");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-paper border border-border p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Product Name *">
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="input"
              placeholder="Air Jordan 1 Low – Bred Toe"
            />
          </Field>
          <Field label="Brand *">
            <input
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              className="input"
              placeholder="Jordan"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Category">
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Price (PKR) *">
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="input"
              placeholder="9500"
            />
          </Field>
          <Field label="Sizes (comma separated)">
            <input
              value={form.sizes}
              onChange={(e) => update("sizes", e.target.value)}
              className="input"
              placeholder="40, 41, 42"
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="input resize-none"
            placeholder="Condition notes, colorway details..."
          />
        </Field>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="w-4 h-4"
            />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.sold}
              onChange={(e) => update("sold", e.target.checked)}
              className="w-4 h-4"
            />
            Mark as sold
          </label>
        </div>
      </div>

      <div className="bg-paper border border-border p-6 space-y-5 h-fit">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50 mb-3">
            Product Images (first = display picture)
          </p>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border py-8 cursor-pointer hover:border-ink transition-colors">
            <FiUploadCloud size={22} className="text-ink/40" />
            <span className="text-xs text-ink/50">{uploading ? "Uploading..." : "Click to upload images"}</span>
            <input type="file" accept="image/*" multiple hidden onChange={handleFiles} disabled={uploading} />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((url, i) => (
              <div key={url + i} className="relative aspect-square group">
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="120px" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-accent text-white text-[9px] px-1.5 py-0.5">DP</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeDp(i)}
                      className="w-6 h-6 bg-white text-ink flex items-center justify-center cursor-pointer"
                      title="Make display picture"
                    >
                      <FiStar size={11} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="w-6 h-6 bg-white text-accent flex items-center justify-center cursor-pointer"
                    title="Remove"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={saving || uploading} className="btn-accent w-full disabled:opacity-50">
          {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 w-full text-sm text-accent hover:underline cursor-pointer"
          >
            <FiTrash2 size={14} /> Delete Product
          </button>
        )}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: var(--color-ink);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-ink/50 block mb-2">{label}</label>
      {children}
    </div>
  );
}
