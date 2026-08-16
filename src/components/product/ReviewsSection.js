"use client";

import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { fetchReviewsForProduct, addReview } from "@/lib/reviews";

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await fetchReviewsForProduct(productId);
        if (active) {
          setReviews(items);
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
  }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      toast.error("Please fill in your name and review");
      return;
    }
    setSubmitting(true);
    try {
      await addReview({ productId, ...form });
      setReviews((r) => [{ ...form, id: Date.now().toString(), createdAt: null }, ...r]);
      setForm({ name: "", rating: 5, comment: "" });
      toast.success("Thanks for your review!");
    } catch (err) {
      console.error(err);
      toast.error("Could not submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-display uppercase text-2xl">Reviews</h3>
        {avgRating && (
          <span className="flex items-center gap-1 text-sm text-ink/60">
            <FiStar className="fill-current text-accent" size={14} /> {avgRating} ({reviews.length})
          </span>
        )}
      </div>

      {status === "ready" && reviews.length > 0 && (
        <ul className="space-y-6 mb-10">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-border pb-6">
              <div className="flex items-center justify-between mb-1">
                <p className="font-display uppercase text-sm">{r.name}</p>
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={12} className={i < r.rating ? "fill-current" : "opacity-20"} />
                  ))}
                </div>
              </div>
              <p className="text-ink/60 text-sm leading-relaxed">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {status === "ready" && reviews.length === 0 && (
        <p className="text-ink/40 text-sm mb-10">No reviews yet. Be the first to review this pair.</p>
      )}

      <form onSubmit={handleSubmit} className="border border-border p-6 space-y-4">
        <h4 className="font-display uppercase text-sm">Write a Review</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="px-4 py-3 bg-bg border border-border text-sm focus:outline-none focus:border-ink"
          />
          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setForm((f) => ({ ...f, rating: i + 1 }))}
                className="cursor-pointer"
                aria-label={`Rate ${i + 1} stars`}
              >
                <FiStar
                  size={20}
                  className={i < form.rating ? "fill-current text-accent" : "text-ink/20"}
                />
              </button>
            ))}
          </div>
        </div>
        <textarea
          placeholder="Share your experience with this pair..."
          value={form.comment}
          onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 bg-bg border border-border text-sm focus:outline-none focus:border-ink resize-none"
        />
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
