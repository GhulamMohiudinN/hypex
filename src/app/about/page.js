import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export const metadata = {
  title: "About Us",
  description: "Learn the HypeX story — Pakistan's home for authentic pre-loved sneakers.",
};

const VALUES = [
  { title: "Expert Verified OGs", desc: "Every pair is inspected against original retail references before listing." },
  { title: "Honest Condition", desc: "Photos reflect true condition — no filters, no false advertising." },
  { title: "Fast Nationwide COD", desc: "Cash on delivery to every major city, 2-5 business days." },
  { title: "Strong Exchange Policy", desc: "Exchange only for verified issues. No refunds, no returns." },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-x">
        <div className="max-w-2xl mb-16">
          <p className="section-label">About HypeX</p>
          <h1 className="font-display uppercase text-5xl sm:text-6xl leading-[0.95] mb-6">
            From One Closet To A Whole Community
          </h1>
          <p className="text-ink/60 leading-relaxed">
            HypeX began in Karachi as a small collection of grails traded between friends who
            couldn&apos;t find authentic sneakers at fair prices locally. What started as a shared
            spreadsheet is now a curated storefront trusted by sneakerheads across Pakistan.
          </p>
        </div>

        <div className="relative h-[320px] sm:h-[480px] mb-20">
          <Image
            src="/images/products/p35/1.jpg"
            alt="HypeX sneaker collection"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <p className="section-label">Why HypeX</p>
            <h2 className="font-display uppercase text-3xl sm:text-4xl mb-6">
              We Buy Like Collectors, Sell Like Friends
            </h2>
            <p className="text-ink/60 leading-relaxed mb-4">
              Every pair that comes through HypeX is hand-inspected for authenticity, cleaned, and
              photographed in true condition — creases, wear, and all. We don&apos;t deal in first
              copies, and we don&apos;t hide flaws.
            </p>
            <p className="text-ink/60 leading-relaxed">
              Whether it&apos;s a Jordan 1, a Dunk, or a Yeezy, you&apos;re getting the real thing at a
              price that respects your wallet.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="border border-border p-6">
                <FiCheckCircle className="text-accent mb-3" size={22} />
                <h3 className="font-display uppercase text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-ink/50 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink text-paper p-10 sm:p-16 text-center">
          <h2 className="font-display uppercase text-3xl sm:text-4xl mb-4">Ready To Find Your Pair?</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Browse the full collection and get it delivered with cash on delivery, anywhere in
            Pakistan.
          </p>
          <Link href="/shop" className="btn-accent">Shop Now</Link>
        </div>
      </div>
    </div>
  );
}
