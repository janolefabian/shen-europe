import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const listHtml = (folder) => readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
  const path = join(folder, entry.name);
  return entry.isDirectory() ? listHtml(path) : path.endsWith(".html") ? [path] : [];
});
const pages = listHtml("dist");
const read = (path) => readFileSync(`dist/${path}`, "utf8");

test("all public pages retain noindex and contain no cross-brand contact or unconfirmed service promises", () => {
  assert.equal(pages.length, 10);
  for (const path of pages) {
    const html = readFileSync(path, "utf8");
    assert.match(html, /name="robots"[^>]*noindex/, path);
    assert.match(html, /name="googlebot"[^>]*noindex/, path);
    assert.doesNotMatch(html, /tempera-strings\.com|set up in Berlin|special orders?|1 year limited warranty|under inspection|hand-applied oil varnish/i, path);
    // Corporate legal identifiers belong in legal disclosures, not editorial branding.
    if (!/\/(imprint|privacy|legal)\//.test(path)) assert.doesNotMatch(html, /\bGmbH\b/i, path);
  }
});

test("home focuses on available carved instruments and puts the inventory link first", () => {
  const html = read("index.html");
  assert.match(html, /SB-800/);
  assert.match(html, /SB-1000/);
  assert.doesNotMatch(html, /SB-200/);
  assert.ok(html.indexOf('href="/shen-europe/available"') < html.indexOf('href="/shen-europe/models"'));
});

test("sold references are outside the available stock section", () => {
  const html = read("available/index.html");
  const current = html.match(/data-inventory-status="available"[\s\S]*?<\/section>/)?.[0] ?? "";
  const sold = html.match(/data-inventory-status="sold"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(current, /SB-800/);
  assert.match(current, /SB-1000/);
  assert.match(current, /SB-150/);
  assert.doesNotMatch(current, /SB-200/);
  assert.match(sold, /SB-200/);
  assert.match(sold, /Sold/);
  assert.match(current, /sb-800-shen-classic-3-4-bass-0003/);
});

test("all pages use deployable internal links and image files", () => {
  for (const path of pages) {
    const html = readFileSync(path, "utf8");
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[^"\s]*)"/g)) {
      const url = decodeURIComponent(match[1]);
      assert.ok(url.startsWith("/shen-europe/"), `${path}: ${url}`);
      const diskPath = "dist/" + url.slice("/shen-europe/".length);
      assert.ok(existsSync(diskPath) || existsSync(join(diskPath, "index.html")), `${path}: missing ${url}`);
    }
  }
});

test("the SB-800 retains its seven real gallery photos and documented strings", () => {
  const html = read("instruments/sb-800-shen-classic-3-4-bass-0003/index.html");
  assert.equal([...html.matchAll(/<img\b/g)].length, 8);
  assert.match(html, /Tempera BASSO/);
  assert.match(html, /Available to try in Berlin by appointment/);
  assert.match(html, /discuss its current condition/);
  assert.doesNotMatch(html, /Not available|not available to try or buy|not offered for trial or sale/);
  assert.doesNotMatch(html, /soloistic|refined voice|solo ambitions|<dt[^>]*>Inventory/i);
});

test("model guide links only available examples without inventing catalogue promises", () => {
  const html = read("models/index.html");
  assert.doesNotMatch(html, /No example currently|5-Saiter|Carved solid wood throughout|SB-190|SB-288|Mahogany/);
  assert.match(html, /href="[^"]*sb-800-shen-classic/);
  const available = [...html.matchAll(/class="available-examples"[^>]*>[\s\S]*?<\/div>/g)].map(([panel]) => panel);
  assert.equal(available.length, 3);
  for (const level of ["SB-800", "SB-1000", "SB-150"]) {
    assert.ok(available.some(panel => panel.includes("Available to try") && panel.includes(level)), level);
  }
});

test("model guide renders the complete illustrated catalogue with one construction heading per group", () => {
  const html = read("models/index.html");
  assert.equal([...html.matchAll(/data-entry="/g)].length, 17);
  assert.equal([...html.matchAll(/data-details="/g)].length, 17);
  assert.equal([...html.matchAll(/data-source="/g)].length, 9);
  for (const group of ["fully-carved", "hybrid", "laminated"]) {
    assert.equal([...html.matchAll(new RegExp(`id="heading-${group}"`, "g"))].length, 1);
  }
  assert.match(html, /Body lengths to scale/);
  assert.match(html, /Widths estimated from photographs/);
  assert.doesNotMatch(html, /equal height|Model guide · Preview/);
  for (const group of ["fully-carved", "hybrid", "laminated"]) assert.match(html, new RegExp(`id="${group}"`));
  assert.match(html, /<dialog[^>]*aria-labelledby="mobile-comparison-title"/);
  assert.match(html, /data-model-picker/);
  assert.match(html, /data-pin-current/);
  assert.match(html, /Gamba outline shown/);
  assert.match(html, /US specification lists laminated willow ribs/);
  assert.doesNotMatch(html, /<img\b|example-photo|Photograph of this instrument/);
  assert.equal([...html.matchAll(/class="available-examples"/g)].length, 3);
  assert.doesNotMatch(html, /Reading the model name|Drawing reference<\/summary>/);
});

test("model guide has one optional name explanation instead of a competing intro panel", () => {
  const html = read("models/index.html");
  const guide = html.match(/<details\b[^>]*class="name-guide"[^>]*>[\s\S]*?<\/details>/)?.[0];
  assert.ok(guide);
  assert.doesNotMatch(guide.split(">")[0], /\bopen\b/);
  assert.match(guide, /Model names and SB numbers/);
  assert.match(guide, /Shen Classic/);
  assert.match(guide, /Wood selection/);
  assert.equal([...html.matchAll(/class="name-example"/g)].length, 1);
  assert.doesNotMatch(html, /intro-grid|mobile-name-guide|A model name, explained/);
});

test("Panormo drawing discloses the schematic lower edge without presenting it as measured geometry", () => {
  const html = read("models/index.html");
  const panormo = html.match(/<div\b[^>]*data-details="Panormo"[^>]*>[\s\S]*?<\/details>/)?.[0];
  assert.ok(panormo);
  assert.match(panormo, /provisional local reference/);
  assert.match(panormo, /partly obscured[\s\S]*?schematically[\s\S]*?Rogeri/);
  assert.match(html, /simplified, symmetrical illustrations, not measured plans/);
});

test("instrument pages distinguish individual notes from reference specifications", () => {
  for (const slug of ["sb-1000-panormo-bass-0004", "sb-800-shen-classic-3-4-bass-0003"]) {
    const html = read(`instruments/${slug}/index.html`);
    assert.match(html, /Solid maple/);
    assert.match(html, /Model-reference specifications/);
    assert.doesNotMatch(html, /<dt[^>]*>Inventory|Fully carved maple<\/dd>|intended for orchestral players/);
  }
  const panormo = read("instruments/sb-1000-panormo-bass-0004/index.html");
  assert.match(panormo, /Our playing impression of this particular SB-1000/);
  assert.match(panormo, /Tuning machine detail/);
});

test("About pairs two Suzhou photographs with one undated Samuel archival photograph", () => {
  const html = read("about/index.html");
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([image]) => image);
  assert.equal(images.length, 3);
  assert.match(images[0], /loading="eager"/);
  assert.match(images[0], /fetchpriority="high"/);
  for (const image of images.slice(1)) assert.match(image, /loading="lazy"/);
  for (const image of images) {
    assert.match(image, /srcset="[^"]+\.webp/);
    assert.match(image, /alt="[^"]+"/);
    assert.match(image, /width="\d+"/);
    assert.match(image, /height="\d+"/);
  }
  assert.equal([...html.matchAll(/data-suzhou-photo="/g)].length, 2);
  assert.equal([...html.matchAll(/data-archive-photo="/g)].length, 1);
  assert.match(images[0], /alt="[^"]+Suzhou"/);
  assert.match(images[1], /alt="Samuel Shen[^"]+undated archival photograph"/);
  assert.match(images[2], /alt="[^"]+Suzhou"/);
  assert.match(html, /Photograph supplied by Shen/);
  assert.doesNotMatch(html, /data-suzhou-photo="workshop-bodies"/);
  assert.doesNotMatch(html, /varnished-basses|Rows of varnished double basses|Double basses at Shen in Suzhou\./);
  assert.doesNotMatch(html, /SB-800 · Shen Classic 3\/4, corner detail|design-studies|ai-lighting|cleaned-v2|generated_images/);
});

test("Samuel's biography stays factual and does not assign a date or location to the archive photo", () => {
  const html = read("about/index.html");
  const story = html.match(/<section\b[^>]*id="samuel-shen"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(story);
  assert.match(story, /aria-labelledby="samuel-shen-title"/);
  assert.match(story, /trained as a violin maker in Canada/);
  assert.match(story, /ran his own workshop/);
  assert.match(story, /later returned to China/);
  assert.match(story, /Samuel Shen at the workbench\. Undated archival photograph\./);
  const caption = story.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)?.[1] ?? "";
  assert.doesNotMatch(caption, /Canada|Suzhou|China|\b(?:19|20)\d{2}\b|1990s|1980s/);
  assert.doesNotMatch(story, /master luthier|generations|centuries|award-winning|European tradition/i);
});

test("Suzhou source files remain identical to the approved Canva exports", () => {
  const folder = "src/assets/suzhou";
  const provenance = JSON.parse(readFileSync(join(folder, "provenance.json"), "utf8"));
  assert.equal(provenance.files.length, 4);
  for (const { file, sha256 } of provenance.files) {
    assert.equal(createHash("sha256").update(readFileSync(join(folder, file))).digest("hex"), sha256, file);
  }
});

test("the contact page offers a real telephone route, no placeholder mail link", () => {
  const html = read("contact/index.html");
  assert.match(html, /href="tel:\+493088697738"/);
  assert.doesNotMatch(html, /href="mailto:/);
  assert.match(html, /id="appointments"/);
  assert.match(html, /id="dealers"/);
});
