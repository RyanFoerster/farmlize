// Une « prise » : pilote une page Playwright image par image et encode le flux en MP4.
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..');
export const CLIPS = join(ROOT, 'public', 'clips');
const FFMPEG = join(ROOT, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');

export const ease = {
  linear: (t) => t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
};

export async function launch() {
  return chromium.launch({
    channel: 'chrome',
    headless: true,
    args: [
      '--use-angle=d3d11',
      '--enable-gpu',
      '--ignore-gpu-blocklist',
      '--enable-gpu-rasterization',
      '--force-color-profile=srgb',
      '--hide-scrollbars',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
    ],
  });
}

export class Take {
  /**
   * @param {import('playwright-core').Browser} browser
   * @param {{name:string, base:string, viewport:{width:number,height:number}, dsf?:number, fps?:number, mobile?:boolean, quality?:number}} o
   */
  static async create(browser, o) {
    const t = new Take();
    t.name = o.name;
    t.base = o.base;
    t.fps = o.fps ?? 60;
    t.viewport = o.viewport;
    t.dsf = o.dsf ?? 1.5;
    t.quality = o.quality ?? 92;
    t.context = await browser.newContext({
      viewport: o.viewport,
      deviceScaleFactor: t.dsf,
      isMobile: !!o.mobile,
      hasTouch: !!o.mobile,
      locale: 'fr-BE',
      timezoneId: 'Europe/Brussels',
      colorScheme: 'light',
      reducedMotion: 'no-preference',
    });
    await t.context.addInitScript({ path: join(here, 'virtual-time.js') });
    t.page = await t.context.newPage();
    t.page.on('pageerror', (e) => console.error(`[${t.name}] pageerror`, e.message));
    t.page.on('console', (m) => m.type() === 'error' && console.error(`[${t.name}] console`, m.text()));
    t.cdp = await t.context.newCDPSession(t.page);
    t.cursor = { x: o.viewport.width * 0.62, y: o.viewport.height * 0.72, down: 0, shown: !o.mobile };
    t.track = [];
    t.marks = {};
    t.count = 0;
    return t;
  }

  async goto(path) {
    await this.page.goto(this.base + path, { waitUntil: 'load' });
    await this.page.evaluate(() => document.fonts.ready);
  }

  /** Démarre l'encodeur. */
  start() {
    mkdirSync(CLIPS, { recursive: true });
    this.out = join(CLIPS, `${this.name}.mp4`);
    this.proc = spawn(
      FFMPEG,
      [
        '-y', '-hide_banner', '-loglevel', 'error',
        '-f', 'image2pipe', '-framerate', String(this.fps), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '13', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
        this.out,
      ],
      { stdio: ['pipe', 'inherit', 'inherit'] },
    );
    this.t0 = Date.now();
  }

  mark(label) {
    this.marks[label] = this.count;
    console.log(`[${this.name}] ${label} @ ${this.count} (${(this.count / this.fps).toFixed(2)}s)`);
  }

  /** Avance l'horloge d'une image et capture. */
  async frame() {
    const { x, y } = this.cursor;
    const cur = await this.page.evaluate(
      ([dt, x, y]) => {
        window.__vt.advance(dt);
        const el = document.elementFromPoint(x, y);
        return el ? getComputedStyle(el).cursor : 'auto';
      },
      [1000 / this.fps, x, y],
    );
    const { data } = await this.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: this.quality, optimizeForSpeed: true });
    if (!this.proc.stdin.write(Buffer.from(data, 'base64'))) await once(this.proc.stdin, 'drain');
    const kind = cur === 'pointer' ? 1 : cur === 'text' ? 2 : cur === 'grab' || cur === 'grabbing' ? 3 : 0;
    this.track.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10, this.cursor.down, kind, this.cursor.shown ? 1 : 0]);
    this.count++;
    if (this.count % 120 === 0) {
      const s = (Date.now() - this.t0) / 1000;
      console.log(`[${this.name}] ${this.count} images · ${(this.count / s).toFixed(1)} img/s`);
    }
  }

  async frames(n) {
    for (let i = 0; i < n; i++) await this.frame();
  }

  wait(sec) {
    return this.frames(Math.round(sec * this.fps));
  }

  /** Déplace la souris en douceur (courbe légère, comme une vraie main). */
  async move(x, y, dur = 0.8, fn = ease.inOut) {
    const from = { ...this.cursor };
    const n = Math.max(1, Math.round(dur * this.fps));
    // petit arc perpendiculaire au trajet
    const dx = x - from.x;
    const dy = y - from.y;
    const bend = Math.min(60, Math.hypot(dx, dy) * 0.12);
    for (let i = 1; i <= n; i++) {
      const k = fn(i / n);
      const arc = Math.sin(Math.PI * k) * bend;
      const len = Math.hypot(dx, dy) || 1;
      this.cursor.x = from.x + dx * k + (-dy / len) * arc;
      this.cursor.y = from.y + dy * k + (dx / len) * arc;
      await this.page.mouse.move(this.cursor.x, this.cursor.y);
      await this.frame();
    }
  }

  /** Centre d'un élément (coordonnées viewport). */
  async center(selector, { dx = 0, dy = 0, nth = 0 } = {}) {
    const box = await this.page.locator(selector).nth(nth).boundingBox({ timeout: 3000 }).catch(() => null);
    if (!box) {
      const dbg = join(ROOT, 'out', `debug-${this.name}.png`);
      mkdirSync(dirname(dbg), { recursive: true });
      await this.page.screenshot({ path: dbg });
      const info = await this.page.evaluate((s) => ({ url: location.href, count: document.querySelectorAll(s).length }), selector);
      throw new Error(`[${this.name}] introuvable : ${selector} — ${JSON.stringify(info)} (capture : ${dbg})`);
    }
    return { x: box.x + box.width / 2 + dx, y: box.y + box.height / 2 + dy, box };
  }

  async moveTo(selector, dur = 0.8, opts = {}) {
    const { x, y } = await this.center(selector, opts);
    await this.move(x, y, dur);
  }

  async click({ hold = 0.09, after = 0.05 } = {}) {
    this.cursor.down = 1;
    await this.page.mouse.down();
    await this.wait(hold);
    await this.page.mouse.up();
    this.cursor.down = 0;
    await this.wait(after);
  }

  async type(text, cps = 9) {
    for (const ch of text) {
      await this.page.keyboard.type(ch);
      await this.wait(1 / cps);
    }
  }

  /** Défilement Lenis (ou natif) vers une position, avec une courbe douce. */
  async scrollTo(target, dur = 1.6, offset = 0) {
    const hasLenis = await this.page.evaluate(
      ([target, dur, offset]) => {
        const l = window.__lenis;
        const y = typeof target === 'number' ? target : document.querySelector(target).getBoundingClientRect().top + window.scrollY + offset;
        if (!l) return y;
        l.scrollTo(y, { duration: dur, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), force: true });
        return true;
      },
      [target, dur, offset],
    );
    if (hasLenis === true) return this.wait(dur + 0.05);
    // pas de Lenis : on anime le scroll natif image par image
    const y0 = await this.page.evaluate(() => window.scrollY);
    const n = Math.round(dur * this.fps);
    for (let i = 1; i <= n; i++) {
      const y = y0 + (hasLenis - y0) * ease.inOut(i / n);
      await this.page.evaluate((y) => window.scrollTo(0, y), y);
      await this.frame();
    }
  }

  async finish() {
    this.proc.stdin.end();
    await once(this.proc, 'close');
    const meta = {
      name: this.name,
      fps: this.fps,
      viewport: this.viewport,
      dsf: this.dsf,
      frames: this.count,
      marks: this.marks,
      track: this.track,
    };
    writeFileSync(join(CLIPS, `${this.name}.json`), JSON.stringify(meta));
    const s = (Date.now() - this.t0) / 1000;
    console.log(`[${this.name}] ✓ ${this.count} images (${(this.count / this.fps).toFixed(1)}s) en ${s.toFixed(0)}s → ${this.out}`);
    await this.context.close();
  }
}
