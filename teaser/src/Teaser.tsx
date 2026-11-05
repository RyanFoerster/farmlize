import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { ClipStack } from './components/ClipStack';
import { Grain, RiseText, Ribbon } from './components/Decor';
import { BAR, BrowserFrame, PhoneFrame } from './components/Frames';
import { CHAPTERS_END, deskSegs, FPS, INTRO, OUTRO, pathAt, place, timeline } from './edit';
import { C, clamp, display, ease, eyebrow, F, logoType } from './theme';

// --- mise en page (1080 × 1350)
const BW = 960; // largeur du navigateur
const BH = 720; // hauteur de l'écran (viewport 1280 × 960)
const BX = 60;
const BY = 446;
const PW = 340; // largeur de l'écran du téléphone (viewport 390 × 844)
const PH = Math.round((844 * PW) / 390);
const mobile = timeline.find((c) => c.phone)!;

export const Teaser: React.FC = () => {
  const f = useCurrentFrame();

  // ---------------------------------------------------------------- navigateur
  const enter = interpolate(f, [INTRO - 30, INTRO + 18], [0, 1], { ...clamp, easing: ease.expo });
  const exit = interpolate(f, [CHAPTERS_END, CHAPTERS_END + 34], [0, 1], { ...clamp, easing: ease.in });
  const mob = interpolate(f, [mobile.start, mobile.start + 40], [0, 1], { ...clamp, easing: ease.inOut });

  // chemin affiché dans la barre d'adresse
  const local = f - INTRO;
  let path = '/';
  for (const s of deskSegs) {
    if (local >= s.start) path = pathAt(s.clip, s.from + (Math.min(local, s.start + s.len) - s.start) * (s.rate / FPS));
  }

  // ---------------------------------------------------------------- chapitre courant
  const current = timeline.find((c) => f >= c.start && f < c.start + c.len) ?? (f >= CHAPTERS_END ? timeline[timeline.length - 1] : null);
  const chromeIn = interpolate(f, [INTRO, INTRO + 24], [0, 1], clamp) * (1 - interpolate(f, [CHAPTERS_END, CHAPTERS_END + 20], [0, 1], clamp));

  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: F.body, color: C.ink, perspective: 1800 }}>
      {/* ------------------------------------------------ intro */}
      <Sequence durationInFrames={INTRO + 10} layout="none">
        <Intro />
      </Sequence>

      {/* ------------------------------------------------ titres de chapitre */}
      {timeline.map((c) => {
        const t = f - c.start;
        if (t < 0 || t > c.len + 24) return null;
        const last = c.index === timeline.length - 1;
        const outAt = last ? c.len : c.len - 14;
        return (
          <div key={c.id} style={{ position: 'absolute', left: 80, right: 80, top: 116 }}>
            <RiseText
              lines={[`${String(c.index + 1).padStart(2, '0')} — ${c.label}`]}
              frame={t}
              outAt={outAt}
              dur={22}
              style={{ ...eyebrow, display: 'flex' }}
            />
            <RiseText lines={c.title} frame={t - 3} outAt={outAt - 2} style={{ ...display, fontSize: 86, marginTop: 22 }} />
          </div>
        );
      })}

      {/* ------------------------------------------------ navigateur */}
      <div
        style={{
          position: 'absolute',
          left: BX,
          top: BY,
          transformOrigin: '50% 0%',
          translate: `${interpolate(mob, [0, 1], [0, -118])}px ${interpolate(enter, [0, 1], [920, 0]) + exit * 980}px`,
          rotate: `x ${interpolate(enter, [0, 1], [16, 0]) - exit * 10}deg`,
          scale: String(interpolate(enter, [0, 1], [0.92, 1]) * interpolate(mob, [0, 1], [1, 0.84])),
        }}
      >
        <BrowserFrame width={BW} screenH={BH} path={path}>
          <Sequence from={INTRO} layout="none">
            <ClipStack segs={deskSegs} width={BW} hold={OUTRO} />
          </Sequence>
        </BrowserFrame>
      </div>

      {/* ------------------------------------------------ téléphone */}
      {f >= mobile.start - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 770 - (PW + 26) / 2,
            top: BY - 30,
            translate: `0 ${interpolate(mob, [0, 1], [980, 0]) + exit * 1000}px`,
            rotate: `${interpolate(mob, [0, 1], [8, 0])}deg`,
          }}
        >
          <PhoneFrame screenW={PW} screenH={PH}>
            <Sequence from={mobile.start} layout="none">
              <ClipStack segs={place(mobile.phone!)} width={PW} hold={OUTRO} touch />
            </Sequence>
          </PhoneFrame>
        </div>
      ) : null}

      {/* ------------------------------------------------ pied : logo + progression */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 1266,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: chromeIn,
        }}
      >
        <span style={{ ...logoType, fontSize: 30 }}>Farmlize</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {timeline.map((c) => {
            const p = interpolate(f, [c.start, c.start + c.len], [0, 1], clamp);
            return (
              <span key={c.id} style={{ position: 'relative', width: 46, height: 6, borderRadius: 9, background: C.line, overflow: 'hidden' }}>
                <span style={{ position: 'absolute', inset: 0, background: current?.id === c.id ? C.coral : C.ink, scale: `${p} 1`, transformOrigin: '0 50%' }} />
              </span>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------ outro */}
      <Sequence from={CHAPTERS_END} layout="none">
        <Outro />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};

// ==================================================================== intro
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [INTRO - 34, INTRO + 4], [0, 1], { ...clamp, easing: ease.in });
  const line = interpolate(f, [26, 52], [0, 1], { ...clamp, easing: ease.inOut });
  return (
    <AbsoluteFill style={{ translate: `0 ${-out * 160}px`, opacity: 1 - out }}>
      <Ribbon id="rib-intro" draw={interpolate(f, [0, 52], [0, 1], { ...clamp, easing: ease.inOut })} style={{ position: 'absolute', left: -330, top: 150, width: 1740 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center' }}>
        <RiseText lines={['Farmlize']} frame={f - 10} stagger={0} dur={30} style={{ ...logoType, fontSize: 132, display: 'inline-block' }} />
      </div>
      <div style={{ position: 'absolute', left: 539, top: 676, width: 2, height: 78, background: C.ink, scale: `1 ${line}`, transformOrigin: '50% 0%' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center' }}>
        <RiseText lines={['Trouvez les fermes', 'près de chez vous !']} frame={f - 30} style={{ ...display, fontSize: 92 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1190, textAlign: 'center' }}>
        <RiseText lines={['Case study · Prototype web']} frame={f - 46} dur={22} style={{ ...eyebrow }} />
      </div>
    </AbsoluteFill>
  );
};

// ==================================================================== outro
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [52, 76], [0, 1], { ...clamp, easing: ease.inOut });
  return (
    <AbsoluteFill>
      <Ribbon id="rib-outro" draw={interpolate(f, [14, 70], [0, 1], { ...clamp, easing: ease.inOut })} style={{ position: 'absolute', left: -330, top: 150, width: 1740 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center' }}>
        <RiseText lines={['Farmlize']} frame={f - 34} stagger={0} dur={30} style={{ ...logoType, fontSize: 132, display: 'inline-block' }} />
      </div>
      <div style={{ position: 'absolute', left: 539, top: 676, width: 2, height: 78, background: C.ink, scale: `1 ${line}`, transformOrigin: '50% 0%' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center' }}>
        <RiseText lines={['Le case study', 'arrive bientôt.']} frame={f - 56} style={{ ...display, fontSize: 92 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1190, textAlign: 'center' }}>
        <RiseText lines={['Astro · GSAP · Lenis · MapLibre']} frame={f - 78} dur={22} style={{ ...eyebrow }} />
      </div>
    </AbsoluteFill>
  );
};
