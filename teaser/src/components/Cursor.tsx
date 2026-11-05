import { interpolate } from 'remotion';
import { C, clamp, ease } from '../theme';

const ARROW = 'M3 2.2v18.6l5.1-4.9 3.2 7.3 3.3-1.4-3.2-7.2h7.1L3 2.2z';
const HAND =
  'M9.3 2.4c.9 0 1.7.8 1.7 1.7v6.6l.4-.1c.9-.1 1.6.4 1.8 1.2.3-.6.9-1 1.6-1 .8 0 1.4.5 1.6 1.2.3-.4.8-.6 1.3-.6.9 0 1.6.7 1.6 1.6v4.4c0 3.1-2.5 5.6-5.6 5.6h-1.8c-1.8 0-3.4-.8-4.5-2.2l-3.6-4.8c-.5-.7-.4-1.7.3-2.2.7-.5 1.6-.4 2.1.2l1.4 1.6V4.1c0-.9.8-1.7 1.7-1.7z';

/**
 * Curseur dessiné par-dessus la capture (le navigateur headless n'en a pas).
 * `age` : nombre d'images depuis le dernier clic (pour l'onde).
 */
export const Cursor: React.FC<{
  x: number;
  y: number;
  down: boolean;
  kind: number;
  visible: boolean;
  touch?: boolean;
  age: number;
  size?: number;
}> = ({ x, y, down, kind, visible, touch, age, size = 30 }) => {
  const ring = age >= 0 && age < 26;
  const ringT = interpolate(age, [0, 26], [0, 1], { ...clamp, easing: ease.out });
  return (
    <>
      {ring ? (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: size * 1.9,
            height: size * 1.9,
            marginLeft: -size * 0.95,
            marginTop: -size * 0.95,
            borderRadius: '50%',
            border: `3px solid ${C.coral}`,
            opacity: 1 - ringT,
            scale: String(0.25 + ringT * 0.9),
          }}
        />
      ) : null}
      {touch ? (
        down ? (
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size * 1.5,
              height: size * 1.5,
              marginLeft: -size * 0.75,
              marginTop: -size * 0.75,
              borderRadius: '50%',
              background: 'rgba(35,44,38,0.22)',
              boxShadow: '0 0 0 2px rgba(255,255,255,0.8)',
            }}
          />
        ) : null
      ) : visible ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: kind === 1 ? x - size * 0.39 : kind === 2 ? x - size / 2 : x - size * 0.12,
            top: kind === 1 ? y - size * 0.1 : kind === 2 ? y - size / 2 : y - size * 0.09,
            overflow: 'visible',
            scale: down ? '0.88' : '1',
            filter: 'drop-shadow(0 3px 5px rgba(35,44,38,0.28))',
          }}
        >
          {kind === 2 ? (
            <path d="M9 3h6M12 3v18M9 21h6" stroke={C.ink} strokeWidth={2.2} strokeLinecap="round" fill="none" />
          ) : (
            <path
              d={kind === 1 ? HAND : ARROW}
              fill={C.white}
              stroke={C.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          )}
        </svg>
      ) : null}
    </>
  );
};
