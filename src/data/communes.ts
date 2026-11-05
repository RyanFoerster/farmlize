export interface Commune {
  slug: string;
  name: string;
  alt?: string;
  province: string;
  zip: string;
  lat: number;
  lng: number;
}

/** Sélection de communes belges (coordonnées approximatives du centre). */
export const communes: Commune[] = [
  // Bruxelles-Capitale
  { slug: 'bruxelles', name: 'Bruxelles', alt: 'Brussel', province: 'Bruxelles-Capitale', zip: '1000', lat: 50.8467, lng: 4.3525 },
  { slug: 'ixelles', name: 'Ixelles', alt: 'Elsene', province: 'Bruxelles-Capitale', zip: '1050', lat: 50.8333, lng: 4.3667 },
  { slug: 'schaerbeek', name: 'Schaerbeek', alt: 'Schaarbeek', province: 'Bruxelles-Capitale', zip: '1030', lat: 50.8676, lng: 4.3737 },
  { slug: 'etterbeek', name: 'Etterbeek', province: 'Bruxelles-Capitale', zip: '1040', lat: 50.8333, lng: 4.3833 },
  { slug: 'saint-gilles', name: 'Saint-Gilles', alt: 'Sint-Gillis', province: 'Bruxelles-Capitale', zip: '1060', lat: 50.8262, lng: 4.3456 },
  { slug: 'anderlecht', name: 'Anderlecht', province: 'Bruxelles-Capitale', zip: '1070', lat: 50.8365, lng: 4.308 },
  { slug: 'molenbeek', name: 'Molenbeek-Saint-Jean', alt: 'Sint-Jans-Molenbeek', province: 'Bruxelles-Capitale', zip: '1080', lat: 50.855, lng: 4.33 },
  { slug: 'uccle', name: 'Uccle', alt: 'Ukkel', province: 'Bruxelles-Capitale', zip: '1180', lat: 50.8019, lng: 4.3372 },
  { slug: 'forest', name: 'Forest', alt: 'Vorst', province: 'Bruxelles-Capitale', zip: '1190', lat: 50.8106, lng: 4.3189 },
  { slug: 'woluwe-saint-lambert', name: 'Woluwe-Saint-Lambert', province: 'Bruxelles-Capitale', zip: '1200', lat: 50.85, lng: 4.43 },
  // Brabant wallon
  { slug: 'wavre', name: 'Wavre', province: 'Brabant wallon', zip: '1300', lat: 50.7167, lng: 4.6 },
  { slug: 'rixensart', name: 'Rixensart', province: 'Brabant wallon', zip: '1330', lat: 50.712, lng: 4.5296 },
  { slug: 'ottignies-louvain-la-neuve', name: 'Louvain-la-Neuve', alt: 'Ottignies', province: 'Brabant wallon', zip: '1348', lat: 50.6681, lng: 4.6119 },
  { slug: 'jodoigne', name: 'Jodoigne', province: 'Brabant wallon', zip: '1370', lat: 50.7236, lng: 4.8697 },
  { slug: 'nivelles', name: 'Nivelles', province: 'Brabant wallon', zip: '1400', lat: 50.5983, lng: 4.3285 },
  { slug: 'waterloo', name: 'Waterloo', province: 'Brabant wallon', zip: '1410', lat: 50.715, lng: 4.399 },
  { slug: 'braine-l-alleud', name: "Braine-l'Alleud", province: 'Brabant wallon', zip: '1420', lat: 50.6833, lng: 4.3667 },
  // Namur
  { slug: 'namur', name: 'Namur', province: 'Namur', zip: '5000', lat: 50.4674, lng: 4.8718 },
  { slug: 'gembloux', name: 'Gembloux', province: 'Namur', zip: '5030', lat: 50.5617, lng: 4.6911 },
  { slug: 'dinant', name: 'Dinant', province: 'Namur', zip: '5500', lat: 50.2606, lng: 4.9122 },
  { slug: 'ciney', name: 'Ciney', province: 'Namur', zip: '5590', lat: 50.2947, lng: 5.0997 },
  { slug: 'philippeville', name: 'Philippeville', province: 'Namur', zip: '5600', lat: 50.1961, lng: 4.5436 },
  { slug: 'rochefort', name: 'Rochefort', province: 'Namur', zip: '5580', lat: 50.1625, lng: 5.2219 },
  // Liège
  { slug: 'liege', name: 'Liège', alt: 'Luik', province: 'Liège', zip: '4000', lat: 50.6326, lng: 5.5797 },
  { slug: 'huy', name: 'Huy', alt: 'Hoei', province: 'Liège', zip: '4500', lat: 50.5185, lng: 5.2394 },
  { slug: 'waremme', name: 'Waremme', alt: 'Borgworm', province: 'Liège', zip: '4300', lat: 50.6964, lng: 5.255 },
  { slug: 'hannut', name: 'Hannut', province: 'Liège', zip: '4280', lat: 50.6714, lng: 5.0786 },
  { slug: 'verviers', name: 'Verviers', province: 'Liège', zip: '4800', lat: 50.5891, lng: 5.8624 },
  { slug: 'herve', name: 'Herve', province: 'Liège', zip: '4650', lat: 50.6403, lng: 5.7939 },
  { slug: 'spa', name: 'Spa', province: 'Liège', zip: '4900', lat: 50.4925, lng: 5.8644 },
  { slug: 'malmedy', name: 'Malmedy', province: 'Liège', zip: '4960', lat: 50.4264, lng: 6.0275 },
  { slug: 'eupen', name: 'Eupen', province: 'Liège', zip: '4700', lat: 50.6283, lng: 6.0361 },
  // Hainaut
  { slug: 'charleroi', name: 'Charleroi', province: 'Hainaut', zip: '6000', lat: 50.4108, lng: 4.4446 },
  { slug: 'mons', name: 'Mons', alt: 'Bergen', province: 'Hainaut', zip: '7000', lat: 50.4542, lng: 3.9567 },
  { slug: 'la-louviere', name: 'La Louvière', province: 'Hainaut', zip: '7100', lat: 50.4797, lng: 4.1872 },
  { slug: 'tournai', name: 'Tournai', alt: 'Doornik', province: 'Hainaut', zip: '7500', lat: 50.6056, lng: 3.3878 },
  { slug: 'ath', name: 'Ath', alt: 'Aat', province: 'Hainaut', zip: '7800', lat: 50.6297, lng: 3.7792 },
  { slug: 'chimay', name: 'Chimay', province: 'Hainaut', zip: '6460', lat: 50.0483, lng: 4.3164 },
  // Luxembourg
  { slug: 'arlon', name: 'Arlon', alt: 'Aarlen', province: 'Luxembourg', zip: '6700', lat: 49.6833, lng: 5.8167 },
  { slug: 'bastogne', name: 'Bastogne', province: 'Luxembourg', zip: '6600', lat: 50.0, lng: 5.7167 },
  { slug: 'marche-en-famenne', name: 'Marche-en-Famenne', province: 'Luxembourg', zip: '6900', lat: 50.2269, lng: 5.3442 },
  { slug: 'durbuy', name: 'Durbuy', province: 'Luxembourg', zip: '6940', lat: 50.3528, lng: 5.4561 },
  { slug: 'bouillon', name: 'Bouillon', province: 'Luxembourg', zip: '6830', lat: 49.7937, lng: 5.0671 },
  // Flandre
  { slug: 'gand', name: 'Gand', alt: 'Gent', province: 'Flandre-Orientale', zip: '9000', lat: 51.0543, lng: 3.7174 },
  { slug: 'alost', name: 'Alost', alt: 'Aalst', province: 'Flandre-Orientale', zip: '9300', lat: 50.9378, lng: 4.0403 },
  { slug: 'anvers', name: 'Anvers', alt: 'Antwerpen', province: 'Anvers', zip: '2000', lat: 51.2194, lng: 4.4025 },
  { slug: 'malines', name: 'Malines', alt: 'Mechelen', province: 'Anvers', zip: '2800', lat: 51.0259, lng: 4.4776 },
  { slug: 'louvain', name: 'Louvain', alt: 'Leuven', province: 'Brabant flamand', zip: '3000', lat: 50.8798, lng: 4.7005 },
  { slug: 'tirlemont', name: 'Tirlemont', alt: 'Tienen', province: 'Brabant flamand', zip: '3300', lat: 50.8075, lng: 4.9386 },
  { slug: 'hal', name: 'Hal', alt: 'Halle', province: 'Brabant flamand', zip: '1500', lat: 50.7339, lng: 4.2345 },
  { slug: 'bruges', name: 'Bruges', alt: 'Brugge', province: 'Flandre-Occidentale', zip: '8000', lat: 51.2093, lng: 3.2247 },
  { slug: 'ostende', name: 'Ostende', alt: 'Oostende', province: 'Flandre-Occidentale', zip: '8400', lat: 51.2154, lng: 2.9286 },
  { slug: 'courtrai', name: 'Courtrai', alt: 'Kortrijk', province: 'Flandre-Occidentale', zip: '8500', lat: 50.8279, lng: 3.2649 },
  { slug: 'ypres', name: 'Ypres', alt: 'Ieper', province: 'Flandre-Occidentale', zip: '8900', lat: 50.8503, lng: 2.885 },
  { slug: 'hasselt', name: 'Hasselt', province: 'Limbourg', zip: '3500', lat: 50.9307, lng: 5.3378 },
  { slug: 'saint-trond', name: 'Saint-Trond', alt: 'Sint-Truiden', province: 'Limbourg', zip: '3800', lat: 50.816, lng: 5.1866 },
  { slug: 'genk', name: 'Genk', province: 'Limbourg', zip: '3600', lat: 50.965, lng: 5.5008 },
];

export const communeBySlug = Object.fromEntries(communes.map((c) => [c.slug, c])) as Record<string, Commune>;

export const DEFAULT_COMMUNE = 'namur';
