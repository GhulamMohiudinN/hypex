import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop All Sneakers",
  description: "Browse authentic pre-loved sneakers, sandals and boots from HypeX.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopClient />
    </Suspense>
  );
}
