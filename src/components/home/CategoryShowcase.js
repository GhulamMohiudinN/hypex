"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CATEGORIES = [
  { name: "Sneakers", href: "/shop?category=Sneakers", image: "/images/products/p17/1.jpg" },
  { name: "Sandals", href: "/shop?category=Sandals", image: "/images/products/p3/1.jpg" },
  { name: "Boots", href: "/shop?category=Boots", image: "/images/products/p10/1.jpg" },
];

export default function CategoryShowcase() {
  const ref = useScrollReveal(".cat-tile");

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-muted/60">
      <div className="container-x">
        <div className="mb-12">
          <SectionHeadingInline />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="cat-tile group relative h-[420px] overflow-hidden block"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                <h3 className="font-display uppercase text-3xl text-paper">{cat.name}</h3>
                <span className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white group-hover:bg-accent group-hover:border-accent transition-colors">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeadingInline() {
  return (
    <div>
      <p className="section-label">Browse</p>
      <h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
        Shop by Category
      </h2>
    </div>
  );
}
