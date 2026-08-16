"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useCartStore } from "@/store/useCartStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  // Only the home page has a dark, full-bleed hero directly under the header, so it's
  // the only page allowed a transparent header — every other page starts with light
  // (cream) content right at the top, where a transparent header would sit fine either
  // way, but keeping it solid there avoids ever having to guess what's behind it.
  const isHome = pathname === "/";
  const solid = scrolled || menuOpen || !isHome;
  const onDark = isHome && !solid;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? "bg-bg/95 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/logo.jpg" alt="HypeX" width={130} height={44} priority className="h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display uppercase text-sm tracking-wide relative pb-1 transition-colors ${
                pathname === link.href
                  ? "text-accent"
                  : onDark
                  ? "text-white hover:text-accent"
                  : "text-ink hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className={`relative w-11 h-11 flex items-center justify-center border transition-colors cursor-pointer ${
              onDark
                ? "border-white/40 text-white hover:border-accent hover:text-accent"
                : "border-ink/15 text-ink hover:border-accent hover:text-accent"
            }`}
            aria-label="Open cart"
          >
            <FiShoppingBag size={19} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden w-11 h-11 flex items-center justify-center cursor-pointer ${
              onDark ? "text-white" : "text-ink"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-bg border-t border-border">
          <div className="container-x flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display uppercase text-lg py-3 border-b border-border/70 last:border-none ${
                  pathname === link.href ? "text-accent" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
