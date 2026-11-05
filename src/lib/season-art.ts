/**
 * Petites illustrations « risographie » des fruits et légumes du calendrier (viewBox 0 0 60 60).
 * Formes géométriques, encres franches, une trame d'ombre (#ri-dot) et une tige ou une feuille.
 * Utilisation : <svg viewBox="0 0 60 60" set:html={seasonArt(nom)} />
 */
import { ink, starPath } from './riso';

const { brown: K, paper: W, blue: B, sky: S, orange: O, red: R, coral: C, pink: P, yellow: Y, green: G, leaf: L, taupe: T } = ink;
const PL = '#7a3f86'; // violet : prunes, navets, chou rouge
const BE = '#c23a5e'; // magenta : betteraves, radis, rhubarbe, cerises
const NT = '#3a2f5b'; // nuit : cassis, mûres
const NU = '#b9773f'; // noisette

// --- briques de dessin
const path = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const shade = (d: string, k: string, dir = 'd') => `<path d="${d}" fill="url(#ri-${k}-${dir})" filter="url(#ri-dot)"/>`;
const circle = (cx: number, cy: number, r: number, fill: string) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
const cshade = (cx: number, cy: number, r: number, k: string, dir = 'd') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ri-${k}-${dir})" filter="url(#ri-dot)"/>`;
const ell = (cx: number, cy: number, rx: number, ry: number, fill: string, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${rot} ${cx} ${cy})"/>`;
const eshade = (cx: number, cy: number, rx: number, ry: number, k: string, dir = 'd', rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ri-${k}-${dir})" filter="url(#ri-dot)" transform="rotate(${rot} ${cx} ${cy})"/>`;
const line = (d: string, stroke: string, w = 2) =>
  `<path d="${d}" stroke="${stroke}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const stem = (d: string) => line(d, K, 2.2);
/** Feuille en amande partant de (x, y), orientée (degrés, 0 = vers la droite), avec ou sans nervure. */
const leaf = (x: number, y: number, angle: number, len: number, fill: string, rib?: string) => {
  const w = len * 0.4;
  const t = `translate(${x} ${y}) rotate(${angle})`;
  return (
    `<path d="M0 0 C ${len * 0.3} ${-w}, ${len * 0.75} ${-w * 0.8}, ${len} 0 C ${len * 0.75} ${w * 0.8}, ${len * 0.3} ${w}, 0 0 Z" fill="${fill}" transform="${t}"/>` +
    (rib ? `<path d="M1 0 L ${len * 0.82} 0" stroke="${rib}" stroke-width="1.4" stroke-linecap="round" transform="${t}"/>` : '')
  );
};
const berry = (cx: number, cy: number, r: number, fill: string, hl: string) =>
  circle(cx, cy, r, fill) + circle(cx - r * 0.35, cy - r * 0.35, r * 0.24, hl);

// --- les produits
const arts: Record<string, () => string> = {
  // ---------- fruits
  Pommes: () => {
    const b = 'M30 20 C 25 16, 11 16, 11 33 C 11 47, 21 55, 30 51 C 39 55, 49 47, 49 33 C 49 16, 35 16, 30 20 Z';
    return stem('M30 21 C 30 16 31 12 34 9') + path(b, C) + shade(b, 'r') + line('M17 31 C 17 27 19 25 22 24', W, 2.4) + leaf(33, 12, -25, 13, L, G);
  },
  Poires: () => {
    const b = 'M30 13 C 26 13 24 17 24 22 C 24 28 14 32 14 42 C 14 51 22 56 30 56 C 38 56 46 51 46 42 C 46 32 36 28 36 22 C 36 17 34 13 30 13 Z';
    return stem('M30 14 C 30 10 31 7 33 5') + path(b, L) + shade(b, 'y', 'r') + line('M19 41 C 19 37 20 35 22 34', W, 2.2) + leaf(31, 9, -20, 11, G);
  },
  Prunes: () =>
    stem('M31 17 C 31 12 32 9 35 7') +
    ell(30, 35, 14, 17, PL, -12) +
    eshade(30, 35, 14, 17, 'b', 'd', -12) +
    line('M29 19 C 23 27 23 43 28 51', NT, 1.6) +
    line('M21 31 C 21 28 23 26 25 25', P, 2.2) +
    leaf(34, 9, -30, 10, L),
  Mirabelles: () =>
    stem('M30 9 C 30 14 30 18 30 21') +
    stem('M30 11 C 26 15 22 20 21 28') +
    stem('M30 11 C 35 15 38 21 39 30') +
    berry(30, 27, 8.5, Y, W) +
    cshade(30, 27, 8.5, 'o') +
    berry(21, 38, 9.5, Y, W) +
    cshade(21, 38, 9.5, 'o') +
    berry(39, 40, 9.5, Y, W) +
    cshade(39, 40, 9.5, 'o') +
    leaf(30, 9, -35, 11, L),
  Coings: () => {
    const b = 'M30 15 C 22 15 20 22 21 27 C 14 31 12 40 16 47 C 20 55 40 55 44 47 C 48 40 46 31 39 27 C 40 22 38 15 30 15 Z';
    return (
      stem('M30 16 C 30 12 31 9 33 7') +
      path(b, Y) +
      shade(b, 'o') +
      [18, 24, 36, 41, 29, 33].map((x, i) => circle(x, [38, 46, 44, 37, 50, 33][i], 0.9, T)).join('') +
      leaf(32, 10, -15, 14, G, L)
    );
  },
  Cerises: () =>
    line('M21 35 C 22 24 27 15 33 10', G, 1.8) +
    line('M39 37 C 38 26 36 17 33 10', G, 1.8) +
    leaf(33, 10, -155, 13, L, G) +
    berry(21, 42, 9, BE, P) +
    cshade(21, 42, 9, 'k') +
    berry(39, 44, 9, BE, P) +
    cshade(39, 44, 9, 'k'),
  Fraises: () => {
    const b = 'M30 55 C 20 50 12 39 13 28 C 14 21 21 18 30 20 C 39 18 46 21 47 28 C 48 39 40 50 30 55 Z';
    const seeds = [
      [21, 28], [30, 27], [39, 28], [25, 36], [35, 36], [21, 42], [39, 42], [30, 44], [27, 50], [34, 49],
    ];
    return (
      stem('M30 13 C 30 9 32 6 35 4') +
      path(b, C) +
      shade(b, 'r') +
      seeds.map(([x, y]) => ell(x, y, 1.2, 1.9, Y)).join('') +
      path('M18 22 L 23 15 L 27 20 L 30 11 L 33 20 L 37 15 L 42 22 C 36 26 24 26 18 22 Z', G)
    );
  },
  Framboises: () => {
    const d = [
      [22, 27], [30, 26], [38, 27], [18, 34], [26, 34], [34, 34], [42, 34], [21, 41], [29, 41], [37, 41], [25, 48], [33, 48],
    ];
    return (
      d.map(([x, y]) => circle(x, y, 4.6, C) + circle(x - 1.4, y - 1.4, 1.1, P)).join('') +
      eshade(30, 37, 15, 15, 'r') +
      path('M21 23 L 25 17 L 28 21 L 31 15 L 34 21 L 38 18 L 39 23 C 33 26 26 26 21 23 Z', G) +
      stem('M31 17 C 31 12 33 9 36 7')
    );
  },
  Groseilles: () =>
    line('M14 9 C 24 12 32 20 38 32', G, 1.8) +
    leaf(14, 9, -160, 12, L, G) +
    [
      [22, 20, 5.5], [29, 26, 6], [36, 33, 6], [27, 37, 6], [38, 45, 6.5], [27, 48, 6],
    ]
      .map(([x, y, r]) => berry(x, y, r, C, W))
      .join('') +
    cshade(38, 45, 6.5, 'r') +
    cshade(27, 48, 6, 'r'),
  Cassis: () =>
    line('M14 9 C 24 12 32 20 38 32', G, 1.8) +
    leaf(14, 9, -160, 13, G, L) +
    [
      [23, 21, 6], [31, 27, 6.5], [37, 36, 7], [27, 38, 6.5], [36, 48, 7], [25, 49, 6.5],
    ]
      .map(([x, y, r]) => berry(x, y, r, NT, S))
      .join('') +
    cshade(37, 36, 7, 'k') +
    cshade(36, 48, 7, 'k'),
  Mûres: () => {
    const d = [
      [24, 26], [32, 25], [20, 33], [28, 33], [36, 33], [23, 40], [31, 40], [39, 40], [27, 47], [35, 47],
    ];
    return (
      stem('M29 19 C 29 14 31 10 34 8') +
      leaf(34, 9, -20, 12, L, G) +
      d.map(([x, y]) => circle(x, y, 4.6, NT) + circle(x - 1.4, y - 1.4, 1.1, PL)).join('') +
      path('M23 22 L 26 18 L 29 21 L 32 17 L 35 21 L 37 23 C 32 25 27 25 23 22 Z', G)
    );
  },
  Myrtilles: () =>
    leaf(30, 14, -150, 12, L, G) +
    leaf(30, 14, -30, 11, G) +
    [
      [30, 25, 8], [21, 38, 9], [39, 37, 9], [30, 48, 8],
    ]
      .map(([x, y, r]) => circle(x, y, r, B) + cshade(x, y, r, 'k') + path(starPath(x, y - r * 0.55, 2.6, 1.1, 5), NT) + circle(x - r * 0.4, y, r * 0.18, S))
      .join(''),
  Raisins: () =>
    stem('M30 16 C 30 11 32 8 36 6') +
    leaf(31, 12, -160, 15, G, L) +
    [
      [19, 22], [30, 21], [41, 22], [24.5, 31.5], [35.5, 31.5], [19, 41], [30, 41], [41, 41], [24.5, 50], [35.5, 50],
    ]
      .filter((_, i) => i !== 5 && i !== 7)
      .map(([x, y]) => berry(x, y, 6, L, W) + cshade(x, y, 6, 'g'))
      .join(''),
  Noisettes: () => {
    const b = 'M30 24 C 21 24 15 32 16 41 C 17 50 43 50 44 41 C 45 32 39 24 30 24 Z';
    return (
      path(b, NU) +
      shade(b, 'k') +
      path('M18 34 C 20 27 25 24 30 24 C 35 24 40 27 42 34 C 36 31 24 31 18 34 Z', T) +
      path('M13 30 L 17 20 L 21 26 L 25 13 L 30 22 L 35 13 L 39 26 L 43 20 L 47 30 C 40 25 20 25 13 30 Z', L) +
      line('M23 40 C 26 42 32 42 36 39', O, 1.6)
    );
  },
  Noix: () =>
    circle(30, 34, 17, T) +
    cshade(30, 34, 17, 'k') +
    line('M30 17 C 27 26 33 42 30 51', K, 1.8) +
    line('M20 26 C 23 29 21 33 24 36 S 22 43 25 46', K, 1.3) +
    line('M40 26 C 37 29 39 33 36 36 S 38 43 35 46', K, 1.3) +
    line('M18 34 C 20 30 22 28 24 27', W, 2),

  // ---------- légumes
  Asperges: () =>
    [-9, 0, 9]
      .map((a, i) => {
        const x = 21 + i * 9;
        return (
          `<g transform="rotate(${a} 30 56)">` +
          `<rect x="${x - 3.5}" y="14" width="7" height="42" rx="3.5" fill="${W}"/>` +
          `<rect x="${x - 3.5}" y="14" width="7" height="42" rx="3.5" fill="url(#ri-k-r)" filter="url(#ri-dot)"/>` +
          path(`M${x - 3.5} 22 C ${x - 3.5} 12, ${x + 3.5} 12, ${x + 3.5} 22 Z`, P) +
          line(`M${x - 3.5} 30 l 3 -2 M${x + 3.5} 37 l -3 -2`, P, 1.4) +
          `</g>`
        );
      })
      .join('') + `<rect x="16" y="41" width="28" height="6" rx="3" fill="${B}"/>`,
  Betteraves: () =>
    line('M28 24 C 27 20 26 17 24 14 M32 24 C 33 20 35 17 37 15', BE, 2) +
    leaf(24, 14, -115, 14, G, L) +
    leaf(37, 15, -65, 13, L, G) +
    circle(30, 37, 14, BE) +
    cshade(30, 37, 14, 'k') +
    line('M30 51 C 31 54 32 56 35 58', BE, 2.2) +
    line('M21 32 C 21 29 23 27 26 26', P, 2.2),
  Brocolis: () =>
    path('M24 56 C 26 46 26 40 23 33 L 37 33 C 34 40 34 46 36 56 Z', L) +
    shade('M24 56 C 26 46 26 40 23 33 L 37 33 C 34 40 34 46 36 56 Z', 'g', 'r') +
    [
      [19, 29, 9], [41, 29, 9], [30, 22, 11], [25, 34, 7], [35, 34, 7],
    ]
      .map(([x, y, r]) => circle(x, y, r, G))
      .join('') +
    cshade(19, 29, 9, 'k', 'b') +
    cshade(41, 29, 9, 'k', 'b') +
    [[16, 26], [22, 31], [27, 19], [33, 18], [38, 26], [43, 31], [30, 27]].map(([x, y]) => circle(x, y, 1.4, L)).join(''),
  Carottes: () => {
    const b = 'M13 23 C 11 17 19 11 25 15 L 48 49 C 49 52 46 54 44 52 Z';
    return (
      leaf(18, 16, -125, 14, G) +
      leaf(18, 15, -155, 13, L) +
      leaf(19, 15, -95, 12, L) +
      path(b, O) +
      shade(b, 'r', 'r') +
      line('M21 25 l 5 -3 M30 34 l 4 -3 M37 43 l 3 -2', R, 2.2)
    );
  },
  'Céleri-rave': () => {
    const b = 'M14 35 C 12 25 22 19 30 21 C 38 19 48 25 46 35 C 46 45 40 51 30 51 C 20 51 14 45 14 35 Z';
    return (
      line('M26 22 L 22 9 M30 21 L 30 7 M34 22 L 38 9', L, 3) +
      leaf(22, 9, -125, 9, G) +
      leaf(30, 7, -90, 9, G) +
      leaf(38, 9, -55, 9, G) +
      line('M24 50 l -3 6 M30 51 l 0 7 M36 50 l 3 6', K, 1.4) +
      path(b, W) +
      shade(b, 'k') +
      [[22, 30], [34, 28], [38, 40], [26, 43], [30, 35]].map(([x, y]) => circle(x, y, 1.2, T)).join('')
    );
  },
  Chicons: () => {
    const b = 'M30 7 C 40 17 42 36 38 50 C 36 56 24 56 22 50 C 18 36 20 17 30 7 Z';
    return (
      path(b, W) +
      shade(b, 'y', 'r') +
      path('M30 7 C 36 13 38 21 36 28 C 33 24 30 22 30 22 C 30 22 27 24 24 28 C 22 21 24 13 30 7 Z', Y) +
      line('M30 23 V 52 M25 31 C 26 40 26 46 26 52 M35 31 C 34 40 34 46 34 52', T, 1.3)
    );
  },
  'Choux de Bruxelles': () =>
    [
      [30, 25], [21, 38], [39, 38],
    ]
      .map(([x, y]) => circle(x, y, 10, L) + cshade(x, y, 10, 'g') + line(`M${x - 6} ${y + 2} C ${x - 2} ${y - 6}, ${x + 4} ${y - 6}, ${x + 7} ${y}`, G, 1.8))
      .join(''),
  'Chou-fleur': () =>
    path('M8 41 C 10 30 20 30 24 38 C 22 48 14 52 8 41 Z', G) +
    path('M52 41 C 50 30 40 30 36 38 C 38 48 46 52 52 41 Z', G) +
    path('M16 46 C 24 55 36 55 44 46 C 36 51 24 51 16 46 Z', L) +
    [
      [22, 30, 9], [38, 30, 9], [30, 24, 10], [25, 37, 8], [35, 37, 8], [30, 32, 8],
    ]
      .map(([x, y, r]) => circle(x, y, r, W))
      .join('') +
    cshade(38, 30, 9, 'y') +
    cshade(35, 37, 8, 'y') +
    cshade(22, 30, 9, 'k', 'b'),
  'Chou rouge': () =>
    circle(30, 34, 19, PL) +
    cshade(30, 34, 19, 'b') +
    line('M14 35 C 18 23 42 23 46 35 M18 41 C 24 31 36 31 42 41', P, 1.8) +
    line('M30 16 V 52', P, 1.6) +
    line('M17 30 C 18 25 21 22 24 20', W, 2),
  'Chou kale': () => {
    const b = 'M30 55 C 18 51 12 39 14 27 C 15 21 20 23 21 19 C 22 13 28 15 30 9 C 32 15 38 13 39 19 C 40 23 45 21 46 27 C 48 39 42 51 30 55 Z';
    return (
      leaf(30, 56, -140, 26, L) +
      path(b, G) +
      shade(b, 'k', 'b') +
      line('M30 56 V 15 M30 28 L 21 22 M30 36 L 19 31 M30 28 L 39 22 M30 36 L 41 31 M30 44 L 22 41 M30 44 L 38 41', L, 1.5)
    );
  },
  Concombres: () =>
    `<g transform="rotate(-32 30 32)">` +
    `<rect x="8" y="25" width="44" height="14" rx="7" fill="${G}"/>` +
    line('M14 29.5 H 46 M14 34.5 H 46', L, 1.6) +
    [14, 22, 30, 38, 45].map((x, i) => circle(x, i % 2 ? 31 : 33, 0.9, W)).join('') +
    `<rect x="8" y="25" width="44" height="14" rx="7" fill="url(#ri-k-b)" filter="url(#ri-dot)"/>` +
    `<rect x="4" y="30" width="6" height="4" rx="2" fill="${L}"/>` +
    `</g>`,
  Courgettes: () =>
    `<g transform="rotate(-32 30 32)">` +
    `<rect x="5" y="26" width="40" height="13" rx="6.5" fill="${G}"/>` +
    line('M10 30.5 H 40 M10 35 H 40', L, 1.4) +
    `<rect x="5" y="26" width="40" height="13" rx="6.5" fill="url(#ri-k-b)" filter="url(#ri-dot)"/>` +
    `<rect x="2" y="30" width="5" height="5" rx="1.5" fill="${L}"/>` +
    path(starPath(49, 32.5, 9, 4, 6), Y) +
    circle(49, 32.5, 2.2, O) +
    `</g>`,
  Courges: () =>
    line('M30 23 C 30 18 32 15 35 13', G, 4) +
    line('M34 15 C 40 12 44 16 41 19 C 39 21 37 18 39 17', L, 1.4) +
    ell(19, 38, 11, 13, O) +
    eshade(19, 38, 11, 13, 'r', 'l') +
    ell(41, 38, 11, 13, O) +
    eshade(41, 38, 11, 13, 'r', 'r') +
    ell(30, 37, 10, 15, O) +
    eshade(30, 37, 10, 15, 'r', 'b') +
    line('M24.5 26 C 22 33 22 43 24.5 50 M35.5 26 C 38 33 38 43 35.5 50', R, 1.6),
  Épinards: () =>
    line('M30 56 L 30 46', G, 2.4) +
    leaf(30, 47, -118, 34, G, L) +
    leaf(30, 47, -66, 30, L, G) +
    `<g transform="translate(30 47) rotate(-118)"><path d="M0 0 C 10 -13, 25 -11, 34 0 C 25 11, 10 13, 0 0 Z" fill="url(#ri-k-b)" filter="url(#ri-dot)"/></g>`,
  Fèves: () => {
    const b = 'M8 45 C 10 31 28 17 50 15 C 54 15 55 19 52 22 C 44 31 30 43 14 49 C 10 51 7 49 8 45 Z';
    return (
      path(b, L) +
      shade(b, 'g', 'b') +
      ell(20, 40, 6.5, 4.6, G, -38) +
      ell(30, 32, 6.5, 4.6, G, -38) +
      ell(40, 24, 6.5, 4.6, G, -38) +
      line('M12 46 C 26 40 38 30 50 18', G, 1.4) +
      stem('M52 17 C 54 13 56 11 58 10')
    );
  },
  'Haricots verts': () =>
    line('M10 41 C 20 35 30 21 38 10', G, 4.6) +
    line('M12 46 C 22 40 34 24 44 12', L, 4.6) +
    line('M16 50 C 26 44 38 28 48 17', G, 4.6) +
    line('M21 53 C 31 47 42 33 51 23', L, 4.6) +
    `<rect x="22" y="28" width="15" height="7" rx="2.5" fill="${R}" transform="rotate(-48 29.5 31.5)"/>`,
  Laitues: () =>
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const a = (Math.PI / 4) * i;
        return circle(30 + Math.cos(a) * 12, 35 + Math.sin(a) * 11, 9.5, L);
      })
      .join('') +
    cshade(30, 35, 22, 'g') +
    circle(30, 34, 10, Y) +
    line('M22 34 C 26 28 34 28 38 34 M25 39 C 28 36 32 36 35 39', L, 1.8) +
    line('M14 30 C 16 24 20 21 24 20', G, 1.8),
  Navets: () => {
    const b = 'M30 22 C 42 22 48 32 46 40 C 44 48 36 52 30 54 C 24 52 16 48 14 40 C 12 32 18 22 30 22 Z';
    return (
      leaf(28, 22, -115, 15, G, L) +
      leaf(32, 22, -68, 14, L, G) +
      path(b, W) +
      shade(b, 'k', 'r') +
      path('M14 39 C 13 31 19 22 30 22 C 41 22 47 31 46 39 C 40 34 20 34 14 39 Z', PL) +
      line('M30 54 L 30 59', K, 1.4)
    );
  },
  Oignons: () => {
    const b = 'M30 12 C 32 18 46 26 46 38 C 46 48 38 54 30 54 C 22 54 14 48 14 38 C 14 26 28 18 30 12 Z';
    return (
      line('M30 12 C 29 8 30 5 32 3', T, 2) +
      path(b, O) +
      shade(b, 'r') +
      line('M30 14 C 22 26 22 46 30 54 M30 14 C 38 26 38 46 30 54 M30 14 V 54', R, 1.3) +
      line('M26 54 l -2 4 M30 54 l 0 5 M34 54 l 2 4', K, 1.2)
    );
  },
  Panais: () => {
    const b = 'M47 23 C 49 17 41 11 35 15 L 12 49 C 11 52 14 54 16 52 Z';
    return (
      leaf(42, 16, -55, 14, G) +
      leaf(42, 15, -25, 13, L) +
      leaf(41, 15, -85, 12, L) +
      path(b, W) +
      shade(b, 'o', 'l') +
      line('M39 25 l -5 -3 M30 34 l -4 -3 M23 43 l -3 -2', T, 1.8)
    );
  },
  'Petits pois': () => {
    const b = 'M7 34 C 15 21 41 17 53 25 C 45 37 21 43 7 34 Z';
    return (
      path(b, G) +
      shade(b, 'k', 'b') +
      path('M12 33 C 20 25 38 22 48 26 C 40 32 24 36 12 33 Z', L) +
      [[18, 30.5], [26.5, 28.5], [35, 27], [43, 26.5]].map(([x, y]) => circle(x, y, 4.4, G) + circle(x - 1.4, y - 1.4, 1.1, W)).join('') +
      stem('M53 25 C 55 21 57 19 59 18')
    );
  },
  Poireaux: () => {
    const w = 'M9 48 L 29 22 L 37 28 L 17 54 Z';
    return (
      path('M36 15 C 38 9 44 4 53 3 C 49 10 45 16 44 21 Z', G) +
      path('M35 15 C 31 9 31 4 33 1 C 37 6 39 11 40 17 Z', L) +
      path('M29 22 L 35 14 L 44 21 L 37 28 Z', L) +
      path(w, W) +
      shade(w, 'k', 'r') +
      line('M14 47 L 30 26 M19 50 L 34 30', T, 1.1) +
      line('M11 51 l -5 3 M13 53 l -4 5 M16 55 l -1 4', K, 1.2)
    );
  },
  Poivrons: () => {
    const b = 'M16 28 C 14 20 22 16 30 20 C 38 16 46 20 44 28 C 46 40 42 52 36 54 C 33 55 31 53 30 52 C 29 53 27 55 24 54 C 18 52 14 40 16 28 Z';
    return (
      line('M30 20 C 30 15 33 12 37 11', G, 3.6) +
      path(b, R) +
      shade(b, 'k') +
      line('M30 23 V 50', C, 1.8) +
      line('M20 30 C 20 26 22 24 25 23', W, 2.2)
    );
  },
  'Pommes de terre': () => {
    const b = 'M10 35 C 10 26 18 22 28 23 C 38 24 44 29 43 37 C 42 45 34 48 25 47 C 16 46 10 42 10 35 Z';
    return (
      ell(44, 46, 9.5, 7.5, T, -15) +
      eshade(44, 46, 9.5, 7.5, 'k', 'd', -15) +
      path(b, T) +
      shade(b, 'k') +
      line('M18 31 c 1.5 -1 3 -1 4 0 M30 29 c 1.5 -1 3 -1 4 0 M24 39 c 1.5 -1 3 -1 4 0 M35 38 c 1.2 -0.8 2.4 -0.8 3.4 0', K, 1.2)
    );
  },
  Radis: () =>
    leaf(29, 29, -112, 17, G, L) +
    leaf(31, 29, -64, 16, L, G) +
    line('M30 52 L 31 59', K, 1.3) +
    circle(30, 40, 12, BE) +
    cshade(30, 40, 12, 'k') +
    path('M21 47 C 23 52 27 54 30 54 C 33 54 37 52 39 47 C 34 49.5 26 49.5 21 47 Z', W) +
    line('M22 37 C 22 34 24 32 27 31', P, 2),
  Rhubarbe: () =>
    path('M19 57 L 23 27 L 28 27 L 25 57 Z', BE) +
    path('M28 57 L 29 23 L 34 23 L 34 57 Z', C) +
    path('M37 57 L 36 27 L 41 27 L 43 57 Z', BE) +
    shade('M19 57 L 23 27 L 43 27 L 43 57 Z', 'k', 'b') +
    path('M8 23 C 10 11 23 6 30 10 C 37 4 51 8 51 20 C 51 28 41 31 34 27 C 30 31 20 31 15 29 C 10 29 7 27 8 23 Z', G) +
    line('M30 28 L 30 12 M30 20 L 18 14 M30 20 L 43 13 M30 25 L 15 24 M30 25 L 46 23', L, 1.4),
  Salsifis: () =>
    line('M12 54 L 40 12', K, 4.4) +
    line('M20 56 L 46 18', '#5a4334', 4.4) +
    line('M28 57 L 51 25', K, 4.4) +
    line('M17 47 l 3 2 M25 36 l 3 2 M31 27 l 3 2 M27 47 l 3 2 M35 36 l 3 2 M38 47 l 3 2', T, 1.2) +
    line('M40 12 C 38 7 39 4 41 2 M46 18 C 47 12 50 9 54 8 M51 25 C 54 21 57 20 59 20', L, 2.2),
  Tomates: () => {
    const b = 'M12 37 C 12 27 20 23 30 24 C 40 23 48 27 48 37 C 48 48 40 54 30 54 C 20 54 12 48 12 37 Z';
    return (
      path(b, C) +
      shade(b, 'r') +
      line('M18 33 C 19 29 22 27 25 26', W, 2.2) +
      path(starPath(30, 25, 10, 3.6, 5), G) +
      line('M30 25 C 30 20 32 17 35 16', G, 2.4)
    );
  },
  Topinambours: () => {
    const b = 'M12 39 C 10 31 16 27 22 29 C 24 23 32 21 36 27 C 42 25 48 31 46 37 C 50 43 44 51 36 49 C 32 55 22 55 20 49 C 12 49 10 45 12 39 Z';
    return (
      path(b, T) +
      shade(b, 'k') +
      path('M22 29 C 23 26 26 24 28 24', P, 1.8) +
      line('M20 38 c 1.5 -1 3 -1 4 0 M32 33 c 1.5 -1 3 -1 4 0 M30 44 c 1.5 -1 3 -1 4 0 M40 40 c 1.2 -0.8 2.4 -0.8 3.4 0', K, 1.2)
    );
  },
};

/** Illustration d'un fruit ou légume (contenu SVG pour un viewBox 0 0 60 60). */
export function seasonArt(name: string) {
  const art = arts[name];
  return art ? art() : circle(30, 33, 20, L) + cshade(30, 33, 20, 'k');
}
