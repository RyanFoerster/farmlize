import { interpolate, useCurrentFrame } from 'remotion';
import { C, clamp, ease, F } from '../theme';

/** Grain « risographie » des illustrations du site, posé sur toute l'image. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity, pointerEvents: 'none' }}>
    <filter id="fz-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.14  0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 1.4 -0.35" />
    </filter>
    <rect width="100%" height="100%" filter="url(#fz-grain)" />
  </svg>
);

const RIBBON_TEXT = 'FERMES LOCALES - LÉGUMES - FRUITS - FROMAGES - VIANDES - MIEL - PAINS - ŒUFS - BIO - SAIN - ';

/**
 * Le ruban zigzag du hero, avec son texte qui défile.
 * `draw` : 0 → 1 (dessin du ruban) ; le texte apparaît sur la fin.
 */
export const Ribbon: React.FC<{
  draw: number;
  color?: string;
  d?: string;
  speed?: number;
  style?: React.CSSProperties;
  id: string;
}> = ({ draw, color = C.coral, d = 'M -260 392 L 320 132 L 582 200 L 1076 128 L 1616 214 L 2260 -40', speed = 2.2, style, id }) => {
  const frame = useCurrentFrame();
  const len = 2650;
  return (
    <svg viewBox="0 0 2000 340" style={{ overflow: 'visible', ...style }}>
      <path id={id} d={d} fill="none" />
      <use
        href={`#${id}`}
        stroke={color}
        strokeWidth={74}
        strokeLinejoin="miter"
        strokeMiterlimit={6}
        fill="none"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      <text dy="0.36em" style={{ fontFamily: F.body, fontWeight: 700, fontSize: 33, letterSpacing: '0.02em', fill: C.ink }} opacity={interpolate(draw, [0.6, 1], [0, 1], clamp)}>
        <textPath href={`#${id}`} startOffset={-frame * speed}>
          {RIBBON_TEXT.repeat(6)}
        </textPath>
      </text>
    </svg>
  );
};

/** Mot à mot, masqué ligne par ligne (comme les titres SplitText du site). */
export const RiseText: React.FC<{
  lines: string[];
  frame: number;
  /** image de sortie (relative), facultative */
  outAt?: number;
  stagger?: number;
  style?: React.CSSProperties;
  dur?: number;
}> = ({ lines, frame, outAt, stagger = 2.5, style, dur = 26 }) => {
  let w = 0;
  return (
    <div style={style}>
      {lines.map((line, li) => (
        <div key={li} style={{ overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          {line.split(' ').map((word, wi) => {
            const k = w++;
            const inY = interpolate(frame - k * stagger, [0, dur], [112, 0], { ...clamp, easing: ease.out });
            const outY = outAt === undefined ? 0 : interpolate(frame - outAt - k * 1.2, [0, 16], [0, -112], { ...clamp, easing: ease.in });
            return (
              <span key={wi} style={{ display: 'inline-block', translate: `0 ${inY + outY}%`, marginRight: '0.24em' }}>
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
