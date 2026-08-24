/** Local product images from /public/products */

const file = (name: string) => `/products/${encodeURIComponent(name)}`;

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface RawProduct {
  name: string;
  type: string;
  origin: string;
  tone: string;
  image: string;
  gallery?: string[];
  summary: string;
  detail?: string;
  finish?: string;
  thickness?: string;
  size?: string;
  availability?: string;
  applications?: string[];
}

export interface Product extends Required<Omit<RawProduct, "detail">> {
  detail?: string;
  slug: string;
}

const defaults = {
  finish: "Polished",
  thickness: "2 / 3 cm",
  size: "Bookmatched slabs",
  availability: "Available to enquire",
  applications: ["Kitchen islands", "Feature walls", "Bath vanities"],
};

const rawProducts: RawProduct[] = [
  {
    name: "Calacatta Oceana",
    type: "Marble",
    origin: "Carrara, Italy",
    tone: "Bold / dramatic",
    image: file("Calacatta Oceana.jpg"),
    gallery: [file("Calacatta Oceana.jpg"), file("Calacatta Rocky.jpg")],
    summary:
      "Dramatic open veining with oceanic depth — a statement slab for feature walls and islands.",
    detail:
      "Oceana carries wide, fluid movement across a luminous ground. Best reserved for surfaces that deserve attention — islands, fireplace surrounds, and feature walls where the stone becomes the architecture.",
    finish: "Polished",
    thickness: "2 / 3 cm",
    size: "Full slabs · bookmatch ready",
    availability: "Limited selection",
    applications: ["Feature walls", "Kitchen islands", "Reception desks"],
  },
  {
    name: "Calacatta Rocky",
    type: "Marble",
    origin: "Carrara, Italy",
    tone: "Strong / textured",
    image: file("Calacatta Rocky.jpg"),
    gallery: [file("Calacatta Rocky.jpg"), file("CALACATTA ROCKY copy.jpg")],
    summary:
      "Strong, textured movement with classic Calacatta character for bold interiors.",
    detail:
      "Rocky brings denser veining and a more tactile presence. Pair with quiet cabinetry and soft lighting so the stone's structure remains the focal point.",
    applications: ["Kitchen islands", "Bathroom walls", "Bar tops"],
  },
  {
    name: "Bianco Luna",
    type: "Marble",
    origin: "Tuscany, Italy",
    tone: "Light / soft",
    image: file("Bianco luna.jpg"),
    summary:
      "Soft lunar whites with quiet veining — calm, luminous, and highly versatile.",
    detail:
      "Bianco Luna is a quiet companion for bright interiors. Soft veining keeps rooms calm while still reading as natural stone under morning and evening light.",
    applications: ["Bath vanities", "Flooring accents", "Kitchen counters"],
  },
  {
    name: "Calacatta Belo",
    type: "Marble",
    origin: "Brazil",
    tone: "Bright / veined",
    image: file("Calacatta Belo BR.jpg"),
    gallery: [
      file("Calacatta Belo BR.jpg"),
      file("CALACATTA BELO BR (1).jpg"),
    ],
    summary:
      "Bright Brazilian Calacatta with crisp veining for contemporary kitchens and baths.",
    detail:
      "Belo offers crisp contrast and a bright ground that photographs beautifully. Ideal for contemporary kitchens that want Calacatta energy without heaviness.",
  },
  {
    name: "Carrara Gold",
    type: "Marble",
    origin: "Carrara, Italy",
    tone: "Warm / classic",
    image: file("carrara gold.JPG"),
    gallery: [file("carrara gold.JPG"), file("carrara gold closeup.JPG")],
    summary:
      "Warm golden undertones on classic Carrara — timeless elegance with soft contrast.",
    detail:
      "Warm gold undertones soften classic Carrara patterning. A natural fit for homes that lean toward oak, linen, and gentle daylight.",
    applications: ["Kitchen counters", "Fireplace surrounds", "Powder rooms"],
  },
  {
    name: "Colonial White",
    type: "Marble",
    origin: "Rajasthan, India",
    tone: "Clean / timeless",
    image: file("colonial white.jpg"),
    gallery: [file("colonial white.jpg"), file("colonial white closeup.jpg")],
    summary:
      "Clean colonial whites with restrained pattern — ideal for large, bright spaces.",
    detail:
      "Colonial White stays composed across large runs. Restrained patterning makes it dependable for floors, walls, and continuous kitchen planes.",
    applications: ["Flooring", "Wall cladding", "Kitchen counters"],
  },
  {
    name: "Calacatta Raven",
    type: "Marble",
    origin: "Brazil",
    tone: "Dark / contrast",
    image: file("Calacatta Raven.jpg"),
    summary:
      "Dark contrast and sharp movement for modern, high-drama applications.",
    detail:
      "Raven is for rooms that want contrast. Dark movement against a cooler ground creates a modern, high-drama surface without relying on ornament.",
    applications: ["Feature walls", "Bar tops", "Statement islands"],
  },
  {
    name: "Calacatta Leaf",
    type: "Marble",
    origin: "Carrara, Italy",
    tone: "Organic / flowing",
    image: file("Calacatta Leaf.jpg"),
    summary:
      "Organic leaf-like flow across a soft ground — natural and expressive.",
    detail:
      "Leaf reads almost botanical — flowing veins that feel drawn rather than fractured. Beautiful bookmatched as a quiet mural.",
  },
  {
    name: "Calacatta Nile",
    type: "Marble",
    origin: "Egypt",
    tone: "Soft / elegant",
    image: file("Calacatta Nile.jpg"),
    summary:
      "Soft elegant veining with a refined Nile-inspired calm for luxury finishes.",
    detail:
      "Nile is soft and measured. Elegant enough for luxury baths, calm enough for everyday kitchens that still want presence.",
  },
  {
    name: "Calacatta Unique",
    type: "Marble",
    origin: "Carrara, Italy",
    tone: "Rare / statement",
    image: file("CALACATTA UNIQUE.jpg"),
    summary:
      "A rare statement piece with singular patterning — best reserved for focal surfaces.",
    detail:
      "Unique lives up to the name: singular patterning best reserved for one heroic surface rather than continuous runs.",
    availability: "Rare · enquire for match",
    applications: ["Feature walls", "Statement islands", "Art panels"],
  },
  {
    name: "Calacatta Silver Beauty",
    type: "Marble",
    origin: "Turkey",
    tone: "Cool / refined",
    image: file("Calacatta Silver Beauty.jpg"),
    summary:
      "Cool silver tones and refined veining for polished, contemporary schemes.",
    detail:
      "Cool silver tones keep interiors feeling crisp. Pair with matte black hardware or pale oak for a refined contemporary scheme.",
  },
  {
    name: "Calacatta Thunder White",
    type: "Marble",
    origin: "Brazil",
    tone: "Bright / energetic",
    image: file("calacatta thunder white.JPG"),
    summary:
      "Bright energetic whites with thunderous movement across the slab.",
    detail:
      "Thunder White carries energetic movement across a bright field — ideal when the kitchen needs light and motion together.",
  },
  {
    name: "Calacatta Thunder Black",
    type: "Marble",
    origin: "Brazil",
    tone: "Bold / modern",
    image: file("Calacatta thunder black.JPG"),
    summary:
      "Bold modern blacks with striking contrast for dramatic architectural moments.",
    detail:
      "Thunder Black delivers architectural drama. Use it where lighting can graze the surface and reveal depth.",
    applications: ["Feature walls", "Reception desks", "Bar fronts"],
  },
  {
    name: "Calacatta Maggiori",
    type: "Marble",
    origin: "Carrara, Italy",
    tone: "Classic / rich",
    image: file("Calacatta margiori.PNG"),
    summary:
      "Classic rich Calacatta character with generous, painterly veining.",
    detail:
      "Maggiori is classic Calacatta at its most painterly — generous veins and a rich, gallery-ready presence.",
  },
  {
    name: "Carrara Plasma",
    type: "Marble",
    origin: "Carrara, Italy",
    tone: "Soft / luminous",
    image: file("CARRARA PLASMA.jpg"),
    summary:
      "Soft luminous Carrara with a plasma-like glow under natural light.",
    detail:
      "Plasma softens under daylight into a gentle glow. A luminous choice for baths and spaces that chase soft reflection.",
  },
  {
    name: "Clade",
    type: "Quartzite",
    origin: "Brazil",
    tone: "Unique / textured",
    image: file("clade.JPG"),
    summary:
      "Unique textured quartzite with geological depth and exceptional durability.",
    detail:
      "Clade brings geological texture with quartzite durability — a distinctive alternative when marble beauty needs harder performance.",
    finish: "Honed / leathered options",
    applications: [
      "Kitchen counters",
      "Outdoor kitchens",
      "High-traffic surfaces",
    ],
  },
];

export const products: Product[] = rawProducts.map((product) => ({
  ...defaults,
  ...product,
  gallery: product.gallery?.length ? product.gallery : [product.image],
  applications: product.applications || defaults.applications,
  slug: slugify(product.name),
}));

export const heroImage = products[0]!.image;
export const featuredProducts = products.slice(0, 3);
export const sellerShowcaseImage = file("carrara gold closeup.JPG");
export const storyImage = file("colonial white closeup.jpg");

export const originOptions = [...new Set(products.map((p) => p.origin))].sort();
export const toneOptions = [...new Set(products.map((p) => p.tone))].sort();
export const typeOptions = [...new Set(products.map((p) => p.type))].sort();

export const trustPoints = [
  {
    label: "Curated inventory",
    value: `${products.length}+`,
    note: "slabs selected for character",
  },
  {
    label: "Direct enquiry",
    value: "1:1",
    note: "connect with the right supplier",
  },
  {
    label: "Verified listings",
    value: "100%",
    note: "materials reviewed before publish",
  },
  { label: "Origins", value: "6+", note: "Italy, Brazil, India & more" },
];

export const testimonials = [
  {
    quote:
      "Finally a stone marketplace that feels considered — the photography and detail made shortlisting simple.",
    name: "Maya R.",
    role: "Interior designer, Mumbai",
  },
  {
    quote:
      "We found a bookmatch-ready Calacatta in one afternoon. The listing felt as careful as the slab itself.",
    name: "James & Priya",
    role: "Homeowners, Bangalore",
  },
  {
    quote:
      "As a supplier, the presentation elevates our inventory. Buyers arrive already educated.",
    name: "Elena V.",
    role: "Stone yard partner",
  },
];

export function enquireHref(productName: string) {
  return `/contact?material=${encodeURIComponent(productName)}`;
}

export function productHref(slug: string) {
  return `/buyer/${slug}`;
}

export function getProductBySlug(slug: string | undefined | null) {
  return products.find((p) => p.slug === slug) || null;
}

interface FilterProductsArgs {
  query?: string;
  origin?: string;
  tone?: string;
  type?: string;
}

export function filterProducts({
  query = "",
  origin = "all",
  tone = "all",
  type = "all",
}: FilterProductsArgs = {}) {
  const q = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.origin.toLowerCase().includes(q) ||
      product.tone.toLowerCase().includes(q) ||
      product.type.toLowerCase().includes(q);
    const matchesOrigin = origin === "all" || product.origin === origin;
    const matchesTone = tone === "all" || product.tone === tone;
    const matchesType = type === "all" || product.type === type;
    return matchesQuery && matchesOrigin && matchesTone && matchesType;
  });
}
