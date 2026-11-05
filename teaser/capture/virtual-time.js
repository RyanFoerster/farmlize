// Injecté avant tout script de la page : remplace l'horloge par une horloge virtuelle
// avancée image par image depuis Node (window.__vt.advance). Résultat : une capture
// parfaitement fluide, quelle que soit la vitesse réelle du rendu.
// Couvre performance.now, Date, setTimeout/setInterval, requestAnimationFrame
// et les animations CSS / Web Animations (dont les View Transitions).
(() => {
  if (window.__vt) return;
  const RealDate = Date;
  // samedi 13 juin 2026, 10h24 : les fermes sont ouvertes et c'est la saison des fraises
  const T0 = new RealDate(2026, 5, 13, 10, 24, 0).getTime();
  let now = 0;

  const realSetTimeout = window.setTimeout.bind(window);
  const realClearTimeout = window.clearTimeout.bind(window);

  // --- horloges
  performance.now = () => now;
  function VDate(...a) {
    if (!new.target) return new RealDate(T0 + now).toString();
    return a.length ? new RealDate(...a) : new RealDate(T0 + now);
  }
  VDate.prototype = RealDate.prototype;
  VDate.now = () => T0 + now;
  VDate.parse = RealDate.parse;
  VDate.UTC = RealDate.UTC;
  window.Date = VDate;

  // --- minuteries (les délais nuls restent réels : ce sont des « next tick »)
  const timers = new Map();
  let nextId = 1;
  window.setTimeout = function (fn, ms, ...args) {
    ms = Number(ms) || 0;
    if (ms <= 0) return realSetTimeout(fn, 0, ...args);
    const id = 1e7 + nextId++;
    timers.set(id, { due: now + ms, fn, args, every: 0 });
    return id;
  };
  window.setInterval = function (fn, ms, ...args) {
    ms = Math.max(1, Number(ms) || 0);
    const id = 1e7 + nextId++;
    timers.set(id, { due: now + ms, fn, args, every: ms });
    return id;
  };
  window.clearTimeout = window.clearInterval = (id) => {
    if (timers.has(id)) timers.delete(id);
    else realClearTimeout(id);
  };

  // --- requestAnimationFrame
  let rafs = new Map();
  let rafId = 0;
  window.requestAnimationFrame = (cb) => {
    const id = ++rafId;
    rafs.set(id, cb);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    rafs.delete(id);
  };

  // --- animations CSS / WAAPI : mises en pause puis positionnées sur l'horloge virtuelle
  const seen = new WeakMap();
  const syncAnimations = () => {
    let list;
    try {
      list = document.getAnimations();
    } catch {
      return;
    }
    for (const a of list) {
      let start = seen.get(a);
      if (start === 'done') continue;
      if (start === undefined) {
        start = now;
        seen.set(a, start);
      }
      const t = now - start;
      try {
        const end = a.effect ? a.effect.getComputedTiming().endTime : Infinity;
        if (a.playbackRate > 0 && Number.isFinite(end) && t >= end) {
          a.finish();
          seen.set(a, 'done');
        } else {
          if (a.playState !== 'paused') a.pause();
          a.currentTime = t * (a.playbackRate || 1);
        }
      } catch {}
    }
  };

  const advance = (dt) => {
    const target = now + dt;
    for (let guard = 0; guard < 2000; guard++) {
      let next = null;
      for (const entry of timers) if (entry[1].due <= target && (!next || entry[1].due < next[1].due)) next = entry;
      if (!next) break;
      const [id, t] = next;
      now = Math.max(now, t.due);
      if (t.every) t.due += t.every;
      else timers.delete(id);
      try {
        if (typeof t.fn === 'function') t.fn(...t.args);
      } catch (e) {
        console.error(e);
      }
    }
    now = target;
    syncAnimations();
    const queue = rafs;
    rafs = new Map();
    for (const cb of queue.values()) {
      try {
        cb(now);
      } catch (e) {
        console.error(e);
      }
    }
    syncAnimations();
    return now;
  };

  window.__vt = {
    advance,
    get now() {
      return now;
    },
  };
})();
