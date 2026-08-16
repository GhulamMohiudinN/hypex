/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-dark": "var(--color-bg-dark)",
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        accent: {
          DEFAULT: "var(--color-accent)",
          dark: "var(--color-accent-dark)",
        },
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        success: "var(--color-success)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        container: "1440px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
