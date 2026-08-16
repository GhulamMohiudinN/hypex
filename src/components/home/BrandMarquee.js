const BRANDS = [
  "Jordan", "Nike", "Adidas", "New Balance", "Puma", "Converse", "Vans", "Dior", "Amiri", "Timberland",
];

export default function BrandMarquee() {
  const list = [...BRANDS, ...BRANDS];
  return (
    <div className="border-y border-border bg-ink overflow-hidden py-5">
      <div className="flex w-max animate-marquee">
        {list.map((brand, i) => (
          <span
            key={i}
            className="font-display uppercase text-2xl sm:text-3xl text-paper/80 px-8 flex items-center gap-8 whitespace-nowrap"
          >
            {brand}
            <span className="text-accent text-lg">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
