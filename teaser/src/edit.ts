// Le montage, en un seul endroit : chapitres, extraits (en secondes dans les clips capturés), vitesses, textes.
// Pour retoucher le rythme, modifier `from` / `to` / `rate` ; tout le reste se recalcule.
import home from '../public/clips/home.json';
import journey from '../public/clips/journey.json';
import mobile from '../public/clips/mobile.json';

export const FPS = 60;
export const W = 1080;
export const H = 1350;

export type ClipName = 'home' | 'journey' | 'mobile';
export type ClipMeta = {
  name: string;
  fps: number;
  viewport: { width: number; height: number };
  dsf: number;
  frames: number;
  marks: Record<string, number>;
  /** par image : [x, y, bouton enfoncé, curseur (0 flèche, 1 main, 2 texte, 3 saisie), visible] */
  track: number[][];
};
export const clips = { home, journey, mobile } as unknown as Record<ClipName, ClipMeta>;

/** Domaine affiché dans la barre d'adresse (à adapter au vrai domaine). */
export const DOMAIN = 'farmlize.be';

/** Chemin affiché selon le moment du clip (secondes). */
export const urls: Record<ClipName, [number, string][]> = {
  home: [[0, '/']],
  journey: [
    [0, '/commencer'],
    [16.45, '/fermes?lieu=namur'],
    [24.2, '/fermes/les-ruchers-du-bois-joli'],
  ],
  mobile: [
    [0, '/'],
    [11.8, '/fermes/ferme-du-soleil'],
  ],
};

export type Seg = { clip: ClipName; from: number; to: number; rate: number };
export type Chapter = {
  id: string;
  label: string;
  title: string[];
  /** extraits affichés dans le navigateur */
  desk: Seg[];
  /** extraits affichés dans le téléphone (chapitre mobile) */
  phone?: Seg[];
};

export const INTRO = 108; // images
export const OUTRO = 210;
/** fondu entre deux extraits non contigus */
export const XFADE = 8;

export const chapters: Chapter[] = [
  {
    id: 'accueil',
    label: 'Accueil',
    title: ['Un loader qui', 'met en appétit.'],
    desk: [{ clip: 'home', from: 1.9, to: 7.6, rate: 1.35 }],
  },
  {
    id: 'motion',
    label: 'Motion',
    title: ['Des animations', 'sobres et vivantes.'],
    desk: [
      { clip: 'home', from: 10.5, to: 15.4, rate: 1.5 },
      { clip: 'home', from: 16.6, to: 18.9, rate: 1.15 },
    ],
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    title: ['Deux questions,', 'un panier rempli.'],
    desk: [
      { clip: 'journey', from: 2.15, to: 7.4, rate: 1.45 },
      { clip: 'journey', from: 7.4, to: 15.3, rate: 1.7 },
    ],
  },
  {
    id: 'carte',
    label: 'Carte',
    title: ['Les fermes autour', 'de vous, en direct.'],
    desk: [{ clip: 'journey', from: 15.3, to: 24.3, rate: 1.6 }],
  },
  {
    id: 'ferme',
    label: 'Fiche ferme',
    title: ['Chaque ferme', 'a son histoire.'],
    desk: [{ clip: 'journey', from: 24.3, to: 29.6, rate: 1.4 }],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    title: ['Et tout tient', 'dans la poche.'],
    phone: [
      { clip: 'mobile', from: 2.1, to: 6.8, rate: 1.6 },
      { clip: 'mobile', from: 10.6, to: 13.8, rate: 1.3 },
    ],
    desk: [{ clip: 'journey', from: 29.6, to: 34.2, rate: 0.85 }],
  },
];

// ---------------------------------------------------------------- calculs

export const segFrames = (s: Seg) => Math.round(((s.to - s.from) * FPS) / s.rate);
export const contiguous = (a: Seg, b: Seg) => a.clip === b.clip && Math.abs(a.to - b.from) < 0.02;

export type Placed = Seg & { start: number; len: number; fadeIn: number; tail: number };

/** Place une suite d'extraits bout à bout (en images, à partir de 0). */
export function place(segs: Seg[]): Placed[] {
  let t = 0;
  return segs.map((s, i) => {
    const len = segFrames(s);
    const prev = segs[i - 1];
    const next = segs[i + 1];
    const p: Placed = {
      ...s,
      start: t,
      len,
      fadeIn: prev && !contiguous(prev, s) ? XFADE : 0,
      tail: next && !contiguous(s, next) ? XFADE : 0,
    };
    t += len;
    return p;
  });
}

export const chapterFrames = (c: Chapter) => place(c.desk).reduce((n, s) => n + s.len, 0);

export const timeline = (() => {
  let t = INTRO;
  return chapters.map((c, i) => {
    const len = Math.max(chapterFrames(c), c.phone ? place(c.phone).reduce((n, s) => n + s.len, 0) : 0);
    const item = { ...c, index: i, start: t, len };
    t += len;
    return item;
  });
})();

export const CHAPTERS_END = timeline[timeline.length - 1].start + timeline[timeline.length - 1].len;
export const TOTAL = CHAPTERS_END + OUTRO;

/** Tous les extraits « navigateur », mis bout à bout sur toute la durée des chapitres. */
export const deskSegs: Placed[] = (() => {
  const all: Seg[] = [];
  for (const c of chapters) all.push(...c.desk);
  return place(all);
})();

/** Chemin de l'URL pour un clip à un instant donné. */
export function pathAt(clip: ClipName, sec: number) {
  let p = urls[clip][0][1];
  for (const [t, path] of urls[clip]) if (sec >= t) p = path;
  return p;
}
