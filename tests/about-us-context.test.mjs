import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const about = readFileSync("dist/about/index.html", "utf8");
const home = readFileSync("dist/index.html", "utf8");
const section = about.match(/<section\b[^>]*id="shen-in-the-us"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";

test("US context is limited to About, with two directly attributed sources", () => {
  assert.ok(section);
  assert.match(section, /aria-labelledby="shen-in-the-us-title"/);
  assert.match(section, /Shen in the United States/);
  assert.match(section, /represented in the United States by/);
  assert.match(section, /href="https:\/\/cscproducts\.com\/"[^>]*>CSC Products<\/a>/);
  assert.match(section, /sold through specialist instrument shops/);
  assert.match(section, /published comments on the Shen range, US dealer/);
  assert.match(section, /href="https:\/\/www\.brucewallacebass\.com\/basssales"[^>]*>Wallace Bass Shop<\/a>/);
  assert.match(section, /design, workmanship and seasoned wood/);
  assert.equal([...section.matchAll(/<p\b/g)].length, 2);
  assert.equal([...section.matchAll(/<a\b/g)].length, 2);
  assert.doesNotMatch(home, /shen-in-the-us|Wallace Bass Shop|brucewallacebass\.com/);
});

test("US context does not imply independent endorsement, model-specific evidence or shared services", () => {
  assert.doesNotMatch(section, /<blockquote\b|<img\b|<iframe\b/);
  assert.doesNotMatch(section, /\bSB[- ]?\d+|\b(?:19|20)\d{2}\b/);
  assert.doesNotMatch(section, /market leader|leading brand|world-renowned|world-famous|independent|top orchestras|guarantee|warranty|exclusive|our (?:dealers|partners)|best value|lowest price/i);
  assert.doesNotMatch(section, /setup|set.up|made in (?:the US|America)|manufactured in (?:the US|America)|Tempera/i);
  assert.match(about, /setup has\s+been carried out by Shen in China/);
  assert.match(about, /existing bridges\s+were stood up and strings were fitted/);
  assert.match(about, /name="robots"[^>]*noindex/);
});

test("US source links keep visible spaces between the linked names and surrounding words", () => {
  const visibleText = section.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");
  assert.match(visibleText, /by CSC Products and sold/);
  assert.match(visibleText, /US dealer Wallace Bass Shop highlights/);
});
