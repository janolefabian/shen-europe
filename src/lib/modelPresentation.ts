import type { bassModelGroups } from "./instrumentTaxonomy";
import type { ModelOutlineKey } from "./modelOutlines";

type CatalogModel = (typeof bassModelGroups)[number]["options"][number]["value"];
interface ModelPresentation {
  name: string;
  size: string;
  pattern: ModelOutlineKey;
  source: string;
  note?: string;
}

// Display metadata only. The existing taxonomy remains the authority for SB/model combinations.
// Shared contours depict the illustrated body family, not an exact outline for every variant.
export const modelPresentation: Record<CatalogModel, ModelPresentation> = {
  Rogeri: { name: "Rogeri", size: "Large 3/4", pattern: "rogeri", source: "https://cscproducts.com/products/bass-rogeri-maple.html" },
  Mirecourt: { name: "Mirecourt", size: "3/4", pattern: "mirecourt", source: "https://cscproducts.com/products/bass-mirecourt.html" },
  Busetto: { name: "Busetto", size: "3/4", pattern: "busetto", source: "https://cscproducts.com/products/bass-busetto.html" },
  "Shen Classic 3/4 Maple": { name: "Shen Classic", size: "3/4", pattern: "classic", source: "https://cscproducts.com/products/bass-shen-classic-maple.html" },
  "Shen 5/8 Maple": { name: "Shen", size: "5/8", pattern: "fiveEighths", source: "https://cscproducts.com/products/bass-shen-five-eighths.html" },
  Panormo: { name: "Panormo", size: "Large 3/4", pattern: "panormo", source: "/instruments/sb-1000-panormo-bass-0004/" },
  "Rogeri Willow": { name: "Rogeri", size: "Large 3/4", pattern: "rogeri", source: "https://cscproducts.com/products/bass-rogeri-willow.html", note: "Roundback or flatback in the US range." },
  "Shen Willow 3/4 Flatback": { name: "Shen Willow", size: "3/4 · Flatback", pattern: "willow", source: "https://cscproducts.com/products/bass-willow-three-quarter.html", note: "The US specification lists laminated willow ribs." },
  "Gemunder 7/8 Willow": { name: "Gemunder", size: "7/8 · Flatback", pattern: "gemunder", source: "https://cscproducts.com/products/bass-gemunder.html" },
  "Gemunder 7/8 Willow 5-String": { name: "Gemunder", size: "7/8 · 5-string", pattern: "gemunder", source: "https://cscproducts.com/products/bass-5-string.html" },
  "Shen 3/4 Hybrid": { name: "Shen", size: "3/4", pattern: "gamba", source: "https://cscproducts.com/products/bass-sb150.html", note: "Gamba outline shown. A violin-cornered version is also listed in the US range." },
  "Shen 3/4 Flamed Hybrid": { name: "Shen Flamed Hybrid", size: "3/4", pattern: "classic", source: "https://cscproducts.com/products/bass-sb180.html" },
  "Gemunder 7/8 Hybrid": { name: "Gemunder", size: "7/8 · Flatback", pattern: "gemunder", source: "https://cscproducts.com/products/bass-sb15078.html" },
  "Shen SB100 3/4": { name: "Shen SB-100", size: "3/4", pattern: "classic", source: "https://cscproducts.com/products/bass-sb100.html", note: "Violin corners shown. A gamba version is also listed in the US range." },
  "Shen SB88 3/4": { name: "Shen SB-88", size: "3/4", pattern: "classic", source: "https://cscproducts.com/products/bass-sb88.html" },
  "Shen SB80": { name: "Shen SB-80", size: "", pattern: "classic", source: "https://cscproducts.com/products/bass-sb80.html" },
  "Shen Blonde": { name: "Shen Blonde", size: "", pattern: "classic", source: "https://cscproducts.com/products/bass-sb90.html" },
};

export function modelDisplayPriority(model: CatalogModel): number {
  return model === "Panormo" ? 0 : model === "Shen Classic 3/4 Maple" ? 1 : 2;
}
