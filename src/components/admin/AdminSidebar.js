"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiBox, FiShoppingBag, FiPlusCircle, FiLogOut, FiX, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { logoutAdmin } from "@/lib/auth";

const LINKS = [
  { href: "/admin/dashboard", label: "Overview", icon: FiGrid, exact: true },
  { href: "/admin/dashboard/products", label: "Products", icon: FiBox, exact: true },
  { href: "/admin/dashboard/products/new", label: "Add Product", icon: FiPlusCircle },
  { href: "/admin/dashboard/orders", label: "Orders", icon: FiShoppingBag },
  { href: "/admin/dashboard/reviews", label: "Reviews", icon: FiStar },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    toast.success("Logged out");
    router.replace("/admin");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink text-paper flex flex-col z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <Image src="/images/logo.jpg" alt="Sneaker Supply" width={64} height={64} className="h-10 w-10" />
          <button onClick={onClose} className="lg:hidden text-white/60" aria-label="Close menu">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-1">
          {LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-display uppercase tracking-wide transition-colors ${
                  active ? "bg-accent text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} /> {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-display uppercase tracking-wide text-white/60 hover:text-accent transition-colors w-full cursor-pointer"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
