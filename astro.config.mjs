// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // adresse publique : URLs canoniques, Open Graph, sitemap
  site: 'https://farmlize.ryanfoerster.dev',
  // une page = un fichier (saisons.html servi à /saisons) : les liens internes, tous sans « / » final,
  // arrivent directement sur la page au lieu de passer par une redirection
  build: { format: 'file' },
  trailingSlash: 'never',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
