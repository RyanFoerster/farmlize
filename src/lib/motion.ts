import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Classes par défaut sur les découpes : les masques deviennent .fz-line-mask / .fz-char-mask…
// ce qui permet de leur donner de l'air en CSS (sinon les titres à interligne serré sont rognés en haut).
const createSplit = SplitText.create.bind(SplitText);
SplitText.create = ((target: any, vars: SplitText.Vars = {}) =>
  createSplit(target, { linesClass: 'fz-line', wordsClass: 'fz-word', charsClass: 'fz-char', ...vars })) as typeof SplitText.create;

CustomEase.create('fz.out', '0.22, 1, 0.36, 1');
CustomEase.create('fz.inOut', '0.65, 0, 0.35, 1');
gsap.defaults({ ease: 'fz.out', duration: 0.9 });
if (import.meta.env.DEV) (window as any).gsap = gsap;

export { gsap, ScrollTrigger, SplitText };

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Résolu quand le loader d'entrée commence à se lever (immédiat ensuite). */
export const loaderDone = (): Promise<void> => (window as any).__fzLoaderDone ?? Promise.resolve();

type Cleanup = (() => void) | void;

/**
 * Cycle de vie d'une page avec le ClientRouter d'Astro :
 * `init` tourne à chaque affichage de la page (si `selector` est présent),
 * tout ce qui est créé dans le contexte GSAP est nettoyé avant la navigation suivante.
 */
export function onPage(selector: string, init: (root: HTMLElement, ctx: gsap.Context) => Cleanup | Promise<Cleanup>) {
  let ctx: gsap.Context | null = null;
  let cleanup: Cleanup;
  let gen = 0;
  document.addEventListener('astro:page-load', async () => {
    const my = ++gen;
    await loaderDone();
    if (my !== gen) return;
    const root = document.querySelector<HTMLElement>(selector);
    if (!root || !root.isConnected) return;
    let result: Cleanup | Promise<Cleanup>;
    const c = gsap.context((self: gsap.Context) => {
      result = init(root, self);
    }, root);
    ctx = c;
    Promise.resolve(result!).then((r) => {
      if (ctx === c) cleanup = r;
      else if (typeof r === 'function') r();
    });
  });
  document.addEventListener('astro:before-swap', () => {
    gen++;
    if (!ctx) return;
    if (typeof cleanup === 'function') cleanup();
    ctx.revert();
    ctx = null;
    cleanup = undefined;
  });
}

/** Révèle les éléments marqués [data-reveal] au scroll (fade + léger décalage). */
export function revealOnScroll(root: ParentNode) {
  const items = root.querySelectorAll<HTMLElement>('[data-reveal]');
  items.forEach((el) => {
    if (reduced()) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    const kind = el.dataset.reveal;
    const from: gsap.TweenVars =
      kind === 'scale' ? { autoAlpha: 0, scale: 0.92 } : kind === 'left' ? { autoAlpha: 0, x: -40 } : { autoAlpha: 0, y: 40 };
    gsap.fromTo(el, from, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.1,
      delay: Number(el.dataset.delay ?? 0),
      clearProps: "transform",
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const kids = ([...group.children] as HTMLElement[]).filter((k) => !k.hasAttribute("data-stagger-skip"));
    if (reduced()) {
      gsap.set(kids, { autoAlpha: 1 });
      return;
    }
    gsap.fromTo(
      kids,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.08,
        clearProps: "transform",
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      },
    );
  });
}

/** Titre découpé en lignes masquées qui montent. */
export function splitReveal(el: HTMLElement, vars: gsap.TweenVars = {}) {
  if (reduced()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }
  gsap.set(el, { autoAlpha: 1 });
  return SplitText.create(el, {
    type: 'lines,words',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.words, {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.04,
        ...vars,
      }),
  });
}

/** Petit effet magnétique sur un bouton. */
export function magnetic(el: HTMLElement, strength = 0.25) {
  if (reduced() || window.matchMedia('(hover: none)').matches) return () => {};
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
  };
}
