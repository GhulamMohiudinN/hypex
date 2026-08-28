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
          iconTheme: { primary: "#4a4a4a", secondary: "#fff" },
        },
      }}
    />
  );
}
