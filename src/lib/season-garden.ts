/**
 * Le « potager du mois » de la home : les fruits et légumes de saison disposés en couronne
 * autour du nom du mois (positions en % de la scène, tailles et inclinaisons variées mais stables).
 * Partagé entre le rendu serveur et le navigateur (qui se recale sur le mois du visiteur).
 */
import { seasonItems } from '../data/seasons';
import { seasonArt } from './season-art';

export type Sprout = { name: string; color: string; x: number; y: number; size: number; rot: number; dur: number; delay: number };

/** Couronne aux coins arrondis (« squircle ») : dans les diagonales, les pousses restent à distance du titre. */
const sq = (v: number) => Math.sign(v) * Math.abs(v) ** 0.6;

export function gardenSprouts(month: number, max = 18): Sprout[] {
  const items = seasonItems.filter((s) => s.months.includes(month)).slice(0, max);
  const n = items.length || 1;
  return items.map((it, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.22 * Math.sin(i * 2.3);
    const rx = 42 + 4 * Math.sin(i * 1.7);
    const ry = 39 + 5 * Math.cos(i * 1.3);
    return {
      name: it.name,
      color: it.color,
      x: +(50 + sq(Math.cos(a)) * rx).toFixed(2),
      y: +(50 + sq(Math.sin(a)) * ry).toFixed(2),
      size: 72 + ((i * 37) % 5) * 10,
      rot: ((i * 53) % 40) - 20,
      dur: +(3 + ((i * 29) % 7) * 0.35).toFixed(2),
      delay: -((i * 0.7) % 3).toFixed(2),
    };
  });
}

/** Balisage d'une pousse (utilisé côté navigateur quand le mois change). */
export function sproutHTML(s: Sprout) {
  return `<li class="sprout" style="left:${s.x}%;top:${s.y}%;--s:${s.size}px;--r:${s.rot}deg;--c:${s.color}">
  <span class="sprout__btn">
    <span class="sprout__float" style="--dur:${s.dur}s;--d:${s.delay}s"><svg class="riso" viewBox="0 0 60 60" aria-hidden="true">${seasonArt(s.name)}</svg></span>
    <span class="sprout__label">${s.name}</span>
  </span>
</li>`;
}
