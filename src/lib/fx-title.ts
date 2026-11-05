/**
 * Système de titres « vivants » : une syntaxe légère dans le texte du titre,
 * rendue en HTML (serveur) puis animée (navigateur).
 *
 *   *mot*            accent : le mot en couleur, même typo (*mot|blue*, défaut : corail)
 *   [mot]            coup de surligneur riso derrière     ([mot|pink], défaut : jaune)
 *   ~mot~            trait ondulé dessiné dessous         (~mot|coral~)
 *   {Carottes}       mini illustration dans la ligne      (fruit/légume du calendrier, ou heart, pin, sun)
 *   \n               retour à la ligne
 *
 * Une seule figure par titre : c'est ce qui garde l'ensemble sobre.
 */
import { gsap } from 'gsap';
import { ink } from './riso';
import { seasonArt } from './season-art';

const colors: Record<string, string> = {
  butter: 'var(--butter)',
  coral: 'var(--coral)',
  pink: 'var(--rose)',
  sky: 'var(--sky)',
  leaf: 'var(--leaf)',
  blue: 'var(--blue)',
  green: 'var(--moss)',
};
/** Un nom de la palette, ou directement une couleur CSS (#hex, var(…)) — utile pour les couleurs venant des données. */
const color = (name: string | undefined, fallback: string) =>
  !name ? fallback : (colors[name] ?? (/^(#|var\(|rgb|hsl)/.test(name) ? name : fallback));
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const words = (phrase: string) =>
  phrase
    .replace(/^[ \t\n]+|[ \t\n]+$/g, '') // (pas trim() : il mangerait les espaces insécables)
    .split(/[ \t\n]+/)
    .map((w) => `<span class="fx-w"><span class="fx-in">${esc(w)}</span></span>`)
    .join(' ');

/**
 * Trait ondulé (viewBox 120 × 12) : deux vagues, un peu effilées aux bouts.
 * `phase` fait voyager la vague (animée au scroll). Lissé en courbes, même structure quelle que soit la phase.
 */
function squigPoints(phase = 0, n = 32) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const amp = 4.4 * (0.5 + 0.5 * Math.sin(Math.PI * t));
    pts.push([2 + t * 116, 6.5 + amp * Math.sin(t * Math.PI * 4 + phase)]);
  }
  return pts;
}
const pt = ([x, y]: [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`;
export function squigPath(phase = 0) {
  const p = squigPoints(phase);
  const mid = (a: [number, number], b: [number, number]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${pt(p[0])} L${pt(mid(p[0], p[1]))}`;
  for (let i = 1; i < p.length - 1; i++) d += ` Q${pt(p[i])} ${pt(mid(p[i], p[i + 1]))}`;
  return `${d} L${pt(p[p.length - 1])}`;
}
/**
 * Longueur du trait à l'écran. Le trait ne s'épaissit pas avec l'étirement du SVG (non-scaling-stroke),
 * donc ses tirets se comptent en pixels écran, pas en unités du viewBox : on mesure.
 */
function squigLength(svg: SVGSVGElement) {
  const cs = getComputedStyle(svg);
  const sx = parseFloat(cs.width) / 120;
  const sy = parseFloat(cs.height) / 12;
  const p = squigPoints(0, 120);
  let len = 0;
  for (let i = 1; i < p.length; i++) len += Math.hypot((p[i][0] - p[i - 1][0]) * sx, (p[i][1] - p[i - 1][1]) * sy);
  return Math.ceil(len * 1.08 + 8);
}
const dash = (path: SVGPathElement) => {
  const len = squigLength(path.ownerSVGElement!);
  path.style.strokeDasharray = `${len} ${len}`;
  return len;
};

const icons: Record<string, string> = {
  heart: `<path d="M30 52 C 13 41 5 31 5 20 C 5 11 11 5 19 5 C 24 5 28 8 30 12 C 32 8 36 5 41 5 C 49 5 55 11 55 20 C 55 31 47 41 30 52 Z" fill="${ink.coral}"/><path d="M14 19 C 14 15 16 12 20 11" stroke="${ink.paper}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M30 52 C 13 41 5 31 5 20 C 5 11 11 5 19 5 C 24 5 28 8 30 12 C 32 8 36 5 41 5 C 49 5 55 11 55 20 C 55 31 47 41 30 52 Z" fill="url(#ri-r-d)" filter="url(#ri-dot)"/>`,
  pin: `<path d="M30 4 C 18 4 10 13 10 24 C 10 39 30 56 30 56 C 30 56 50 39 50 24 C 50 13 42 4 30 4 Z" fill="${ink.blue}"/><path d="M30 4 C 18 4 10 13 10 24 C 10 39 30 56 30 56 C 30 56 50 39 50 24 C 50 13 42 4 30 4 Z" fill="url(#ri-k-r)" filter="url(#ri-dot)"/><circle cx="30" cy="23" r="8" fill="${ink.yellow}"/>`,
  sun: `<circle cx="30" cy="30" r="24" fill="${ink.yellow}"/><rect x="6" y="36" width="48" height="3" fill="var(--cream)"/><rect x="6" y="43" width="48" height="4" fill="var(--cream)"/>`,
};

/** Rend le titre en HTML (mots masqués + figures). */
export function renderFx(text: string) {
  // espaces ASCII seulement : une espace insécable reste collée au mot (« vous !» ne se coupe pas)
  const re = /\{([^}]+)\}|\[([^\]]+)\]|~([^~]+)~|\*([^*]+)\*|(\n)|([^ \t\n[\]{}~*]+)|([ \t]+)/g;
  let html = '';
  for (const m of text.matchAll(re)) {
    const [, icon, mark, squig, acc, br, word, space] = m;
    if (icon) {
      const svg = icons[icon] ?? seasonArt(icon);
      html += `<span class="fx-w fx-icon" aria-hidden="true"><span class="fx-in"><svg class="riso" viewBox="0 0 60 60">${svg}</svg></span></span>`;
    } else if (mark) {
      const [phrase, c] = mark.split('|');
      html += `<span class="fx-mark" style="--c:${color(c, 'var(--butter)')}"><svg class="fx-mark__bg riso" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M3 23 C 1 11 13 6 50 5 C 87 4 99 9 97 21 C 96 33 84 37 50 36 C 16 36 4 34 3 23 Z"/></svg>${words(phrase)}</span>`;
    } else if (squig) {
      const [phrase, c] = squig.split('|');
      html += `<span class="fx-squig" style="--c:${color(c, 'var(--coral)')}">${words(phrase)}<svg class="fx-squig__line" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="${squigPath(0)}"/></svg></span>`;
    } else if (acc) {
      const [phrase, c] = acc.split('|');
      html += `<span class="fx-acc" style="color:${color(c, 'var(--coral)')}">${words(phrase)}</span>`;
    } else if (br) html += '<br />';
    else if (word) html += words(word);
    else if (space) html += ' ';
  }
  return html;
}

/** Texte brut, lu par les lecteurs d'écran (sans icônes ni couleurs : « [mot|#e9694f] » → « mot »). */
export const plainFx = (text: string) =>
  text
    .replace(/\{[^}]+\}/g, '')
    .replace(/\|[^\]~*]+(?=[\]~*])/g, '')
    .replace(/[[\]~*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Animation d'entrée : les mots montent et l'icône saute en place.
 * `withDecor` : le surligneur et le trait se tracent aussi dans la timeline (titre déjà à l'écran, ex. le hero) ;
 * sinon ils suivent le scroll (voir fxScrollDecor).
 */
export function fxTimeline(el: HTMLElement, withDecor = false) {
  const tl = gsap.timeline();
  gsap.set(el, { autoAlpha: 1 });
  tl.from(el.querySelectorAll('.fx-in'), { yPercent: 118, duration: 1, stagger: 0.045, ease: 'fz.out' }).from(
    el.querySelectorAll('.fx-icon svg'),
    { scale: 0, rotation: -50, duration: 0.9, ease: 'back.out(2.6)', transformOrigin: '50% 50%' },
    0.3,
  );
  if (withDecor) {
    tl.from(el.querySelectorAll('.fx-mark__bg'), { scaleX: 0, duration: 0.75, ease: 'fz.inOut' }, 0.35);
    el.querySelectorAll<SVGPathElement>('.fx-squig__line path').forEach((path) => {
      const len = dash(path);
      tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.45);
    });
  }
  return tl;
}

/**
 * Surligneur et trait liés au scroll : ils se tracent pendant que le titre monte dans l'écran,
 * puis restent vivants tant qu'il est visible (le surligneur pivote un peu, la vague du trait avance).
 */
export function fxScrollDecor(el: HTMLElement) {
  const tweens: gsap.core.Tween[] = [];
  const marks = el.querySelectorAll('.fx-mark__bg');
  const draw = { trigger: el, start: 'top 86%', end: 'top 46%', scrub: 0.7 };
  const pass = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 };
  if (marks.length) {
    tweens.push(gsap.fromTo(marks, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: draw }));
    tweens.push(gsap.fromTo(marks, { skewX: -6, y: 2 }, { skewX: 4, y: -2, ease: 'none', scrollTrigger: pass }));
  }
  el.querySelectorAll<SVGPathElement>('.fx-squig__line path').forEach((path) => {
    let len = dash(path);
    // le trait se dessine de gauche à droite (longueur remesurée si la fenêtre change)
    tweens.push(
      gsap.fromTo(
        path,
        { strokeDashoffset: () => len },
        { strokeDashoffset: 0, ease: 'none', scrollTrigger: { ...draw, invalidateOnRefresh: true, onRefreshInit: () => void (len = dash(path)) } },
      ),
    );
    // puis la vague avance doucement au fil du scroll
    const wave = { p: 0 };
    tweens.push(
      gsap.fromTo(
        wave,
        { p: -Math.PI },
        { p: Math.PI * 2, ease: 'none', onUpdate: () => path.setAttribute('d', squigPath(wave.p)), scrollTrigger: pass },
      ),
    );
  });
  return tweens;
}
