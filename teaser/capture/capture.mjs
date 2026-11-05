// Captures du site Farmlize (build de production servi sur :4400) pour le teaser.
// Usage : node capture/capture.mjs [home] [journey] [mobile]   (toutes par défaut)
import { launch, Take } from './take.mjs';

const BASE = process.env.FARMLIZE_URL || 'http://localhost:4400';
const DESKTOP = { width: 1280, height: 960 };
const MOBILE = { width: 390, height: 844 };

/** Évite le long loader de première visite (sauf pour la prise d'accueil). */
async function booted(t) {
  await t.context.addInitScript(() => {
    try {
      sessionStorage.setItem('farmlize:booted', '1');
    } catch {}
  });
}

const scenes = {
  // 1. Loader → hero → scroll de la home (stickers attrapés au passage)
  async home(browser) {
    const t = await Take.create(browser, { name: 'home', base: BASE, viewport: DESKTOP });
    await t.goto('/');
    t.start();
    t.mark('loader');
    await t.wait(4.1);
    t.mark('hero');
    await t.move(880, 560, 2.2);
    await t.move(420, 600, 2.4);
    await t.moveTo('[data-hero-cta]', 1.0, { dx: 30 });
    await t.wait(0.6);
    t.mark('scroll');
    await t.move(640, 700, 0.6);
    await t.scrollTo('#comment', 1.8);
    await t.wait(1.2);
    t.mark('season');
    await t.scrollTo('.season', 1.6);
    await t.wait(1.1);
    // on attrape un sticker
    const s = await t.center('.sticker', { nth: 2 });
    await t.move(s.x, s.y, 0.8);
    t.cursor.down = 1;
    await t.page.mouse.down();
    await t.wait(0.15);
    await t.move(s.x - 170, s.y - 70, 0.8);
    await t.wait(0.1);
    await t.page.mouse.up();
    t.cursor.down = 0;
    await t.wait(0.5);
    t.mark('picks');
    await t.move(900, 640, 0.6);
    await t.scrollTo('.picks', 1.6);
    await t.wait(1.0);
    t.mark('stats');
    await t.scrollTo('.stats', 1.4);
    await t.wait(1.8);
    t.mark('cats');
    await t.scrollTo('.cats', 1.4);
    await t.wait(1.4);
    t.mark('end');
    await t.finish();
  },

  // 2. Onboarding (commune + catégories) → explorateur → fiche ferme
  async journey(browser) {
    const t = await Take.create(browser, { name: 'journey', base: BASE, viewport: DESKTOP });
    await booted(t);
    await t.goto('/commencer');
    t.start();
    await t.wait(2.6);
    t.mark('where');
    await t.moveTo('[data-input]', 1.0, { dx: -120 });
    await t.click();
    await t.wait(0.3);
    await t.type('Nam', 8);
    await t.wait(0.5);
    await t.moveTo('[data-suggest] li[data-slug="namur"]', 0.7, { dx: -60 });
    await t.wait(0.2);
    await t.click();
    await t.wait(0.4);
    await t.moveTo('[data-next]', 0.7);
    await t.wait(0.15);
    await t.click();
    t.mark('what');
    await t.wait(1.9);
    for (const cat of ['legumes', 'fromages', 'oeufs', 'miel']) {
      await t.moveTo(`.blob[data-cat="${cat}"]`, 0.55, { dx: 18, dy: 8 });
      await t.wait(0.12);
      await t.click();
      await t.wait(0.45);
    }
    await t.wait(0.3);
    t.mark('go');
    await t.moveTo('[data-go]', 0.8);
    await t.wait(0.3);
    await t.click();
    t.mark('explore');
    await t.wait(3.4);
    console.log('[journey] url', t.page.url());
    // une carte : survol (le marqueur réagit) puis clic (la carte s'envole)
    await t.moveTo('[data-farm-card]:visible', 0.8, { nth: 1, dx: -40 });
    await t.wait(0.6);
    await t.click();
    t.mark('select');
    await t.wait(2.2);
    await t.moveTo('[data-farm-card]:visible .voir', 0.7, { nth: 1 });
    await t.wait(0.35);
    await t.click();
    t.mark('farm');
    await t.wait(2.8);
    t.mark('products');
    await t.move(820, 620, 0.5);
    await t.scrollTo('.farm-products', 2.0, -70);
    await t.wait(1.6);
    t.mark('info');
    await t.scrollTo('.farm-info', 1.6, -70);
    await t.wait(1.6);
    t.mark('end');
    await t.finish();
  },

  // 3. Mobile : hero → scroll → une ferme
  async mobile(browser) {
    const t = await Take.create(browser, { name: 'mobile', base: BASE, viewport: MOBILE, dsf: 2, mobile: true });
    await booted(t);
    await t.goto('/');
    t.start();
    await t.wait(3.6);
    t.mark('hero');
    await t.scrollTo('#comment', 1.6);
    await t.wait(0.9);
    t.mark('season');
    await t.scrollTo('.season', 1.6);
    await t.wait(1.4);
    t.mark('picks');
    await t.scrollTo('.picks', 1.5);
    await t.wait(0.8);
    const tile = await t.center('.farm-tile__link');
    t.cursor.x = tile.x;
    t.cursor.y = tile.y;
    await t.page.mouse.move(tile.x, tile.y);
    await t.click({ hold: 0.12 });
    t.mark('farm');
    await t.wait(2.6);
    await t.scrollTo('.farm-products', 1.8, -60);
    await t.wait(1.4);
    t.mark('end');
    await t.finish();
  },
};

const wanted = process.argv.slice(2);
const list = wanted.length ? wanted : Object.keys(scenes);
const browser = await launch();
try {
  for (const name of list) {
    if (!scenes[name]) throw new Error(`Scène inconnue : ${name}`);
    await scenes[name](browser);
  }
} finally {
  await browser.close();
}
