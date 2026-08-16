import { getCollection, type CollectionEntry } from "astro:content";
import { hasPublicationPhoto } from "./instrumentPhotos";

type Instrument = CollectionEntry<"instruments">;

export const publicationRequiredFields = [
  "slug",
  "inventory",
  "model",
  "outline",
  "shortDescription",
] as const;

export type PublicationRequirement =
  | (typeof publicationRequiredFields)[number]
  | "publicationPhoto";

function assertUniqueField(
  instruments: Instrument[],
  field: "slug" | "inventory",
): void {
  const seen = new Map<string, string>();

  for (const instrument of instruments) {
    const value = instrument.data[field];
    if (!value) continue;

    const existingId = seen.get(value);

    if (existingId) {
      throw new Error(
        `Duplicate instrument ${field} "${value}" in "${existingId}" and "${instrument.id}".`,
      );
    }

    seen.set(value, instrument.id);
  }
}

export function getPublicationMissingFields(
  instrument: Instrument,
): PublicationRequirement[] {
  const missingFields: PublicationRequirement[] = publicationRequiredFields.filter(
    (field) => !instrument.data[field].trim(),
  );

  if (!hasPublicationPhoto(instrument.data.gallery)) {
    missingFields.push("publicationPhoto");
  }

  return missingFields;
}

export async function getInstruments(): Promise<Instrument[]> {
  const allInstruments = await getCollection("instruments");
  const markedAsPublished = allInstruments.filter(
    (instrument) => instrument.data.publication === "published",
  );
  const incompletePublished = markedAsPublished.filter(
    (instrument) => getPublicationMissingFields(instrument).length > 0,
  );
  const publishedInstruments = markedAsPublished.filter(
    (instrument) => getPublicationMissingFields(instrument).length === 0,
  );

  for (const instrument of incompletePublished) {
    console.warn(
      `Instrument "${instrument.data.title}" remains hidden because it is missing: ${getPublicationMissingFields(instrument).join(", ")}.`,
    );
  }

  assertUniqueField(publishedInstruments, "slug");
  assertUniqueField(publishedInstruments, "inventory");

  return publishedInstruments;
}
