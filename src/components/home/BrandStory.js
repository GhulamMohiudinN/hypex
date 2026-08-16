"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function BrandStory() {
  const ref = useScrollReveal(".story-reveal");

  return (
    <section ref={ref} className="py-20 sm:py-28 overflow-hidden">
      <div className="container-x grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[420px] sm:h-[520px] story-reveal">
          <Image
            src="/images/products/p26/1.jpg"
            alt="HypeX curated sneakers"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute -bottom-6 -right-6 bg-accent text-paper px-6 py-5 hidden sm:block">
            <p className="font-display text-4xl leading-none">35+</p>
            <p className="text-xs uppercase tracking-widest mt-1">Verified Pairs</p>
          </div>
        </div>

        <div className="story-reveal">
          <p className="section-label">Our Story</p>
          <h2 className="font-display uppercase text-4xl sm:text-5xl leading-[0.95] mb-6">
            Built By Sneakerheads,
            <br /> For Sneakerheads
          </h2>
          <p className="text-ink/60 leading-relaxed mb-4 max-w-lg">
            HypeX started as a small stash of grails traded between friends in Karachi. Today
            we hand-pick, authenticate, and clean every pair before it reaches you — no first
            copies, no guesswork.
          </p>
          <p className="text-ink/60 leading-relaxed mb-8 max-w-lg">
            From Jordan 1s to Yeezys, every drop is inspected for quality and photographed true
            to condition. What you see is exactly what lands at your door.
          </p>
          <Link href="/about" className="btn-primary">
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
