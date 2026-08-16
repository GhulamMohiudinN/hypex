"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiStar, FiTrash2, FiSearch } from "react-icons/fi";
import { fetchAllReviews, deleteReview } from "@/lib/reviews";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchAllReviews();
        setReviews(items);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    })();
  }, []);

  const handleDelete = async (review) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this review?",
      text: `${review.name}'s review on "${review.productName}" will be removed permanently.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e31937",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteReview(review.id);
      setReviews((r) => r.filter((x) => x.id !== review.id));
      toast.success("Review deleted");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete review");
    }
  };

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.productName?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 className="font-display uppercase text-3xl mb-8">Reviews ({reviews.length})</h1>

      <div className="relative max-w-sm mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, product, comment..."
          className="w-full pl-9 pr-4 py-2.5 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
        />
      </div>

      {status === "loading" && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-accent text-sm">
          Could not load reviews. Check your Supabase configuration.
        </p>
      )}

      {status === "ready" && filtered.length === 0 && (
        <p className="text-ink/40 text-sm py-12 text-center">No reviews found.</p>
      )}

      {status === "ready" && filtered.length > 0 && (
        <ul className="space-y-4">
          {filtered.map((review) => (
            <li key={review.id} className="bg-paper border border-border p-5 flex gap-4">
              <div className="relative w-14 h-14 bg-muted shrink-0">
                {review.productImage && (
                  <Image src={review.productImage} alt={review.productName || ""} fill className="object-cover" sizes="56px" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div>
                    <span className="font-display uppercase text-sm">{review.name}</span>
                    {review.productSlug ? (
                      <Link
                        href={`/shop/${review.productSlug}`}
                        target="_blank"
                        className="ml-2 text-xs text-accent hover:underline"
                      >
                        on {review.productName}
                      </Link>
                    ) : (
                      <span className="ml-2 text-xs text-ink/40">on {review.productName || "a deleted product"}</span>
                    )}
                  </div>
                  <div className="flex gap-0.5 text-accent shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} size={12} className={i < review.rating ? "fill-current" : "opacity-20"} />
                    ))}
                  </div>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed">{review.comment}</p>
              </div>

              <button
                onClick={() => handleDelete(review)}
                className="text-ink/30 hover:text-accent transition-colors cursor-pointer h-fit shrink-0"
                aria-label="Delete review"
              >
                <FiTrash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
