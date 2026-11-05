// Rend quelques images du montage et les assemble en planche : node capture/stills.mjs <out.jpg> <f1,f2,...> [largeur] [colonnes]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from './take.mjs';

const require = createRequire(join(ROOT, '..', 'package.json'));
const sharp = require('sharp');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const [out, spec, width = '360', colsArg = '4'] = process.argv.slice(2);
const frames = spec.split(',').map(Number);
const serveUrl = await bundle({ entryPoint: join(ROOT, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: 'Teaser', browserExecutable: CHROME });
const dir = mkdtempSync(join(tmpdir(), 'stills-'));
const files = [];
for (const frame of frames) {
  const output = join(dir, `${frame}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable: CHROME, chromeMode: 'chrome-for-testing' });
  files.push(output);
}
const w = Number(width);
const h = Math.round((w * composition.height) / composition.width);
const cols = Number(colsArg);
const rows = Math.ceil(files.length / cols);
const pad = 8;
const tiles = await Promise.all(files.map((f) => sharp(f).resize(w, h).toBuffer()));
await sharp({ create: { width: cols * w + (cols + 1) * pad, height: rows * h + (rows + 1) * pad, channels: 3, background: '#888' } })
  .composite(tiles.map((input, i) => ({ input, left: pad + (i % cols) * (w + pad), top: pad + Math.floor(i / cols) * (h + pad) })))
  .jpeg({ quality: 88 })
  .toFile(out);
rmSync(dir, { recursive: true, force: true });
console.log(`${out} — images ${frames.join(', ')} / ${composition.durationInFrames}`);
