"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CtaBanner() {
  const ref = useScrollReveal(".cta-reveal");

  return (
    <section ref={ref} className="py-24 sm:py-32 relative overflow-hidden bg-accent">
      <div className="container-x text-center relative z-10">
        <p className="cta-reveal text-white/80 uppercase tracking-[0.3em] text-xs mb-4">
          Cash On Delivery &middot; All Over Pakistan
        </p>
        <h2 className="cta-reveal font-display uppercase text-white text-5xl sm:text-7xl leading-[0.9] mb-8">
          Your Next Grail
          <br /> Is Waiting
        </h2>
        <Link
          href="/shop"
          className="cta-reveal inline-flex items-center justify-center bg-ink text-paper font-display uppercase tracking-wide px-8 py-4 text-sm hover:bg-white hover:text-ink transition-all duration-300"
        >
          Shop The Full Collection
        </Link>
      </div>
    </section>
  );
}
