"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiStar } from "react-icons/fi";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { fetchAllReviews } from "@/lib/reviews";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");
  const ref = useScrollReveal(".testi-card");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await fetchAllReviews({ limit: 8 });
        if (active) {
          setReviews(items);
          setStatus("ready");
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // No fake/placeholder testimonials — if nobody has reviewed a pair yet, the
  // section just doesn't render rather than showing made-up quotes.
  if (status === "ready" && reviews.length === 0) return null;
  if (status === "error") return null;

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-ink">
      <div className="container-x">
        <SectionHeading label="Reviews" title="What Our Customers Say" light align="center" />

        {status === "loading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        )}

        {status === "ready" && reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {reviews.map((review) => (
              <div key={review.id} className="testi-card bg-white/5 border border-white/10 p-6">
                <div className="flex gap-1 text-accent mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className={i < review.rating ? "fill-current" : "opacity-20"} size={14} />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="font-display uppercase text-sm text-paper">{review.name}</p>
                {review.productSlug ? (
                  <Link
                    href={`/shop/${review.productSlug}`}
                    className="text-white/40 text-xs hover:text-accent transition-colors"
                  >
                    {review.productName}
                  </Link>
                ) : (
                  <p className="text-white/40 text-xs">{review.productName}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
