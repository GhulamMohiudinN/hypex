"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollReveal(selector, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const targets = selector ? ref.current.querySelectorAll(selector) : [ref.current];
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: options.y ?? 30,
        duration: options.duration ?? 0.7,
        ease: options.ease ?? "power2.out",
        stagger: options.stagger ?? 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: options.start ?? "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [selector, options.y, options.duration, options.ease, options.stagger, options.start]);

  return ref;
}
