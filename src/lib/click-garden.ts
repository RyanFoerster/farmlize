/**
 * Le potager du clic : un clic dans le vide (ni lien, ni bouton, ni texte) fait pousser une petite
 * plante riso à cet endroit — touffe d'herbe, pousse, marguerite, tulipe, champignon, parfois un tournesol.
 * La terre gicle, la plante se déplie, ondule, se couche quand le curseur la frôle,
 * un papillon s'envole parfois des fleurs, puis tout rentre sous terre après quelques secondes.
 * Cliquer vite plusieurs fois de suite fait pousser plus grand… jusqu'au tournesol.
 */
import { gsap, reduced } from './motion';
import { ink } from './riso';

/** Pied de la plante dans le viewBox 160 × 160. */
const BX = 80;
const BY = 148;
const MAX = 14;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const f = (n: number) => n.toFixed(1);

type Plant = { body: string; top: number; head?: [number, number]; flower?: boolean };

/* ---------- les formes ---------- */

const blade = (bx: number, h: number, lean: number, w: number, fill: string) => {
  const mx = bx + lean * 0.35;
  return `<path class="g-blade" data-o="${f(bx)} ${BY}" fill="${fill}" d="M${f(bx - w)} ${BY} Q${f(mx - w * 0.6)} ${f(BY - h * 0.55)} ${f(bx + lean)} ${f(BY - h)} Q${f(mx + w * 0.6)} ${f(BY - h * 0.5)} ${f(bx + w)} ${BY} Z"/>`;
};

const leaf = (ax: number, ay: number, deg: number, l: number, w: number, fill: string) => {
  const t = `translate(${f(ax)} ${f(ay)}) rotate(${deg})`;
  return `<g class="g-leaf" data-o="${f(ax)} ${f(ay)}"><path transform="${t}" fill="${fill}" d="M0 0 C ${f(l * 0.3)} ${f(-w)} ${f(l * 0.72)} ${f(-w)} ${l} 0 C ${f(l * 0.72)} ${f(w * 0.8)} ${f(l * 0.3)} ${f(w * 0.8)} 0 0 Z"/><path transform="${t}" d="M3 0 L ${f(l * 0.78)} 0" stroke="${ink.paper}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/></g>`;
};

const stem = (d: string, w = 4.5) =>
  `<path class="g-stem" d="${d}" stroke="${ink.green}" stroke-width="${w}" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1"/>`;

/** Deux ou trois brins d'herbe au pied, pour que rien ne pousse tout seul. */
const sideGrass = () => {
  let s = '';
  for (const side of [-1, 1]) {
    const n = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < n; i++) {
      const bx = BX + side * rnd(10, 22);
      s += blade(bx, rnd(16, 32), side * rnd(4, 12), 2.6, i ? ink.green : ink.leaf);
    }
  }
  return s;
};

const tuft = (): Plant => {
  const n = Math.round(rnd(5, 7));
  let body = '';
  let top = BY;
  for (let i = 0; i < n; i++) {
    const k = i - (n - 1) / 2;
    const bx = BX + k * 6.5 + rnd(-2, 2);
    const h = rnd(40, 74) * (1 - (Math.abs(k) / n) * 0.7);
    top = Math.min(top, BY - h);
    body += blade(bx, h, k * rnd(4, 9) + rnd(-5, 5), 3.4, i % 2 ? ink.green : ink.leaf);
  }
  // parfois un trèfle ou une petite fleur jaune dans la touffe
  if (Math.random() < 0.45) {
    body += stem(`M${BX + 4} ${BY} C ${BX + 6} ${BY - 16} ${BX + 2} ${BY - 30} ${BX + 6} ${BY - 44}`, 2.6);
    body += `<g class="g-head" data-o="${BX + 6} ${BY - 46}">${[0, 72, 144, 216, 288]
      .map((a) => `<circle cx="${BX + 6}" cy="${BY - 52}" r="4.2" fill="${ink.yellow}" transform="rotate(${a} ${BX + 6} ${BY - 46})"/>`)
      .join('')}<circle cx="${BX + 6}" cy="${BY - 46}" r="3" fill="${ink.orange}"/></g>`;
    top = Math.min(top, BY - 56);
  }
  return { body, top };
};

const sprout = (): Plant => ({
  body:
    sideGrass() +
    stem(`M${BX} ${BY} C ${BX + 1} ${BY - 14} ${BX - 2} ${BY - 26} ${BX} ${BY - 44}`) +
    leaf(BX, BY - 42, -152, 32, 12, ink.leaf) +
    leaf(BX, BY - 42, -26, 36, 13, ink.green),
  top: BY - 62,
});

const daisy = (): Plant => {
  const petal = pick([ink.pink, ink.sky, ink.coral, ink.yellow]);
  const hx = BX;
  const hy = BY - 84;
  const petals = Array.from({ length: 10 }, (_, k) => `<ellipse cx="${hx}" cy="${hy - 12}" rx="5.2" ry="11" fill="${petal}" transform="rotate(${k * 36} ${hx} ${hy})"/>`).join('');
  return {
    body:
      sideGrass() +
      stem(`M${BX} ${BY} C ${BX + 4} ${BY - 22} ${BX - 4} ${BY - 46} ${hx} ${hy + 6}`) +
      leaf(BX + 1, BY - 26, -24, 24, 9, ink.leaf) +
      leaf(BX - 1, BY - 14, -158, 20, 8, ink.green) +
      `<g class="g-head" data-o="${hx} ${hy}">${petals}<circle cx="${hx}" cy="${hy}" r="7.5" fill="${petal === ink.yellow ? ink.orange : ink.yellow}"/><circle cx="${hx}" cy="${hy}" r="7.5" fill="url(#ri-${petal === ink.yellow ? 'r' : 'o'}-c)" filter="url(#ri-dot)"/></g>`,
    top: hy - 24,
    head: [hx, hy],
    flower: true,
  };
};

const tulip = (): Plant => {
  const c = pick([ink.red, ink.coral, ink.pink, ink.orange]);
  const cup = `M66 ${BY - 82} C 64 ${BY - 66} 70 ${BY - 56} 80 ${BY - 56} C 90 ${BY - 56} 96 ${BY - 66} 94 ${BY - 82} L 87 ${BY - 73} L 80 ${BY - 88} L 73 ${BY - 73} Z`;
  return {
    body:
      blade(BX - 4, 52, -18, 6, ink.leaf) +
      blade(BX + 4, 44, 16, 6, ink.green) +
      stem(`M${BX} ${BY} C ${BX} ${BY - 20} ${BX + 2} ${BY - 40} ${BX} ${BY - 60}`) +
      `<g class="g-head" data-o="${BX} ${BY - 58}"><path d="${cup}" fill="${c}"/><path d="${cup}" fill="url(#ri-r-l)" filter="url(#ri-dot)"/></g>`,
    top: BY - 90,
    head: [BX, BY - 72],
    flower: true,
  };
};

const mushroom = (): Plant => {
  const c = pick([ink.red, ink.coral, ink.orange]);
  const foot = `M73 ${BY} C 74 ${BY - 14} 75 ${BY - 22} 75 ${BY - 30} L 85 ${BY - 30} C 85 ${BY - 22} 86 ${BY - 14} 87 ${BY} Z`;
  const cap = `M50 ${BY - 28} C 50 ${BY - 60} 110 ${BY - 60} 110 ${BY - 28} C 95 ${BY - 23} 65 ${BY - 23} 50 ${BY - 28} Z`;
  const dots = [
    [66, BY - 42, 4],
    [82, BY - 50, 5],
    [96, BY - 40, 3.6],
    [76, BY - 35, 2.6],
  ]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${ink.paper}"/>`)
    .join('');
  return {
    body:
      sideGrass() +
      `<g class="g-blade" data-o="${BX} ${BY}"><path d="${foot}" fill="${ink.paper}"/><path d="${foot}" fill="url(#ri-o-l)" filter="url(#ri-dot)"/></g>` +
      `<g class="g-head" data-o="${BX} ${BY - 30}"><path d="${cap}" fill="${c}"/><path d="${cap}" fill="url(#ri-r-b)" filter="url(#ri-dot)"/>${dots}</g>`,
    top: BY - 56,
  };
};

const sunflower = (): Plant => {
  const hx = BX;
  const hy = BY - 106;
  const petals = Array.from(
    { length: 14 },
    (_, k) => `<ellipse cx="${hx}" cy="${hy - 17}" rx="5" ry="11.5" fill="${k % 2 ? ink.orange : ink.yellow}" transform="rotate(${(k * 360) / 14} ${hx} ${hy})"/>`,
  ).join('');
  return {
    body:
      sideGrass() +
      stem(`M${BX} ${BY} C ${BX + 3} ${BY - 30} ${BX - 3} ${BY - 66} ${hx} ${hy + 8}`, 5.5) +
      leaf(BX + 1, BY - 36, -22, 32, 13, ink.leaf) +
      leaf(BX - 1, BY - 56, -160, 28, 12, ink.green) +
      `<g class="g-head" data-o="${hx} ${hy}">${petals}<circle cx="${hx}" cy="${hy}" r="11" fill="${ink.brown}"/><circle cx="${hx}" cy="${hy}" r="11" fill="url(#ri-o-c)" filter="url(#ri-dot)"/></g>`,
    top: hy - 30,
    head: [hx, hy],
    flower: true,
  };
};

const soil = () =>
  `<g class="g-soil"><path d="M56 151 C 60 140 100 140 104 151 Z" fill="${ink.taupe}"/><circle cx="68" cy="147" r="1.6" fill="${ink.brown}"/><circle cx="91" cy="146" r="1.3" fill="${ink.brown}"/><circle cx="80" cy="148.5" r="1.1" fill="${ink.brown}"/></g>`;

const weighted: [number, () => Plant][] = [
  [3, tuft],
  [2, sprout],
  [3, daisy],
  [2, tulip],
  [1.4, mushroom],
  [0.8, sunflower],
];
function choose() {
  let r = Math.random() * weighted.reduce((s, [w]) => s + w, 0);
  for (const [w, make] of weighted) if ((r -= w) <= 0) return make;
  return tuft;
}

/* ---------- la scène ---------- */

type Live = {
  el: HTMLElement;
  x: number;
  y: number;
  h: number;
  reach: number;
  bendG: SVGGElement;
  soilG: SVGGElement;
  bend: (v: number) => void;
  sway: gsap.core.Tween;
  timer: gsap.core.Tween;
};
const live: Live[] = [];
let layer: HTMLElement | null = null;
let combo = 0;
let lastClick = 0;

function ensureLayer() {
  if (!layer?.isConnected) {
    layer = document.createElement('div');
    layer.className = 'grow-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(layer);
  }
  // le calque couvre toute la page (et coupe ce qui dépasserait sur les côtés)
  layer.style.height = '0px';
  layer.style.height = `${document.documentElement.scrollHeight}px`;
  return layer;
}

function specks(at: HTMLElement, x: number, y: number) {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span');
    s.className = 'grow__speck';
    s.style.cssText = `left:${x}px;top:${y}px;--sz:${f(rnd(3, 6.5))}px;background:${pick([ink.taupe, ink.brown, ink.leaf, ink.yellow])}`;
    at.append(s);
    const d = rnd(0.5, 0.75);
    gsap
      .timeline({ onComplete: () => s.remove() })
      .to(s, { x: rnd(-52, 52), duration: d, ease: 'power1.out' }, 0)
      .to(s, { y: -rnd(16, 46), duration: d * 0.45, ease: 'power2.out' }, 0)
      .to(s, { y: rnd(2, 8), duration: d * 0.55, ease: 'power2.in' }, d * 0.45)
      .to(s, { autoAlpha: 0, duration: 0.2 }, d - 0.14);
  }
}

function butterfly(at: HTMLElement, x: number, y: number) {
  const [c1, c2] = pick([
    [ink.sky, ink.blue],
    [ink.pink, ink.coral],
    [ink.yellow, ink.orange],
    [ink.coral, ink.pink],
  ]);
  const wing = `<path d="M20 15 C 13 1 2 3 4 13 C 5 19 13 20 20 15 Z" fill="${c1}"/><path d="M20 16 C 14 21 9 29 14 29.5 C 18 30 20 24 20 16 Z" fill="${c2}"/>`;
  const el = document.createElement('div');
  el.className = 'grow__fly';
  el.style.cssText = `left:${x}px;top:${y}px`;
  el.innerHTML = `<svg class="riso" viewBox="0 0 40 32"><g class="w-l">${wing}</g><g class="w-r"><g transform="matrix(-1 0 0 1 40 0)">${wing}</g></g><path d="M20 9 C 19 5 17 3 15 2 M20 9 C 21 5 23 3 25 2" stroke="${ink.brown}" stroke-width="1.1" fill="none" stroke-linecap="round"/><rect x="18.8" y="8" width="2.4" height="17" rx="1.2" fill="${ink.brown}"/></svg>`;
  at.append(el);
  const wings = el.querySelectorAll('.w-l, .w-r');
  gsap.set(wings, { svgOrigin: '20 16' });
  const flap = gsap.to(wings, { scaleX: 0.2, duration: 0.09, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  const dir = Math.random() < 0.5 ? -1 : 1;
  const sx = (a: number, b: number) => dir * rnd(a, b);
  gsap
    .timeline({
      onComplete: () => {
        flap.kill();
        el.remove();
      },
    })
    .from(el, { scale: 0, duration: 0.35, ease: 'back.out(3)' })
    .to(
      el,
      {
        keyframes: {
          x: [0, sx(20, 50), sx(60, 110), sx(130, 200), sx(210, 320)],
          y: [0, -rnd(50, 80), -rnd(70, 120), -rnd(160, 230), -rnd(270, 360)],
          rotation: [0, dir * 14, -dir * 8, dir * 18, dir * 6],
          easeEach: 'sine.inOut',
        },
        duration: rnd(3.2, 4.2),
        ease: 'none',
      },
      0.1,
    )
    .to(el, { autoAlpha: 0, duration: 0.7 }, '-=0.8');
}

function wilt(p: Live) {
  const i = live.indexOf(p);
  if (i < 0) return;
  live.splice(i, 1);
  p.timer.kill();
  p.sway.kill();
  gsap.killTweensOf(p.bendG, 'rotation');
  gsap
    .timeline({ onComplete: () => p.el.remove() })
    .to(p.bendG, { scaleY: 0, scaleX: 0.4, rotation: rnd(-16, 16), duration: 0.6, ease: 'back.in(1.7)' })
    .to(p.soilG, { scaleX: 0, scaleY: 0, duration: 0.35, ease: 'power2.in' }, '-=0.15');
}

function spawn(px: number, py: number) {
  const at = ensureLayer();
  const now = performance.now();
  combo = now - lastClick < 1300 ? combo + 1 : 0;
  lastClick = now;

  const plant = (combo >= 5 && combo % 5 === 0 ? sunflower : choose())();
  const size = rnd(176, 204) * (1 + Math.min(combo, 6) * 0.06);
  const k = size / 160;
  const el = document.createElement('div');
  el.className = 'grow';
  el.style.cssText = `left:${f(px - BX * k)}px;top:${f(py - BY * k)}px;width:${f(size)}px`;
  el.innerHTML = `<svg class="riso" viewBox="0 0 160 160"><g class="g-bend"><g class="g-sway">${plant.body}</g></g>${soil()}</svg>`;
  at.append(el);

  const svg = el.firstElementChild as SVGSVGElement;
  const q = <T extends Element = SVGElement>(s: string) => [...svg.querySelectorAll<T & SVGElement>(s)];
  const bendG = svg.querySelector<SVGGElement>('.g-bend')!;
  const swayG = svg.querySelector<SVGGElement>('.g-sway')!;
  const soilG = svg.querySelector<SVGGElement>('.g-soil')!;
  q('[data-o]').forEach((n) => gsap.set(n, { svgOrigin: n.getAttribute('data-o')! }));
  gsap.set([bendG, swayG], { svgOrigin: `${BX} ${BY}` });
  gsap.set(soilG, { svgOrigin: `${BX} 150` });

  // la terre se soulève, l'herbe jaillit, la tige se dessine, les feuilles se déplient, la fleur éclot
  gsap
    .timeline()
    .from(soilG, { scaleX: 0.2, scaleY: 0, duration: 0.4, ease: 'back.out(3)' })
    .from(q('.g-blade'), { scaleY: 0, scaleX: 0.4, duration: 0.9, ease: 'elastic.out(1, 0.45)', stagger: { each: 0.05, from: 'center' } }, 0.06)
    .fromTo(q('.g-stem'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 0.08)
    .from(q('.g-leaf'), { scale: 0, rotation: (i: number) => (i % 2 ? 40 : -40), duration: 0.7, ease: 'back.out(2.4)', stagger: 0.09 }, 0.32)
    .from(q('.g-head'), { scale: 0, rotation: -140, duration: 0.9, ease: 'back.out(2.2)' }, 0.5);
  specks(at, px, py);

  const amp = rnd(2.5, 5);
  const sway = gsap.fromTo(swayG, { rotation: -amp }, { rotation: amp, duration: rnd(1.4, 2.1), ease: 'sine.inOut', yoyo: true, repeat: -1 });
  const p: Live = {
    el,
    x: px,
    y: py,
    h: (BY - plant.top) * k,
    reach: Math.max(70, size * 0.5),
    bendG,
    soilG,
    bend: gsap.quickTo(bendG, 'rotation', { duration: 0.7, ease: 'power3.out' }),
    sway,
    timer: gsap.delayedCall(rnd(5.5, 7.5), () => wilt(p)),
  };
  live.push(p);
  if (live.length > MAX) wilt(live[0]);

  if (plant.flower && plant.head && (combo >= 5 || Math.random() < 0.35)) {
    const [hx, hy] = plant.head;
    gsap.delayedCall(1.3, () => p.el.isConnected && butterfly(at, px + (hx - BX) * k, py + (hy - BY) * k));
  }
}

/* ---------- le curseur couche les plantes ---------- */

let mx = 0;
let my = 0;
let frame = 0;
function bendAll() {
  frame = 0;
  for (const p of live) {
    const dx = mx - p.x;
    const up = p.y - my; // hauteur du curseur au-dessus du pied
    const near = Math.abs(dx) < p.reach && up > -16 && up < p.h + 24;
    // nulle au centre et au bord de la zone, maximale entre les deux : la plante s'écarte du curseur
    p.bend(near ? -26 * Math.sin((Math.PI * dx) / p.reach) : 0);
  }
}
function onMove(e: PointerEvent) {
  if (!live.length) return;
  mx = e.clientX + window.scrollX;
  my = e.clientY + window.scrollY;
  if (!frame) frame = requestAnimationFrame(bendAll);
}

/* ---------- où peut-on planter ? ---------- */

const BLOCK =
  'a, button, input, textarea, select, option, label, summary, video, audio, iframe, canvas, dialog, [role="button"], [role="link"], [role="slider"], [role="tab"], [role="menuitem"], [contenteditable], .maplibregl-map, .site-header, [data-loader], [data-no-grow]';

/** Le point cliqué est-il sur un caractère ? (on ne plante pas dans le texte) */
function overText(x: number, y: number) {
  const d = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  let node: Node | null = null;
  let offset = 0;
  if (d.caretPositionFromPoint) {
    const pos = d.caretPositionFromPoint(x, y);
    node = pos?.offsetNode ?? null;
    offset = pos?.offset ?? 0;
  } else if (d.caretRangeFromPoint) {
    const r = d.caretRangeFromPoint(x, y);
    node = r?.startContainer ?? null;
    offset = r?.startOffset ?? 0;
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const len = (node as Text).length;
  const range = document.createRange();
  for (const i of [offset - 1, offset]) {
    if (i < 0 || i >= len) continue;
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    for (const r of range.getClientRects()) if (x >= r.left - 3 && x <= r.right + 3 && y >= r.top - 2 && y <= r.bottom + 2) return true;
  }
  return false;
}

function onClick(e: MouseEvent) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduced()) return;
  const t = e.target;
  if (!(t instanceof Element) || t.closest(BLOCK)) return;
  if (document.querySelector('.site-header__inner.is-open')) return; // ce clic ferme le menu
  if (getComputedStyle(t).cursor === 'pointer') return;
  const sel = window.getSelection();
  if (sel && !sel.isCollapsed) return;
  if (overText(e.clientX, e.clientY)) return;
  spawn(e.clientX + window.scrollX, e.clientY + window.scrollY);
}

function clear() {
  live.splice(0).forEach((p) => {
    p.timer.kill();
    p.sway.kill();
    gsap.killTweensOf(p.bendG);
  });
  layer = null;
}

let ready = false;
export function initClickGarden() {
  if (ready) return;
  ready = true;
  document.addEventListener('click', onClick, true);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('astro:before-swap', clear);
}
