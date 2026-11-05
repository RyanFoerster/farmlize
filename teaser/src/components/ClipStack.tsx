import { Video } from '@remotion/media';
import { Freeze, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { clips, FPS, type Placed } from '../edit';
import { clamp } from '../theme';
import { Cursor } from './Cursor';

/** Index de l'image source pour une image locale d'un extrait. */
export const srcFrame = (s: Placed, local: number) => {
  const meta = clips[s.clip];
  return Math.min(meta.frames - 1, Math.max(0, Math.round(s.from * FPS + local * s.rate)));
};

const Segment: React.FC<{ seg: Placed; width: number; touch?: boolean }> = ({ seg, width, touch }) => {
  const local = useCurrentFrame();
  const meta = clips[seg.clip];
  const scale = width / meta.viewport.width;
  const height = meta.viewport.height * scale;
  const i = srcFrame(seg, local);
  const [x, y, down, kind, shown] = meta.track[i];
  // âge du dernier clic, ramené au temps de la vidéo finale
  let age = -1;
  for (let k = i; k > Math.max(0, i - 60); k--) {
    if (meta.track[k][2] && !meta.track[k - 1]?.[2]) {
      age = (i - k) / seg.rate;
      break;
    }
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: seg.fadeIn ? interpolate(local, [0, seg.fadeIn], [0, 1], clamp) : 1,
      }}
    >
      <Video
        src={staticFile(`clips/${seg.clip}.mp4`)}
        trimBefore={Math.round(seg.from * FPS)}
        playbackRate={seg.rate}
        muted
        style={{ position: 'absolute', left: 0, top: 0, width, height }}
      />
      <Cursor x={x * scale} y={y * scale} down={!!down} kind={kind} visible={!!shown} touch={touch} age={age} size={touch ? 34 : 30} />
    </div>
  );
};

/**
 * Enchaîne des extraits (fondu court si deux extraits ne se suivent pas)
 * et fige la dernière image pendant `hold` images.
 */
export const ClipStack: React.FC<{ segs: Placed[]; width: number; hold?: number; touch?: boolean }> = ({
  segs,
  width,
  hold = 0,
  touch,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {segs.map((s, idx) => {
        const last = idx === segs.length - 1;
        const dur = s.len + s.tail + (last ? hold : 0);
        // le dernier extrait se fige sur sa dernière image
        const freeze = last && frame - s.start >= s.len;
        return (
          <Sequence key={idx} from={s.start} durationInFrames={dur} layout="none">
            {freeze ? (
              <Freeze frame={s.len - 1}>
                <Segment seg={s} width={width} touch={touch} />
              </Freeze>
            ) : (
              <Segment seg={s} width={width} touch={touch} />
            )}
          </Sequence>
        );
      })}
    </>
  );
};
