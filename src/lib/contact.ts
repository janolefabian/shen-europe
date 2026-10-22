// Add only a confirmed, working Shen Europe address. Never substitute another brand.
export const contactEmail: string | null = null;
export const contactPhone = "+49 (0) 30 88697738";
export const contactPhoneHref = "tel:+493088697738";

export function contactLink(subject: string, body: string): string {
  return contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : contactPhoneHref;
}
