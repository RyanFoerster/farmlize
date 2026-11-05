import type { APIRoute } from 'astro';
import { indexedPaths } from '../lib/seo';

/** Plan du site pour les moteurs de recherche : les pages publiques et toutes les fiches fermes. */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://farmlize.ryanfoerster.dev');
  const urls = indexedPaths
    .map((p) => `  <url><loc>${new URL(p, base).href}</loc><priority>${p === '/' ? '1.0' : p.startsWith('/fermes/') ? '0.7' : '0.8'}</priority></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
