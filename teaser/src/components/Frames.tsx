import { C, F } from '../theme';
import { DOMAIN } from '../edit';

export const BAR = 54;

/** Fenêtre de navigateur sobre, aux couleurs du site. */
export const BrowserFrame: React.FC<{ width: number; screenH: number; path: string; children: React.ReactNode }> = ({
  width,
  screenH,
  path,
  children,
}) => (
  <div
    style={{
      width,
      borderRadius: 24,
      overflow: 'hidden',
      background: C.white,
      boxShadow: `0 0 0 1.5px rgba(35,44,38,0.08), 0 50px 90px -40px rgba(35,44,38,0.45), 0 18px 40px -24px rgba(35,44,38,0.25)`,
    }}
  >
    <div
      style={{
        height: BAR,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        background: C.cream2,
        borderBottom: `1.5px solid ${C.line}`,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', gap: 9 }}>
        {[C.coral, C.butter, C.leaf].map((c) => (
          <span key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c, boxShadow: 'inset 0 0 0 1px rgba(35,44,38,0.12)' }} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          translate: '-50% -50%',
          height: 34,
          minWidth: 380,
          padding: '0 22px',
          borderRadius: 999,
          background: C.white,
          boxShadow: `inset 0 0 0 1.5px ${C.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontFamily: F.body,
          fontSize: 17,
          fontWeight: 500,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        <svg width={13} height={15} viewBox="0 0 13 15" style={{ marginRight: 2 }}>
          <rect x="1" y="6.5" width="11" height="7.5" rx="2" fill={C.ink2} />
          <path d="M3.5 6.5V4.5a3 3 0 0 1 6 0v2" fill="none" stroke={C.ink2} strokeWidth="1.6" />
        </svg>
        {DOMAIN}
        <span style={{ color: C.muted, marginLeft: -8 }}>{path === '/' ? '' : path}</span>
      </div>
    </div>
    <div style={{ position: 'relative', width, height: screenH, overflow: 'hidden', background: C.cream }}>{children}</div>
  </div>
);

export const STATUS = 46;

/** Téléphone : écran = barre d'état + viewport mobile capturé. */
export const PhoneFrame: React.FC<{ screenW: number; screenH: number; children: React.ReactNode }> = ({ screenW, screenH, children }) => {
  const bezel = 13;
  return (
    <div
      style={{
        padding: bezel,
        borderRadius: 62,
        background: C.ink,
        boxShadow: `inset 0 0 0 2px #3a453d, 0 60px 90px -40px rgba(35,44,38,0.6), 0 20px 40px -20px rgba(35,44,38,0.35)`,
      }}
    >
      <div style={{ position: 'relative', width: screenW, height: STATUS + screenH, borderRadius: 50, overflow: 'hidden', background: C.cream }}>
        <div
          style={{
            height: STATUS,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 30px 0 34px',
            fontFamily: F.body,
            fontWeight: 700,
            fontSize: 17,
            color: C.ink,
            background: C.cream,
          }}
        >
          <span>10:24</span>
          <span style={{ width: 96, height: 28, borderRadius: 999, background: C.ink, marginTop: 2 }} />
          <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <svg width="18" height="12" viewBox="0 0 18 12">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={C.ink} />
              ))}
            </svg>
            <svg width="26" height="13" viewBox="0 0 26 13">
              <rect x="0.75" y="0.75" width="21.5" height="11.5" rx="3.5" fill="none" stroke={C.ink} strokeWidth="1.5" opacity="0.5" />
              <rect x="2.6" y="2.6" width="15" height="7.8" rx="2" fill={C.ink} />
              <rect x="23.4" y="4.3" width="1.8" height="4.4" rx="0.9" fill={C.ink} opacity="0.5" />
            </svg>
          </span>
        </div>
        <div style={{ position: 'relative', width: screenW, height: screenH, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
};
