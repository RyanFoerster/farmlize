import type { APIRoute } from 'astro';

/** Tout est explorable (la planche et la 404 portent un « noindex ») ; on indique le plan du site. */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://farmlize.ryanfoerster.dev');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', base).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
