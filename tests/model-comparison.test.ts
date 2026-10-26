import assert from 'node:assert/strict';
import test from 'node:test';
import { bassModelGroups } from '../src/lib/instrumentTaxonomy.ts';
import { comparisonCatalogue, comparisonSections, availableComparisonInstruments } from '../src/lib/comparisonCatalogue.ts';
import { bodyTransform, pixelsPerCm, bodyBaseline } from '../src/lib/modelComparison.ts';
import { modelOutlineDefinitions } from '../src/lib/modelOutlines.ts';

test('grouped comparison preserves every catalogue entry and specification level', () => {
  assert.equal(new Set(comparisonCatalogue.map(e=>e.id)).size,17);
  for(const group of bassModelGroups) for(const option of group.options) {
    const entry=comparisonCatalogue.find(e=>e.id===option.value)!;
    assert.ok(entry);
    assert.equal(entry.group,group.label);
    assert.deepEqual(entry.levels,option.qualities);
  }
  assert.deepEqual(comparisonSections.map(s=>comparisonCatalogue.filter(e=>e.section===s.id).length),[10,3,4]);
});
test('each material or construction group sorts by descending reference length', () => {
  for(const group of bassModelGroups) {
    const entries=comparisonCatalogue.filter(e=>e.group===group.label);
    for(let i=1;i<entries.length;i++) assert.ok(entries[i-1].body>=entries[i].body);
  }
  for(const entry of comparisonCatalogue) {
    const outline=modelOutlineDefinitions[entry.pattern],t=bodyTransform(entry.body,outline);
    assert.ok(Math.abs(t.y+outline.bottom*t.scale-bodyBaseline)<1e-8);
    assert.ok(Math.abs((outline.bottom-outline.top)*t.scale-entry.body*2.54*pixelsPerCm)<1e-8);
  }
});
test('shared shapes retain separate catalogue identities and construction context', () => {
  const carved=comparisonCatalogue.find(e=>e.id==='Gemunder 7/8 Willow')!;
  const hybrid=comparisonCatalogue.find(e=>e.id==='Gemunder 7/8 Hybrid')!;
  assert.equal(carved.pattern,hybrid.pattern);
  assert.notEqual(carved.id,hybrid.id);
  assert.notEqual(carved.construction,hybrid.construction);
  assert.equal(comparisonCatalogue.find(e=>e.id==='Panormo')!.provisional,true);
  assert.match(comparisonCatalogue.find(e=>e.id==='Shen 3/4 Hybrid')!.note,/Gamba outline shown/);
});
test('available examples require exact model identity, allowed SB level and available status', () => {
  const entry=comparisonCatalogue.find(e=>e.id==='Gemunder 7/8 Hybrid')!;
  const instruments=[
    {data:{status:'available',outline:entry.id,model:'SB-150'}},
    {data:{status:'sold',outline:entry.id,model:'SB-150'}},
    {data:{status:'available',outline:'Gemunder 7/8 Willow',model:'SB-200'}},
    {data:{status:'available',outline:entry.id,model:'SB-800'}},
  ];
  assert.deepEqual(availableComparisonInstruments(entry,instruments),[instruments[0]]);
});
