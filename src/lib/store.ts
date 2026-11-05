import type { CategoryId } from '../data/categories';

export interface Prefs {
  commune?: string;
  cats?: CategoryId[];
}

const PREFS = 'farmlize:prefs';
const FAVS = 'farmlize:favs';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible : on continue sans */
  }
}

export const getPrefs = () => read<Prefs>(PREFS, {});
export const setPrefs = (p: Prefs) => write(PREFS, { ...getPrefs(), ...p });

export const getFavs = () => read<string[]>(FAVS, []);
export function toggleFav(slug: string) {
  const favs = new Set(getFavs());
  const on = !favs.has(slug);
  if (on) favs.add(slug);
  else favs.delete(slug);
  write(FAVS, [...favs]);
  window.dispatchEvent(new CustomEvent('fz:favs', { detail: { slug, on, count: favs.size } }));
  return on;
}
