"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { watchAuthState } from "@/lib/auth";
import { useAdminStore } from "@/store/useAdminStore";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, authLoading, setUser } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = watchAuthState((u) => {
      setUser(u);
      if (!u) router.replace("/admin");
    });
    return () => unsub();
  }, [router, setUser]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <div className="lg:hidden h-16 flex items-center px-4 bg-paper border-b border-border sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <FiMenu size={22} />
          </button>
          <span className="font-display uppercase ml-4">Dashboard</span>
        </div>
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
