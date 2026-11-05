// Planche contact d'un clip : node capture/sheet.mjs <clip.mp4> <out.jpg> <t1,t2,...|start:step:count> [largeur] [colonnes]
// (le ffmpeg de Remotion n'a pas les filtres select/tile : on extrait image par image et on assemble avec sharp)
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from './take.mjs';

const require = createRequire(join(ROOT, '..', 'package.json'));
const sharp = require('sharp');

const [clip, out, spec, width = '640', colsArg] = process.argv.slice(2);
const FFMPEG = join(ROOT, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');
let times;
if (spec.includes(':')) {
  const [s, st, c] = spec.split(':').map(Number);
  times = Array.from({ length: c }, (_, i) => +(s + i * st).toFixed(3));
} else times = spec.split(',').map(Number);

const dir = mkdtempSync(join(tmpdir(), 'sheet-'));
const files = [];
for (const [i, t] of times.entries()) {
  const f = join(dir, `${i}.png`);
  spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(t), '-i', clip, '-frames:v', '1', '-vf', `scale=${width}:-2`, f]);
  files.push(f);
}
const meta = await sharp(files[0]).metadata();
const cols = Number(colsArg) || Math.min(3, files.length);
const rows = Math.ceil(files.length / cols);
const pad = 8;
const W = cols * meta.width + (cols + 1) * pad;
const H = rows * meta.height + (rows + 1) * pad;
await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
  .composite(files.map((f, i) => ({ input: f, left: pad + (i % cols) * (meta.width + pad), top: pad + Math.floor(i / cols) * (meta.height + pad) })))
  .jpeg({ quality: 85 })
  .toFile(out);
rmSync(dir, { recursive: true, force: true });
console.log(`${out} (${times.join(', ')}s)`);
