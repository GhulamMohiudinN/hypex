"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const mainRef = useRef(null);

  const select = (i) => {
    if (i === active) return;
    gsap.fromTo(
      mainRef.current,
      { opacity: 0.3, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
    );
    setActive(i);
  };

  if (images.length === 0) {
    return <div className="aspect-square bg-muted" />;
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible sm:w-20 shrink-0">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => select(i)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 transition-colors cursor-pointer ${
              active === i ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={src} alt={`${name} ${i + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div ref={mainRef} className="relative flex-1 aspect-square bg-muted overflow-hidden">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
