export const instrumentPhotoCategoryOptions = [
  { value: "front-complete", label: "Front – komplett" },
  { value: "corner-detail", label: "Detail – Ecke" },
  { value: "tuning-machines-detail", label: "Detail – Mechaniken" },
  { value: "scroll-detail", label: "Detail – Schnecke" },
  { value: "body-front", label: "Korpus – Front" },
  { value: "body-back", label: "Korpus – Back" },
  { value: "side-ribs", label: "Seite (Zarge)" },
  { value: "side-ribs-front", label: "Seite (Zarge + Front)" },
] as const;

export const instrumentPhotoCategoryValues = [
  "front-complete",
  "corner-detail",
  "tuning-machines-detail",
  "scroll-detail",
  "body-front",
  "body-back",
  "side-ribs",
  "side-ribs-front",
] as const;

export type InstrumentPhotoCategory =
  (typeof instrumentPhotoCategoryValues)[number];

export const instrumentPhotoCategoryLabels = Object.fromEntries(
  instrumentPhotoCategoryOptions.map(({ label, value }) => [value, label]),
) as Record<InstrumentPhotoCategory, string>;

export const publicationPhotoCategories = [
  "front-complete",
  "body-front",
] as const satisfies readonly InstrumentPhotoCategory[];

export const automaticHeroCategoryPriority = [
  "front-complete",
  "body-front",
  "side-ribs-front",
  "side-ribs",
  "body-back",
  "corner-detail",
  "tuning-machines-detail",
  "scroll-detail",
] as const satisfies readonly InstrumentPhotoCategory[];

export const instrumentPhotoChecklist = [
  {
    key: "front-complete",
    label: "Front – komplett",
    categories: ["front-complete"],
  },
  {
    key: "body-front",
    label: "Korpus – Front",
    categories: ["body-front"],
  },
  {
    key: "body-back",
    label: "Korpus – Back",
    categories: ["body-back"],
  },
  {
    key: "side",
    label: "Seite / Zarge",
    categories: ["side-ribs", "side-ribs-front"],
  },
  {
    key: "corner-detail",
    label: "Detail – Ecke",
    categories: ["corner-detail"],
  },
  {
    key: "head-detail",
    label: "Mechaniken oder Schnecke",
    categories: ["tuning-machines-detail", "scroll-detail"],
  },
] as const satisfies readonly {
  key: string;
  label: string;
  categories: readonly InstrumentPhotoCategory[];
}[];

export interface CategorizedInstrumentPhoto {
  image: string;
  category: InstrumentPhotoCategory;
}

export function hasPublicationPhoto(
  gallery: readonly Pick<CategorizedInstrumentPhoto, "category">[],
): boolean {
  return gallery.some(({ category }) =>
    publicationPhotoCategories.some((candidate) => candidate === category),
  );
}

export function getAutomaticHeroReference(
  gallery: readonly CategorizedInstrumentPhoto[],
): CategorizedInstrumentPhoto | undefined {
  for (const category of automaticHeroCategoryPriority) {
    const photo = gallery.find((item) => item.category === category);
    if (photo) return photo;
  }

  return undefined;
}

export function getInstrumentPhotoStatus(
  gallery: readonly Pick<CategorizedInstrumentPhoto, "category">[],
) {
  const categories = new Set(gallery.map(({ category }) => category));
  const completedSlots = instrumentPhotoChecklist.filter((slot) =>
    slot.categories.some((category) => categories.has(category)),
  );
  const missingSlots = instrumentPhotoChecklist.filter(
    (slot) => !completedSlots.includes(slot),
  );

  return {
    completed: completedSlots.length,
    total: instrumentPhotoChecklist.length,
    hasPublicationPhoto: hasPublicationPhoto(gallery),
    missingLabels: missingSlots.map(({ label }) => label),
  };
}
