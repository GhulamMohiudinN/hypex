"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2600,
        style: {
          background: "#111111",
          color: "#fff",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          borderRadius: "2px",
        },
        success: {
          iconTheme: { primary: "#e31937", secondary: "#fff" },
        },
      }}
    />
  );
}
