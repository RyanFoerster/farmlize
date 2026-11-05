# Farmlize — teaser vidéo (LinkedIn)

Vidéo 4:5 (1080 × 1350, 60 i/s, ~38 s) qui montre le vrai site en action : loader, scroll, onboarding, carte, transition vers une fiche ferme, version mobile.

## Comment c'est fait

1. **Capture** (`capture/`) — Playwright pilote le site **buildé** (`npm run build` puis `npm run preview -- --port 4400` à la racine).
   `virtual-time.js` remplace l'horloge de la page (rAF, timers, `performance.now`, animations CSS / View Transitions) :
   chaque image est calculée puis photographiée, d'où une vidéo parfaitement fluide quelle que soit la machine.
   Les positions de la souris sont enregistrées à part (`public/clips/*.json`) : le curseur est redessiné au montage.
2. **Montage** (`src/`) — Remotion. Tout le découpage est dans **`src/edit.ts`** : chapitres, titres, extraits (`from` / `to` en secondes dans les clips), vitesses (`rate`).

## Commandes (dans `teaser/`)

```bash
npm run capture                 # recapture tout (ou : node capture/capture.mjs home journey mobile)
npm run studio                  # prévisualisation interactive
npm run render                  # → out/farmlize-teaser-4x5.mp4
```

Outils de contrôle : `node capture/sheet.mjs <clip.mp4> <out.jpg> 2:0.5:12` (planche d'un clip),
`node capture/stills.mjs <out.jpg> 100,400,900` (planche d'images du montage).

## À savoir

- La capture utilise Chrome (Windows) et le ffmpeg fourni par Remotion pour Windows : lancez-la depuis Windows (PowerShell / `npm.cmd`), pas depuis WSL.
- Date simulée pendant la capture : samedi 13 juin 2026, 10 h 24 (fermes ouvertes, saison des fraises) — modifiable en tête de `capture/virtual-time.js`.
- Domaine affiché dans la barre d'adresse : `DOMAIN` dans `src/edit.ts`.
- Pas de musique : LinkedIn lit les vidéos en muet par défaut ; ajoutez-en une au besoin (CapCut, ou `<Audio>` dans Remotion).
