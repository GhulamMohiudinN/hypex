"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiX } from "react-icons/fi";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  if (dismissed || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-ink text-white text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-3 text-center">
      <span>
        This is a demo preview — not a live store yet. Orders placed here won&apos;t be fulfilled.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/60 hover:text-white cursor-pointer"
        aria-label="Dismiss"
      >
        <FiX size={14} />
      </button>
    </div>
  );
}
