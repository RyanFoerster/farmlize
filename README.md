# Farmlize — prototype

Trouver les fermes, maraîchers, fromagers et artisans près de chez soi, en Belgique.
Stack : **Astro 7** (ClientRouter / View Transitions), **GSAP 3.15** (SplitText, Flip, MorphSVG, ScrollTrigger, Draggable), **MapLibre GL 6** (tuiles OpenFreeMap), **Lenis**.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # site statique dans dist/
```

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Accueil : ruban zigzag animé, hero, étapes, saison du mois, coups de cœur, catégories, CTA producteurs |
| `/commencer` | Onboarding : commune (autocomplétion + géolocalisation) → catégories (les produits volent dans le panier) |
| `/fermes` | Explorer : liste filtrable (Flip) + carte synchronisée, rayon, ouvert maintenant, favoris, filtres avancés |
| `/fermes/[slug]` | Fiche ferme : horaires du jour, produits et saisonnalité, mot du producteur, mini-carte, fermes similaires |
| `/saisons` | Calendrier des fruits & légumes de saison en Belgique, mois par mois |
| `/producteurs` | Page producteurs + formulaire d'inscription en 3 étapes (prototype : rien n'est envoyé) |
| `/planche` | Page interne (non liée) : toutes les illustrations, icônes et couvertures au même endroit |

## Structure

- `src/data/` — fermes (fictives), communes belges, catégories, calendrier des saisons
- `src/lib/riso.ts` — encres « risographie » des illustrations + raccourci `shade()` pour les ombrages tramés
- `src/components/SvgDefs.astro` — filtre de trame `#ri-dot`, dégradés d'ombrage `#ri-{encre}-{direction}` et icônes produits (symboles)
- `src/components/illos/` — illustrations en SVG (hero, onboarding, panier, producteur, 404), animées en CSS (`.ri-sway`, `.ri-bob`…)
- `src/lib/season-art.ts` — les 45 petites illustrations du calendrier des saisons (une par fruit ou légume)
- `src/components/FarmCover.astro` — illustration générée par ferme (paysage + produits), déterministe par slug
- `public/textures/riso-grain.png` — masque d'impression (encre irrégulière, mouchetures) appliqué via la classe `.riso`
- `public/textures/paper-grain.png` — papier moucheté des cartes « imprimées » (classe `.print`, plaque de couleur décalée réglée par `--off`)
- `src/lib/motion.ts` — setup GSAP + `onPage()` (init/cleanup compatible avec le ClientRouter)
- `src/lib/map-style.ts` — recoloration du style vectoriel aux couleurs de la DA
- `teaser/` — vidéo teaser LinkedIn (capture du site + montage Remotion), voir `teaser/README.md`

## À savoir

- Toutes les illustrations sont en SVG, dans un style risographie : couleurs franches, formes géométriques, ombrages tramés. Le grain des ombrages vient d'un filtre SVG (le dégradé devient une densité de points), la texture d'impression d'un masque CSS.
- Les préférences (commune, catégories) et favoris sont stockés en `localStorage`.
- La carte a besoin d'une connexion (tuiles OpenFreeMap / données OpenStreetMap).
- `prefers-reduced-motion` est respecté (animations et défilement fluide désactivés).
