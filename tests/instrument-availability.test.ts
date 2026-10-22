import assert from "node:assert/strict";
import test from "node:test";
import { groupInventory, selectHomepageInstruments, instrumentStatusNotes, isListedStatus, type InstrumentStatus } from "../src/lib/instrumentAvailability.ts";
import { contactEmail, contactLink, contactPhoneHref } from "../src/lib/contact.ts";
import { resolveInstrumentInquiry } from "../src/lib/instrumentInquiry.ts";

const entry = (model: string, status: InstrumentStatus = "available", order = 100, featured = false) => ({
  data: { model, status, order, featured },
});

test("public groups separate stock states and omit unavailable entries without mutation", () => {
  const items = [entry("SB-200", "sold"), entry("SB-800", "reserved"), entry("SB-1000", "coming-soon"), entry("SB-150"), entry("SB-800", "available", 50), entry("SB-800", "unavailable")];
  const original = [...items];
  const groups = groupInventory(items);
  assert.deepEqual(groups.map(({ status }) => status), ["available", "coming-soon", "reserved", "sold"]);
  for (const group of groups) assert.ok(group.instruments.every(({ data }) => data.status === group.status));
  assert.equal(groups.flatMap(({ instruments }) => instruments).length, items.filter(({data}) => isListedStatus(data.status)).length);
  assert.ok(groups.flatMap(({ instruments }) => instruments).every(({data}) => data.status !== "unavailable"));
  assert.equal(groups[0].instruments[0].data.model, "SB-800");
  assert.deepEqual(items, original);
});

test("home prioritises available SB-1000 and SB-800, never unavailable or sold stock", () => {
  const items = [entry("SB-150", "available", 0, true), entry("SB-1000"), entry("SB-800"), entry("SB-800", "sold", 0, true)];
  assert.deepEqual(selectHomepageInstruments(items).map(({ data }) => data.model), ["SB-1000", "SB-800"]);
  assert.deepEqual(selectHomepageInstruments(items, 1).map(({ data }) => data.model), ["SB-1000"]);
  assert.equal(selectHomepageInstruments([entry("SB-800", "reserved"), entry("SB-1000", "coming-soon"), entry("SB-1000", "sold"), entry("SB-800", "unavailable")]).length, 0);
  assert.deepEqual(selectHomepageInstruments([entry("SB-150")]).map(({ data }) => data.model), ["SB-150"]);
});

test("status messages distinguish appointments, arrivals, reservations and references", () => {
  assert.match(instrumentStatusNotes.available, /by appointment/);
  assert.match(instrumentStatusNotes["coming-soon"], /not yet available to try/);
  assert.match(instrumentStatusNotes.reserved, /reserved/);
  assert.match(instrumentStatusNotes.sold, /not available to try or buy/);
  assert.match(instrumentStatusNotes.unavailable, /not available to try or buy/);
  assert.doesNotMatch(instrumentStatusNotes.unavailable, /inspection|repair|sold|reserved/i);
});

test("contact context distinguishes an appointment from unavailable and sold references", () => {
  const entries = {
    panormo: { title: "SB-1000 · Panormo", status: "available" as const },
    classic: { title: "SB-800 · Shen Classic 3/4", status: "unavailable" as const },
    willow: { title: "SB-200 · Rogeri Willow", status: "sold" as const },
    incoming: { title: "Incoming Panormo", status: "coming-soon" as const },
    reserved: { title: "Reserved bass", status: "reserved" as const },
  };
  assert.equal(resolveInstrumentInquiry(entries, "?instrument=panormo")?.canArrangeAppointment, true);
  for (const slug of ["classic", "willow", "incoming", "reserved"]) {
    assert.equal(resolveInstrumentInquiry(entries, `?instrument=${slug}`)?.canArrangeAppointment, false);
  }
  const unavailable = resolveInstrumentInquiry(entries, "?instrument=classic");
  assert.equal(unavailable?.label, "Not available");
  assert.equal(unavailable?.similar, false);
  assert.match(unavailable!.note, /not available to try or buy/);
  assert.equal(resolveInstrumentInquiry(entries, "?similar=willow")?.similar, true);
  assert.equal(resolveInstrumentInquiry(entries, "?instrument=willow")?.similar, true);
  assert.equal(resolveInstrumentInquiry(entries, "?similar=panormo")?.canArrangeAppointment, false);
  assert.equal(resolveInstrumentInquiry(entries, "?instrument=unknown"), undefined);
  assert.equal(resolveInstrumentInquiry(entries, "?instrument=__proto__"), undefined);
  assert.equal(resolveInstrumentInquiry(entries, ""), undefined);
});

test("unconfirmed email never creates a broken or cross-brand mail link", () => {
  assert.equal(contactEmail, null);
  assert.equal(contactLink("Trade enquiry", "Hello Shen Europe"), contactPhoneHref);
  assert.match(contactPhoneHref, /^tel:\+\d+$/);
});
