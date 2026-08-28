export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function descriptionFor(item) {
  return `Authentic pre-loved ${item.brand} ${item.name.split("–")[0].trim()} in the "${item.name.split("–")[1]?.trim() ?? "signature"}" colorway. Carefully inspected and cleaned before listing — a genuine pair, not a first copy. Cash on delivery available across Pakistan.`;
}
