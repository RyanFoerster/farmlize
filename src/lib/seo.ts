/**
 * Référencement : adresse canonique des pages, pages indexées (sitemap) et données structurées (schema.org).
 */
import { farms, type Farm } from '../data/farms';

export const SITE_NAME = 'Farmlize';
export const DEFAULT_DESCRIPTION =
  'Farmlize vous connecte directement avec les producteurs, maraîchers, fromagers et artisans de votre région pour des produits sains et de saison.';

/** Chemin canonique, sans « .html », « /index » ni « / » final (sauf l'accueil). */
export function canonicalPath(pathname: string) {
  const p = pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/+$/, '$1');
  return p || '/';
}

/** Pages proposées aux moteurs de recherche (la planche et la 404 n'y sont pas). */
export const indexedPaths = ['/', '/fermes', '/saisons', '/producteurs', '/commencer', ...farms.map((f) => `/fermes/${f.slug}`)];

type Json = Record<string, unknown>;

export function websiteLd(site: URL): Json[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: site.href,
      inLanguage: 'fr-BE',
      description: DEFAULT_DESCRIPTION,
      // la recherche de la carte accepte ?q=
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${new URL('/fermes', site).href}?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: site.href,
      logo: new URL('/icon-512.png', site).href,
      areaServed: { '@type': 'Country', name: 'Belgique' },
    },
  ];
}

export function breadcrumbLd(site: URL, trail: [name: string, path: string][]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: new URL(path, site).href,
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Description d'une fiche ferme (≈ 150 caractères) : qui, où, quoi. */
export function farmDescription(farm: Farm) {
  return `${farm.name}, ferme à ${farm.commune} : ${farm.tagline.replace(/\.$/, '')}. Produits de saison, horaires et accès sur Farmlize.`;
}
