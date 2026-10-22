export const instrumentStatusValues = ["available", "coming-soon", "reserved", "unavailable", "sold"] as const;
export type InstrumentStatus = (typeof instrumentStatusValues)[number];

export const instrumentStatusLabels: Record<InstrumentStatus, string> = {
  available: "Available",
  "coming-soon": "On the way",
  reserved: "Reserved",
  unavailable: "Not available",
  sold: "Sold",
};

export const instrumentStatusNotes: Record<InstrumentStatus, string> = {
  available: "Available to try in Berlin by appointment. Pricing on request.",
  "coming-soon": "This instrument is on the way and is not yet available to try. Please enquire about its arrival.",
  reserved: "This instrument is currently reserved. Please enquire about its status before arranging a visit.",
  unavailable: "This instrument is currently not available to try or buy. The photographs and details remain for reference.",
  sold: "This instrument has been sold. Its page remains as a reference; it is not available to try or buy.",
};

export const inventorySections = [
  { status: "available", id: "available", title: "Available to try", description: "The individual instruments currently offered for an appointment." },
  { status: "coming-soon", id: "on-the-way", title: "On the way", description: "Not yet available to try. Please enquire about expected arrival." },
  { status: "reserved", id: "reserved", title: "Reserved", description: "These instruments are currently held for other customers." },
  { status: "sold", id: "past-instruments", title: "Selected past instruments", description: "Sold instruments retained as references for models, materials and individual equipment." },
] as const;

type StockEntry = { data: { status: InstrumentStatus; order: number; model: string; featured: boolean } };

// Not-available entries retain their URLs but are not advertised in stock or archive lists.
export const isListedStatus = (status: InstrumentStatus) => status !== "unavailable";

export function instrumentPriority(model: string): number {
  if (model === "SB-1000") return 0;
  if (model === "SB-800") return 1;
  if (["SB-300", "SB-200"].includes(model)) return 2;
  if (["SB-180", "SB-150"].includes(model)) return 3;
  return 4;
}

export function groupInventory<T extends StockEntry>(instruments: T[]) {
  return inventorySections.map((section) => ({
    ...section,
    instruments: instruments
      .filter(({ data }) => data.status === section.status)
      .sort((a, b) => instrumentPriority(a.data.model) - instrumentPriority(b.data.model) || a.data.order - b.data.order),
  }));
}

export function selectHomepageInstruments<T extends StockEntry>(instruments: T[], limit = 2): T[] {
  return instruments
    .filter(({ data }) => data.status === "available")
    .sort((a, b) => instrumentPriority(a.data.model) - instrumentPriority(b.data.model)
      || Number(b.data.featured) - Number(a.data.featured)
      || a.data.order - b.data.order)
    .slice(0, limit);
}
