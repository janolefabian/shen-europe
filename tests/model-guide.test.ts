import assert from "node:assert/strict";
import test from "node:test";
import { bassModelGroups } from "../src/lib/instrumentTaxonomy.ts";
import { modelPresentation, modelDisplayPriority } from "../src/lib/modelPresentation.ts";
import { modelOutlineDefinitions } from "../src/lib/modelOutlines.ts";

test("all existing catalogue entries have an explicit, sourced outline mapping", () => {
  const options = bassModelGroups.flatMap(group => group.options);
  assert.equal(options.length, 17);
  assert.deepEqual(Object.keys(modelPresentation).sort(), options.map(option => option.value).sort());
  for (const option of options) {
    const display = modelPresentation[option.value];
    assert.ok(modelOutlineDefinitions[display.pattern], option.value);
    assert.ok(display.name);
    assert.match(display.source, /^(https:\/\/cscproducts\.com\/products\/|\/instruments\/)/);
  }
});

test("body paths are finite, source-based and normalised without changing aspect ratio", () => {
  assert.equal(Object.keys(modelOutlineDefinitions).length, 9);
  for (const outline of Object.values(modelOutlineDefinitions)) {
    assert.ok(outline.bottom > outline.top && outline.center > 0);
    assert.ok(Number.isFinite(360 / (outline.bottom - outline.top)));
    assert.match(outline.halfPath, /^M\s*\d/);
    assert.doesNotMatch(outline.halfPath, /NaN|undefined|Infinity/);
    assert.match(outline.referenceImage, /^(https:\/\/cscproducts\.com\/img\/product\/basses\/|src\/content\/instruments\/)/);
  }
});

test("related levels share a contour and the SB-150 depicts the stated gamba variant", () => {
  assert.equal(modelPresentation["Rogeri Willow"].pattern, modelPresentation.Rogeri.pattern);
  assert.equal(modelPresentation["Gemunder 7/8 Willow 5-String"].pattern, modelPresentation["Gemunder 7/8 Willow"].pattern);
  assert.equal(modelPresentation["Shen SB100 3/4"].pattern, modelPresentation["Shen Classic 3/4 Maple"].pattern);
  assert.equal(modelPresentation["Shen 3/4 Hybrid"].pattern, "gamba");
  assert.match(modelPresentation["Shen 3/4 Hybrid"].note ?? "", /Gamba outline shown.*violin-cornered/);
  assert.match(modelPresentation["Shen Willow 3/4 Flatback"].note ?? "", /laminated willow ribs/);
  assert.equal(modelOutlineDefinitions.panormo.referenceImage, "src/content/instruments/bass-0004/hero.png");
});

test("the maple display order leads with Panormo and Classic without changing catalogue combinations", () => {
  const group = bassModelGroups[0];
  const original = group.options.map(option => option.value);
  const sorted = [...group.options].sort((a,b) => modelDisplayPriority(a.value) - modelDisplayPriority(b.value));
  assert.deepEqual(sorted.slice(0,2).map(option => option.value), ["Panormo", "Shen Classic 3/4 Maple"]);
  assert.deepEqual(group.options.map(option => option.value), original);
  assert.deepEqual(sorted.find(option => option.value === "Panormo")?.qualities, ["SB-1000"]);
});
