import { continueRender, delayRender, Easing, staticFile } from 'remotion';

/** Tokens repris de src/styles/global.css du site. */
export const C = {
  cream: '#fcfbf2',
  cream2: '#f6f4e8',
  sand: '#f0efe9',
  line: '#e4e0d3',
  ink: '#232c26',
  ink2: '#48514a',
  muted: '#7b8078',
  coral: '#fa7474',
  butter: '#f9f671',
  leaf: '#a9c77a',
  moss: '#6e9a4b',
  sky: '#bfdde0',
  white: '#ffffff',
};

export const F = {
  logo: "'Fraunces Variable', Georgia, serif",
  display: "'Bricolage Grotesque Variable', 'DM Sans Variable', sans-serif",
  body: "'DM Sans Variable', system-ui, sans-serif",
};

/** Styles typographiques du site (.logo-type, .display). */
export const logoType: React.CSSProperties = {
  fontFamily: F.logo,
  fontWeight: 800,
  fontVariationSettings: "'opsz' 9",
  letterSpacing: '-0.035em',
  lineHeight: 1,
  textTransform: 'uppercase',
};
export const display: React.CSSProperties = {
  fontFamily: F.display,
  fontWeight: 700,
  fontVariationSettings: "'opsz' 96, 'wdth' 82",
  letterSpacing: '-0.035em',
  lineHeight: 0.98,
};
export const eyebrow: React.CSSProperties = {
  fontFamily: F.body,
  fontWeight: 600,
  fontSize: 24,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: C.ink2,
};

/** Courbes du site : fz.out / fz.inOut. */
export const ease = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.75, 0.2),
  expo: Easing.bezier(0.16, 1, 0.3, 1),
};

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// --- polices du site, chargées avant le rendu de la première image
const fonts: [string, string, FontFaceDescriptors][] = [
  ['Fraunces Variable', 'fonts/fraunces.woff2', { weight: '100 900' }],
  ['Bricolage Grotesque Variable', 'fonts/bricolage.woff2', { weight: '200 800', stretch: '75% 100%' }],
  ['DM Sans Variable', 'fonts/dm-sans.woff2', { weight: '100 1000' }],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('Chargement des polices');
  Promise.all(
    fonts.map(([family, file, desc]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, desc).load().then((f) => (document.fonts as unknown as Set<FontFace>).add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}
