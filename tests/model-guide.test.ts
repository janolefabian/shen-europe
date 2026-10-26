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

test("Panormo changes only the lower closing curve and identifies the schematic Rogeri reference", () => {
  const panormo = modelOutlineDefinitions.panormo;
  const visibleContour = "M640 156 H676 C689 198 741 217 799 249 C947 313 1029 385 1011 493 C1009 573 1001 642 980 681 Q974 693 994 703 L987 715 C947 693 916 723 905 766 C885 832 901 960 932 1006 C958 1045 1006 1053 1035 1033 L1040 1048 C1019 1090 1067 1178 1100 1289 C1133 1419 1116 1545 1059 1605";
  assert.ok(panormo.halfPath.startsWith(visibleContour + " C"));
  assert.equal(panormo.completionReference, "rogeri");
  assert.match(panormo.completionNote, /partly obscured.*schematically.*Rogeri/);
  assert.deepEqual([panormo.center, panormo.top], [640, 156]);

  const closingCurve = panormo.halfPath.slice(visibleContour.length).match(/\d+(?:\.\d+)?/g)?.map(Number);
  assert.ok(closingCurve);
  assert.equal(closingCurve.length, 6);
  const [c1x, c1y, c2x, c2y, endX, endY] = closingCurve;
  // Equal tangent vectors at the old/new join, and horizontal at the mirrored centre.
  assert.deepEqual([c1x - 1059, c1y - 1605], [1059 - 1116, 1605 - 1545]);
  assert.equal(c2y, endY);
  assert.equal(endX, panormo.center);
  assert.equal(endY, panormo.bottom);
  const bodyHeight = panormo.bottom - panormo.top;
  assert.ok((endY - 1605) / bodyHeight < .08,
    "The closing section must stay shallow instead of adding an overly round lower bowl.");
  assert.ok(1059 > c1x && c1x > c2x && c2x > endX);
  assert.ok(1605 < c1y && c1y < c2y);

  // At a horizontal cubic endpoint, curvature is 2/3 * rise / handleLength².
  // Normalise by body height to compare the central flatness with Rogeri.
  const centralCurvature = 2 / 3 * (endY - c1y) / (c2x - endX) ** 2 * bodyHeight;
  const rogeri = modelOutlineDefinitions.rogeri;
  const rogeriClosingCurve = rogeri.halfPath.match(/C\s*([\d\s]+)$/)?.[1].trim().split(/\s+/).map(Number);
  assert.ok(rogeriClosingCurve);
  const [, rogeriC1y, rogeriC2x, , rogeriEndX, rogeriEndY] = rogeriClosingCurve;
  const rogeriCurvature = 2 / 3 * (rogeriEndY - rogeriC1y) / (rogeriC2x - rogeriEndX) ** 2 * (rogeri.bottom - rogeri.top);
  assert.ok(centralCurvature > 0 && centralCurvature <= rogeriCurvature,
    "Panormo's central base should be gently curved and at least as flat as Rogeri's.");
});
