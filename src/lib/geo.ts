import { communes, type Commune } from '../data/communes';
import type { Hours } from '../data/farms';

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatKm(km: number) {
  return km < 10 ? `${km.toFixed(1).replace('.', ',')} km` : `${Math.round(km)} km`;
}

export function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchCommunes(query: string, limit = 6): Commune[] {
  const q = normalize(query);
  if (!q) return [];
  const scored: [number, Commune][] = [];
  for (const c of communes) {
    const n = normalize(c.name);
    const alt = c.alt ? normalize(c.alt) : '';
    let score = -1;
    if (c.zip.startsWith(q)) score = 3;
    else if (n.startsWith(q) || alt.startsWith(q)) score = 2;
    else if (n.includes(q) || alt.includes(q) || normalize(c.province).startsWith(q)) score = 1;
    if (score >= 0) scored.push([score, c]);
  }
  return scored
    .sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name, 'fr'))
    .slice(0, limit)
    .map(([, c]) => c);
}

export function nearestCommune(lat: number, lng: number): Commune {
  let best = communes[0];
  let bestD = Infinity;
  for (const c of communes) {
    const d = distanceKm({ lat, lng }, c);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

const dayShort = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
export const dayLong = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const toMin = (t: string) => {
  const [h, mm] = t.split(':').map(Number);
  return h * 60 + mm;
};
const fmt = (t: string) => t.replace(/^0(\d)/, '$1').replace(':', 'h').replace(/h00$/, 'h');

/** Statut d'ouverture lisible à partir des horaires (index 0 = lundi). */
export function openStatus(hours: Hours, now = new Date()) {
  const day = (now.getDay() + 6) % 7;
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = hours[day] ?? [];
  const alwaysOpen = hours.every((d) => d.length === 1 && d[0][0] === '00:00' && d[0][1] === '23:59');
  if (alwaysOpen) return { open: true, label: 'Ouvert 24h/24', short: '24h/24' };
  for (const [a, b] of today) {
    if (mins >= toMin(a) && mins < toMin(b)) {
      const left = toMin(b) - mins;
      return {
        open: true,
        soon: left <= 45,
        label: left <= 45 ? `Ferme bientôt · ${fmt(b)}` : `Ouvert · jusqu’à ${fmt(b)}`,
        short: `jusqu’à ${fmt(b)}`,
      };
    }
  }
  // prochaine ouverture
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    for (const [a] of hours[d] ?? []) {
      if (i === 0 && toMin(a) <= mins) continue;
      const when = i === 0 ? `à ${fmt(a)}` : i === 1 ? `demain ${fmt(a)}` : `${dayShort[d]} ${fmt(a)}`;
      return { open: false, label: `Fermé · ouvre ${when}`, short: `ouvre ${when}` };
    }
  }
  return { open: false, label: 'Fermé', short: 'fermé' };
}

export function formatRanges(r: [string, string][]) {
  if (!r.length) return 'Fermé';
  if (r.length === 1 && r[0][0] === '00:00' && r[0][1] === '23:59') return '24h/24';
  return r.map(([a, b]) => `${fmt(a)} – ${fmt(b)}`).join(' · ');
}
