import './theme';
import { Composition } from 'remotion';
import { FPS, H, TOTAL, W } from './edit';
import { Teaser } from './Teaser';

export const RemotionRoot: React.FC = () => (
  <Composition id="Teaser" component={Teaser} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
