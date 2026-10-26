import type { ModelOutlineKey } from './modelOutlines';

// CSC US catalogue checked 2026-10-25. Keep original inches; convert only for display.
// Lengths do not validate the widths of the photograph-derived outlines.
export interface ComparisonModel {
  key: ModelOutlineKey;
  name: string;
  body: number;
  string: number;
  source: string;
  provisional?: boolean;
}
const catalogue = 'https://cscproducts.com/products/';
export const comparisonModels: ComparisonModel[] = [
  { key: 'classic', name: 'Shen Classic', body: 43.75, string: 41.25, source: catalogue + 'bass-shen-classic-maple.html' },
  { key: 'rogeri', name: 'Rogeri', body: 44.625, string: 41.25, source: catalogue + 'bass-rogeri-maple.html' },
  { key: 'mirecourt', name: 'Mirecourt', body: 43.875, string: 41.25, source: catalogue + 'bass-mirecourt.html' },
  { key: 'busetto', name: 'Busetto', body: 43, string: 40.75, source: catalogue + 'bass-busetto.html' },
  { key: 'fiveEighths', name: 'Shen 5/8', body: 42.375, string: 39.75, source: catalogue + 'bass-shen-five-eighths.html' },
  { key: 'willow', name: 'Shen Willow', body: 43.625, string: 41.25, source: catalogue + 'bass-willow-three-quarter.html' },
  { key: 'gemunder', name: 'Gemunder', body: 45.5, string: 42, source: catalogue + 'bass-gemunder.html' },
  { key: 'gamba', name: 'Shen Gamba', body: 43.75, string: 41.25, source: catalogue + 'bass-sb150.html' },
  { key: 'panormo', name: 'Panormo', body: 44.25, string: 41.25, source: '/instruments/sb-1000-panormo-bass-0004/', provisional: true },
].sort((a, b) => b.body - a.body);

export const bodyBaseline = 465;
export const pixelsPerCm = 430 / (45.5 * 2.54);
export const formatCm = (inches: number) => (inches * 2.54).toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export function bodyTransform(bodyInches: number, outline: { center: number; top: number; bottom: number }) {
  const scale = bodyInches * 2.54 * pixelsPerCm / (outline.bottom - outline.top);
  return { scale, x: 200 - outline.center * scale, y: bodyBaseline - outline.bottom * scale };
}
