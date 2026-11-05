/**
 * Encres « risographie » des illustrations.
 * Couleurs franches, peu nombreuses, qui se superposent ; le corail et le jaune font le lien avec l'UI.
 */
export const ink = {
  blue: '#3563c9',
  sky: '#8db3ef',
  orange: '#ffa21f',
  red: '#f05a28',
  coral: '#fa7474',
  pink: '#ffa3c2',
  yellow: '#ffd33d',
  green: '#157a4c',
  leaf: '#62b35d',
  brown: '#3a2420',
  taupe: '#b59e88',
  paper: '#fbf6ea',
} as const;

export type InkName = keyof typeof ink;

/** Encres disponibles pour les ombrages tramés : url(#ri-{clé}-{direction}). */
export const shadeInks = {
  k: ink.brown,
  w: ink.paper,
  b: ink.blue,
  r: ink.red,
  g: ink.green,
  p: ink.pink,
  y: ink.yellow,
  o: ink.orange,
} as const;

/**
 * Directions d'ombrage : b = vers le bas, t = vers le haut, l = gauche, r = droite,
 * d = diagonale bas-droite, c = bords (radial).
 */
export const shadeDirs = ['b', 't', 'l', 'r', 'd', 'c'] as const;

/** Étoile à n branches (chemin SVG). */
export function starPath(cx: number, cy: number, outer: number, inner: number, n = 8) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

/** Hexagone (alvéole) centré. */
export function hexPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

/** Raccourci : fill + filtre de trame. */
export const shade = (key: keyof typeof shadeInks, dir: (typeof shadeDirs)[number]) => ({
  fill: `url(#ri-${key}-${dir})`,
  filter: 'url(#ri-dot)',
});
