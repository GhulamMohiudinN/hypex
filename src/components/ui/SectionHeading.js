export default function SectionHeading({ label, title, align = "left", light = false }) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {label && <p className="section-label">{label}</p>}
      <h2
        className={`font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95] ${
          light ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
