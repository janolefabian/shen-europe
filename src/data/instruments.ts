export interface Instrument {
  slug: string;
  title: string;
  model: string;
  outline: string;
  status: "available" | "reserved" | "sold" | "coming-soon";
  price?: string;
  location: string;
  stringLength?: string;
  description: string;
  image: string;
}

export const instruments: Instrument[] = [
  {
    slug: "sb800-mirecourt-2026-01",
    title: "Shen SB-800 Mirecourt",
    model: "SB-800",
    outline: "Mirecourt",
    status: "available",
    price: "€9,000",
    location: "Berlin",
    stringLength: "104.8 cm",
    description:
      "A compact, responsive Mirecourt model with a focused fundamental and comfortable access to the upper register.",
    image: "/images/sb800_bg.jpg",
  },
];
