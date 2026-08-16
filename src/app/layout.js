import { Anton, Epilogue } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ToasterProvider from "@/components/ui/ToasterProvider";
import DemoBanner from "@/components/ui/DemoBanner";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://hypex.pk"),
  title: {
    default: "HypeX | Authentic Sneakers, Pakistan",
    template: "%s | HypeX",
  },
  description:
    "HypeX is Pakistan's destination for authentic pre-loved sneakers — Jordan, Nike, Adidas, New Balance and more. Cash on delivery nationwide.",
  keywords: ["sneakers pakistan", "jordan pakistan", "nike pakistan", "hypex", "sneaker resale"],
  icons: {
    icon: "/images/logo.jpg",
  },
};

export const viewport = {
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${epilogue.variable}`}>
      <body className="font-body bg-bg text-ink antialiased">
        <SmoothScroll />
        <ToasterProvider />
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <DemoBanner />
      </body>
    </html>
  );
}
