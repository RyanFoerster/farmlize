export interface SeasonItem {
  name: string;
  kind: 'legume' | 'fruit';
  months: number[];
  color: string;
}

function m(...ranges: string[]): number[] {
  const out = new Set<number>();
  for (const r of ranges) {
    const [a, b = a] = r.split('-').map(Number);
    let i = a;
    out.add(i);
    while (i !== b) {
      i = (i % 12) + 1;
      out.add(i);
    }
  }
  return [...out];
}

/** Calendrier indicatif des fruits & légumes de saison en Belgique (pleine terre + conservation). */
export const seasonItems: SeasonItem[] = [
  { name: 'Asperges', kind: 'legume', months: m('4-6'), color: '#EDEACB' },
  { name: 'Betteraves', kind: 'legume', months: m('7-3'), color: '#C2416B' },
  { name: 'Brocolis', kind: 'legume', months: m('6-10'), color: '#6E9A4B' },
  { name: 'Carottes', kind: 'legume', months: m('6-3'), color: '#F7963A' },
  { name: 'Céleri-rave', kind: 'legume', months: m('9-3'), color: '#E4DCC0' },
  { name: 'Chicons', kind: 'legume', months: m('10-4'), color: '#F3EDA8' },
  { name: 'Choux de Bruxelles', kind: 'legume', months: m('10-2'), color: '#8DB45E' },
  { name: 'Chou-fleur', kind: 'legume', months: m('6-11'), color: '#F2EEDF' },
  { name: 'Chou rouge', kind: 'legume', months: m('8-3'), color: '#8A4C8F' },
  { name: 'Chou kale', kind: 'legume', months: m('11-3'), color: '#4F7A3E' },
  { name: 'Concombres', kind: 'legume', months: m('6-9'), color: '#7FAE4F' },
  { name: 'Courgettes', kind: 'legume', months: m('6-9'), color: '#5E8C3F' },
  { name: 'Courges', kind: 'legume', months: m('9-12'), color: '#F08A3C' },
  { name: 'Épinards', kind: 'legume', months: m('4-6', '9-11'), color: '#3F6B39' },
  { name: 'Fèves', kind: 'legume', months: m('6-8'), color: '#A9C77A' },
  { name: 'Haricots verts', kind: 'legume', months: m('7-9'), color: '#7FA84C' },
  { name: 'Laitues', kind: 'legume', months: m('5-9'), color: '#B9D58C' },
  { name: 'Navets', kind: 'legume', months: m('9-3'), color: '#D9B3D6' },
  { name: 'Oignons', kind: 'legume', months: m('7-3'), color: '#D9A066' },
  { name: 'Panais', kind: 'legume', months: m('10-3'), color: '#EFE2BE' },
  { name: 'Petits pois', kind: 'legume', months: m('6-7'), color: '#9CC56A' },
  { name: 'Poireaux', kind: 'legume', months: m('9-4'), color: '#A3C27F' },
  { name: 'Poivrons', kind: 'legume', months: m('7-9'), color: '#FA7474' },
  { name: 'Pommes de terre', kind: 'legume', months: m('6-4'), color: '#E6C48A' },
  { name: 'Radis', kind: 'legume', months: m('4-9'), color: '#F17A9B' },
  { name: 'Rhubarbe', kind: 'legume', months: m('4-6'), color: '#E46A7E' },
  { name: 'Salsifis', kind: 'legume', months: m('10-2'), color: '#8C6E54' },
  { name: 'Tomates', kind: 'legume', months: m('7-9'), color: '#F45B4F' },
  { name: 'Topinambours', kind: 'legume', months: m('10-3'), color: '#C79A6B' },
  { name: 'Cassis', kind: 'fruit', months: m('7'), color: '#4B2E5C' },
  { name: 'Cerises', kind: 'fruit', months: m('6-7'), color: '#C8323F' },
  { name: 'Coings', kind: 'fruit', months: m('10-11'), color: '#F2D35B' },
  { name: 'Fraises', kind: 'fruit', months: m('5-8'), color: '#F25C5C' },
  { name: 'Framboises', kind: 'fruit', months: m('6-9'), color: '#E8577A' },
  { name: 'Groseilles', kind: 'fruit', months: m('6-8'), color: '#F0485A' },
  { name: 'Mirabelles', kind: 'fruit', months: m('8-9'), color: '#F6C343' },
  { name: 'Mûres', kind: 'fruit', months: m('8-9'), color: '#3D2B45' },
  { name: 'Myrtilles', kind: 'fruit', months: m('7-8'), color: '#4C5D9C' },
  { name: 'Noisettes', kind: 'fruit', months: m('9-10'), color: '#B07A4A' },
  { name: 'Noix', kind: 'fruit', months: m('9-11'), color: '#A88660' },
  { name: 'Poires', kind: 'fruit', months: m('8-3'), color: '#C9D46A' },
  { name: 'Pommes', kind: 'fruit', months: m('8-4'), color: '#F0605D' },
  { name: 'Prunes', kind: 'fruit', months: m('8-9'), color: '#7D4A8C' },
  { name: 'Raisins', kind: 'fruit', months: m('9-10'), color: '#8E9C4B' },
];

export const monthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
