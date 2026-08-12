import { getCollection, type CollectionEntry } from "astro:content";

type Instrument = CollectionEntry<"instruments">;

function assertUniqueField(
  instruments: Instrument[],
  field: "slug" | "inventory",
): void {
  const seen = new Map<string, string>();

  for (const instrument of instruments) {
    const value = instrument.data[field];
    const existingId = seen.get(value);

    if (existingId) {
      throw new Error(
        `Duplicate instrument ${field} "${value}" in "${existingId}" and "${instrument.id}".`,
      );
    }

    seen.set(value, instrument.id);
  }
}

export async function getInstruments(): Promise<Instrument[]> {
  const instruments = await getCollection("instruments");

  assertUniqueField(instruments, "slug");
  assertUniqueField(instruments, "inventory");

  return instruments;
}
