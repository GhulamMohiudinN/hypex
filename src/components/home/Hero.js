"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FiArrowDown } from "react-icons/fi";

const VIDEOS = ["/videos/hero-1.mp4", "/videos/hero-2.mp4", "/videos/hero-3.mp4"];

export default function Hero() {
  const rootRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const videos = rootRef.current.querySelectorAll(".hero-video");
      const tl = gsap.timeline({ delay: 0.2 });

      tl.set(rootRef.current, { autoAlpha: 1 })
        .from(videos, {
          scale: 1.25,
          autoAlpha: 0,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.12,
        })
        .from(
          ".hero-overlay",
          { autoAlpha: 0, duration: 0.8 },
          "<"
        )
        .from(
          wordsRef.current,
          {
            yPercent: 120,
            duration: 1,
            ease: "power4.out",
            stagger: 0.08,
          },
          "-=0.9"
        )
        .from(
          ".hero-sub, .hero-cta, .hero-scroll",
          { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" },
          "-=0.5"
        );

      gsap.to(videos, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const headline = "STEP INTO HYPE";

  return (
    <section
      ref={rootRef}
      className="relative h-[100svh] w-full overflow-hidden bg-bg-dark invisible"
    >
      <div className="absolute inset-0">
        {/* Mobile: a single full-bleed video keeps the hero legible on small screens */}
        <video
          className="hero-video sm:hidden absolute inset-0 h-full w-full object-cover scale-110"
          src={VIDEOS[0]}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Tablet/Desktop: the 3-column video grid */}
        <div className="hidden sm:grid grid-cols-3 h-full">
          {VIDEOS.map((src) => (
            <div key={src} className="relative h-full w-full overflow-hidden">
              <video
                className="hero-video absolute inset-0 h-full w-full object-cover scale-110"
                src={src}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="hero-sub font-display uppercase tracking-[0.35em] text-accent text-xs sm:text-sm mb-4">
          Authentic &middot; Pre-Loved &middot; Verified
        </p>

        <h1 className="font-display uppercase text-paper text-[15vw] sm:text-[9vw] lg:text-[7.5vw] leading-[0.88] flex flex-wrap justify-center gap-x-5 overflow-hidden">
          {headline.split(" ").map((word, i) => (
            <span key={word} className="overflow-hidden pb-2">
              <span
                ref={(el) => (wordsRef.current[i] = el)}
                className={`inline-block ${word === "HYPE" ? "text-accent" : ""}`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-sub text-white/70 max-w-md mt-6 text-sm sm:text-base">
          Genuine grails, hand-picked and inspected. Cash on delivery, anywhere in Pakistan.
        </p>

        <div className="hero-cta mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="btn-accent">
            Shop The Drop
          </Link>
          <Link href="/about" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-ink">
            Our Story
          </Link>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <FiArrowDown className="animate-bounce" />
      </div>
    </section>
  );
}
