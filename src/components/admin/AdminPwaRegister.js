"use client";

import { useEffect } from "react";

export default function AdminPwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/admin-sw.js", { scope: "/admin/" })
        .catch((err) => console.warn("Admin SW registration failed:", err));
    }
  }, []);

  return null;
}
