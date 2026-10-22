import { instrumentStatusLabels, instrumentStatusNotes, type InstrumentStatus } from "./instrumentAvailability.ts";

export interface InquiryInstrument { title: string; status: InstrumentStatus }

export function resolveInstrumentInquiry(entries: Record<string, InquiryInstrument>, search: string) {
  const params = new URLSearchParams(search);
  const instrumentSlug = params.get("instrument");
  const similarSlug = params.get("similar");
  const slug = instrumentSlug ?? similarSlug;
  if (!slug || !Object.hasOwn(entries, slug)) return undefined;
  const item = entries[slug];
  const similar = Boolean(similarSlug && !instrumentSlug) || item.status === "sold";
  return {
    ...item,
    slug,
    similar,
    canArrangeAppointment: item.status === "available" && !similar,
    label: instrumentStatusLabels[item.status],
    contextLabel: similar || item.status === "unavailable" ? "Reference instrument" : "Your instrument enquiry",
    note: similar && item.status === "sold"
      ? "This bass has been sold. You can ask about the availability of similar instruments."
      : instrumentStatusNotes[item.status],
  };
}
