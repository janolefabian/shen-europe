import { bassModelGroups } from './instrumentTaxonomy.ts';
import { modelPresentation } from './modelPresentation.ts';
import { comparisonModels } from './modelComparison.ts';

export const comparisonSections = [
  { id: 'fully-carved', name: 'Fully carved', description: 'Carved spruce tops, with maple or willow backs.', groups: ['Vollmassiv – Ahorn', 'Vollmassiv – Weide'] },
  { id: 'hybrid', name: 'Hybrid', description: 'Carved spruce tops with laminated backs and ribs.', groups: ['Hybrid'] },
  { id: 'laminated', name: 'Laminated', description: 'Laminated tops, backs and ribs.', groups: ['Laminat'] },
] as const;

// Keep catalogue identity distinct from illustrated shape: several models share a contour.
export const comparisonCatalogue = bassModelGroups.flatMap(group => {
  const section = comparisonSections.find(section => (section.groups as readonly string[]).includes(group.label))!;
  return group.options.map(option => {
    const presentation = modelPresentation[option.value];
    const dimensions = comparisonModels.find(model => model.key === presentation.pattern)!;
    return {
      id: option.value,
      label: option.label,
      name: presentation.name,
      size: presentation.size || '3/4 outline shown',
      levels: [...option.qualities] as string[],
      pattern: presentation.pattern,
      section: section.id,
      construction: section.name,
      group: group.label,
      material: group.label === 'Vollmassiv – Ahorn' ? 'Maple' : group.label === 'Vollmassiv – Weide' ? 'Willow' : '',
      note: presentation.note || '',
      source: presentation.source,
      body: dimensions.body,
      string: dimensions.string,
      provisional: !!dimensions.provisional,
    };
  }).sort((a,b) => b.body-a.body || Number(a.levels[0].slice(3))-Number(b.levels[0].slice(3)));
});

export function availableComparisonInstruments<T extends { data: { status: string; outline: string; model: string } }>(entry: typeof comparisonCatalogue[number], instruments: T[]): T[] {
  return instruments.filter(({data}) => data.status === 'available' && data.outline === entry.id && entry.levels.includes(data.model));
}
