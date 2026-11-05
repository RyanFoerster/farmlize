export type CategoryId =
  | 'legumes'
  | 'fruits'
  | 'oeufs'
  | 'fromages'
  | 'pain'
  | 'miel'
  | 'viandes'
  | 'lait';

export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  color: string;
  tint: string;
}

export const categories: Category[] = [
  { id: 'legumes', label: 'Légumes', short: 'Légumes', color: '#E9694F', tint: '#FBE2D9' },
  { id: 'fruits', label: 'Fruits', short: 'Fruits', color: '#F0A8BF', tint: '#FBE7EE' },
  { id: 'oeufs', label: 'Œufs', short: 'Œufs', color: '#F4B866', tint: '#FCEBD2' },
  { id: 'fromages', label: 'Fromages', short: 'Fromages', color: '#F3D677', tint: '#FBF1CF' },
  { id: 'pain', label: 'Pains & farines', short: 'Pain', color: '#DDB383', tint: '#F5E9D9' },
  { id: 'miel', label: 'Miel', short: 'Miel', color: '#F0973F', tint: '#FCE3C8' },
  { id: 'viandes', label: 'Viandes', short: 'Viandes', color: '#A2C48A', tint: '#E6F0DE' },
  { id: 'lait', label: 'Produits laitiers', short: 'Laitiers', color: '#BCD0F0', tint: '#E6EDFA' },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>;
