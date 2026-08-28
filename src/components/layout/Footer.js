"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiInstagram, FiMail } from "react-icons/fi";

const INSTAGRAM_URL = "https://www.instagram.com/sneakersupply.pk.2024/";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-bg-dark text-paper">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <Image
            src="/images/logo.jpg"
            alt="Sneaker Supply"
            width={64}
            height={64}
            className="h-14 w-14 mb-4"
          />
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Verified, authentic pre-loved sneakers. Every pair inspected, cleaned, and shipped
            nationwide with cash on delivery.
          </p>
        </div>

        <div>
          <h4 className="font-display uppercase text-sm tracking-widest text-accent mb-4">Shop</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><Link href="/shop" className="hover:text-white transition-colors">All Sneakers</Link></li>
            <li><Link href="/shop?category=Sneakers" className="hover:text-white transition-colors">Sneakers</Link></li>
            <li><Link href="/shop?category=Sandals" className="hover:text-white transition-colors">Sandals</Link></li>
            <li><Link href="/shop?category=Boots" className="hover:text-white transition-colors">Boots</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase text-sm tracking-widest text-accent mb-4">Company</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase text-sm tracking-widest text-accent mb-4">Get in touch</h4>
          <div className="flex items-center gap-3 text-white/60 text-sm mb-4">
            <FiMail /> <span>hello@sneakersupply.pk</span>
          </div>
          <div className="flex items-center gap-4 text-xl">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-accent transition-colors"
            >
              <FiInstagram />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Sneaker Supply. All rights reserved.</p>
          <p>Cash on Delivery available all over Pakistan &middot; Exchange only &middot; No refunds or returns</p>
        </div>
      </div>
    </footer>
  );
}
