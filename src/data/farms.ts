import type { CategoryId } from './categories';

export type Range = [string, string];
/** Index 0 = lundi … 6 = dimanche */
export type Hours = Range[][];

export interface Product {
  name: string;
  cat: CategoryId;
  months: number[];
}

export interface Farm {
  slug: string;
  name: string;
  commune: string;
  zip: string;
  address: string;
  lat: number;
  lng: number;
  cats: CategoryId[];
  labels: string[];
  rating: number;
  reviews: number;
  tagline: string;
  description: string;
  producer: { name: string; since: number; quote: string };
  hours: Hours;
  products: Product[];
}

/** '7-9' → [7,8,9] · '10-3' → [10,11,12,1,2,3] · 'all' → 1..12 */
function m(...ranges: string[]): number[] {
  const out = new Set<number>();
  for (const r of ranges) {
    if (r === 'all') for (let i = 1; i <= 12; i++) out.add(i);
    else {
      const [a, b = a] = r.split('-').map(Number);
      let i = a;
      out.add(i);
      while (i !== b) {
        i = (i % 12) + 1;
        out.add(i);
      }
    }
  }
  return [...out].sort((x, y) => x - y);
}

const closed: Range[] = [];
const H = {
  afternoons: [closed, [['14:00', '18:30']], [['14:00', '18:30']], [['14:00', '18:30']], [['14:00', '18:30']], [['09:00', '17:00']], closed] as Hours,
  self: Array.from({ length: 7 }, () => [['07:00', '21:00']]) as Hours,
  shop: [
    [['09:00', '12:30'], ['13:30', '18:30']],
    [['09:00', '12:30'], ['13:30', '18:30']],
    [['09:00', '12:30'], ['13:30', '18:30']],
    [['09:00', '12:30'], ['13:30', '18:30']],
    [['09:00', '12:30'], ['13:30', '18:30']],
    [['09:00', '17:00']],
    closed,
  ] as Hours,
  weekend: [closed, closed, closed, closed, [['15:00', '19:00']], [['09:00', '18:00']], [['09:00', '12:30']]] as Hours,
  bakery: [closed, closed, [['07:30', '13:00']], [['07:30', '13:00']], [['07:30', '18:00']], [['07:30', '17:00']], [['08:00', '12:30']]] as Hours,
  market: [closed, [['16:00', '19:00']], closed, [['16:00', '19:00']], [['16:00', '19:00']], [['10:00', '16:00']], closed] as Hours,
  daily: [
    [['10:00', '18:00']],
    [['10:00', '18:00']],
    [['10:00', '18:00']],
    [['10:00', '18:00']],
    [['10:00', '18:00']],
    [['10:00', '18:00']],
    [['10:00', '13:00']],
  ] as Hours,
};

export const farms: Farm[] = [
  {
    slug: 'ferme-du-soleil',
    name: 'Ferme du Soleil',
    commune: 'Gembloux',
    zip: '5030',
    address: 'Chemin des Prés 14',
    lat: 50.5795,
    lng: 4.7232,
    cats: ['legumes', 'fruits', 'oeufs'],
    labels: ['Bio', 'Libre-service', 'Paniers'],
    rating: 4.9,
    reviews: 124,
    tagline: 'Maraîchage bio sur sol vivant, en plein cœur de la Hesbaye namuroise.',
    description:
      "Sur quatre hectares de terres limoneuses, Céline et Thomas cultivent plus de soixante variétés de légumes au rythme des saisons. Pas de serre chauffée, pas de pesticides : juste du compost, des haies et beaucoup de patience. Le magasin à la ferme est en libre-service tous les après-midis, et les paniers hebdomadaires se récupèrent le vendredi.",
    producer: {
      name: 'Céline & Thomas',
      since: 2011,
      quote: "On cultive ce qu'on aime manger, et on le vend à deux pas du champ. C'est aussi simple que ça.",
    },
    hours: H.afternoons,
    products: [
      { name: 'Tomates anciennes', cat: 'legumes', months: m('7-9') },
      { name: 'Courgettes', cat: 'legumes', months: m('6-9') },
      { name: 'Poireaux', cat: 'legumes', months: m('9-3') },
      { name: 'Courges & potimarrons', cat: 'legumes', months: m('9-12') },
      { name: 'Pommes de terre', cat: 'legumes', months: m('6-4') },
      { name: 'Fraises', cat: 'fruits', months: m('5-7') },
      { name: 'Œufs de plein air', cat: 'oeufs', months: m('all') },
    ],
  },
  {
    slug: 'le-panier-de-celestin',
    name: 'Le Panier de Célestin',
    commune: 'Grez-Doiceau',
    zip: '1390',
    address: 'Rue du Fournil 3',
    lat: 50.7392,
    lng: 4.6948,
    cats: ['pain'],
    labels: ['Bio', 'Farine maison'],
    rating: 4.7,
    reviews: 89,
    tagline: 'Pains au levain cuits au feu de bois, du grain à la miche.',
    description:
      "Célestin cultive ses propres céréales anciennes, les moud sur meule de pierre et les transforme en pains au levain naturel. Le four à bois chauffe dès cinq heures du matin les jours de cuisson. On vient pour une miche, on repart avec un cramique et une farine d'épeautre.",
    producer: {
      name: 'Célestin',
      since: 2016,
      quote: 'Un bon pain, c’est 48 heures de patience et une seule minute pour le dévorer.',
    },
    hours: H.bakery,
    products: [
      { name: 'Pain au levain', cat: 'pain', months: m('all') },
      { name: "Farine d'épeautre", cat: 'pain', months: m('all') },
      { name: 'Pain de seigle', cat: 'pain', months: m('all') },
      { name: 'Cramique', cat: 'pain', months: m('all') },
      { name: 'Pain aux noix', cat: 'pain', months: m('10-3') },
    ],
  },
  {
    slug: 'bergerie-des-collines',
    name: 'Bergerie des Collines',
    commune: 'Ciney',
    zip: '5590',
    address: 'Route de Leignon 88',
    lat: 50.2742,
    lng: 5.1126,
    cats: ['fromages', 'lait'],
    labels: ['Plein air', 'Visites'],
    rating: 4.8,
    reviews: 112,
    tagline: 'Fromages et yaourts au lait cru de brebis, affinés en Condroz.',
    description:
      'Deux cents brebis laitières pâturent les collines du Condroz d’avril à novembre. Marie transforme le lait cru le jour même en tommes, fromages frais et yaourts. Visite de la bergerie et de la cave d’affinage le premier samedi du mois.',
    producer: {
      name: 'Marie Lambotte',
      since: 2008,
      quote: 'Mes brebis font le gros du travail. Moi, je m’occupe juste de ne pas tout gâcher.',
    },
    hours: H.weekend,
    products: [
      { name: 'Tomme de brebis', cat: 'fromages', months: m('all') },
      { name: 'Fromage frais', cat: 'fromages', months: m('3-11') },
      { name: 'Yaourt de brebis', cat: 'lait', months: m('3-11') },
      { name: 'Lait cru', cat: 'lait', months: m('3-11') },
    ],
  },
  {
    slug: 'les-vergers-de-hesbaye',
    name: 'Les Vergers de Hesbaye',
    commune: 'Hannut',
    zip: '4280',
    address: 'Rue des Vergers 21',
    lat: 50.6928,
    lng: 5.0417,
    cats: ['fruits'],
    labels: ['Cueillette', 'Jus maison'],
    rating: 4.6,
    reviews: 67,
    tagline: 'Pommes, poires et cerises de hautes tiges, pressées sur place.',
    description:
      "Le verger familial compte plus de 1 200 arbres, dont de vieilles variétés de hautes tiges qu'on ne trouve plus ailleurs. En saison, la cueillette est ouverte le week-end. Toute l'année, jus de pomme pressé à la ferme et sirop de Hesbaye cuit au chaudron.",
    producer: {
      name: 'Famille Dubois',
      since: 1974,
      quote: 'Mon grand-père a planté ces arbres. Je les soigne pour que mes petits-enfants les récoltent.',
    },
    hours: H.shop,
    products: [
      { name: 'Pommes Jonagold', cat: 'fruits', months: m('9-4') },
      { name: 'Poires Conférence', cat: 'fruits', months: m('9-2') },
      { name: 'Cerises', cat: 'fruits', months: m('6-7') },
      { name: 'Prunes', cat: 'fruits', months: m('8-9') },
      { name: 'Jus de pomme', cat: 'fruits', months: m('all') },
      { name: 'Sirop de pommes & poires', cat: 'fruits', months: m('all') },
    ],
  },
  {
    slug: 'les-ruchers-du-bois-joli',
    name: 'Les Ruchers du Bois Joli',
    commune: 'Profondeville',
    zip: '5170',
    address: 'Sentier du Bois Joli 2',
    lat: 50.3761,
    lng: 4.8552,
    cats: ['miel'],
    labels: ['Visites', 'Ateliers'],
    rating: 4.9,
    reviews: 58,
    tagline: 'Miels de la vallée de la Meuse, récoltés à la main.',
    description:
      "Quarante ruches réparties entre forêts et prairies fleuries au-dessus de la Meuse. Chaque récolte est extraite à froid et mise en pot sans être chauffée. Des ateliers « apiculteur d'un jour » ont lieu au printemps.",
    producer: {
      name: 'Julien Masset',
      since: 2014,
      quote: 'Chaque pot raconte un été différent. Aucun ne goûte jamais tout à fait pareil.',
    },
    hours: H.weekend,
    products: [
      { name: 'Miel de printemps', cat: 'miel', months: m('5-12') },
      { name: "Miel d'été", cat: 'miel', months: m('7-12') },
      { name: 'Miel crémeux', cat: 'miel', months: m('all') },
      { name: 'Pollen frais', cat: 'miel', months: m('5-8') },
    ],
  },
  {
    slug: 'ferme-de-la-hulotte',
    name: 'Ferme de la Hulotte',
    commune: 'Jodoigne',
    zip: '1370',
    address: 'Rue de la Hulotte 7',
    lat: 50.7451,
    lng: 4.9052,
    cats: ['viandes', 'oeufs'],
    labels: ['Plein air', 'Colis viande'],
    rating: 4.7,
    reviews: 93,
    tagline: 'Bœuf, volailles et œufs élevés à l’herbe, en Brabant wallon.',
    description:
      "Les vaches pâturent toute la belle saison et les poules picorent sous les pommiers. Les colis de viande sont préparés sur commande, une fois par mois, avec un boucher du village. Les œufs sont disponibles en libre-service.",
    producer: {
      name: 'Arnaud & Sarah',
      since: 2012,
      quote: 'On connaît chacune de nos bêtes. C’est le minimum quand on les élève pour les manger.',
    },
    hours: H.afternoons,
    products: [
      { name: 'Colis de bœuf', cat: 'viandes', months: m('all') },
      { name: 'Poulet fermier', cat: 'viandes', months: m('all') },
      { name: 'Saucisses maison', cat: 'viandes', months: m('all') },
      { name: 'Œufs de poules en liberté', cat: 'oeufs', months: m('all') },
    ],
  },
  {
    slug: 'la-laiterie-des-pres',
    name: 'La Laiterie des Prés',
    commune: 'Herve',
    zip: '4650',
    address: 'Thier des Prés 45',
    lat: 50.6482,
    lng: 5.8201,
    cats: ['fromages', 'lait'],
    labels: ['Visites', 'Libre-service'],
    rating: 4.8,
    reviews: 141,
    tagline: 'Le vrai Herve, affiné à la ferme, au cœur du Pays de Herve.',
    description:
      "Au milieu des prairies bocagères, la famille Hennen fabrique son fromage de Herve depuis trois générations. Doux ou piquant, il est lavé et retourné à la main pendant plusieurs semaines. Beurre, crème et glaces au lait entier complètent la vitrine.",
    producer: {
      name: 'Famille Hennen',
      since: 1962,
      quote: 'Le Herve, ça se mérite. Et ça se partage, parce qu’on le sent arriver de loin !',
    },
    hours: H.shop,
    products: [
      { name: 'Herve doux', cat: 'fromages', months: m('all') },
      { name: 'Herve piquant', cat: 'fromages', months: m('all') },
      { name: 'Beurre de ferme', cat: 'lait', months: m('all') },
      { name: 'Lait entier', cat: 'lait', months: m('all') },
      { name: 'Glace artisanale', cat: 'lait', months: m('4-9') },
    ],
  },
  {
    slug: 'le-potager-du-chant-d-oiseau',
    name: "Le Potager du Chant d'Oiseau",
    commune: 'Uccle',
    zip: '1180',
    address: 'Avenue des Mésanges 120',
    lat: 50.7898,
    lng: 4.3552,
    cats: ['legumes'],
    labels: ['Bio', 'Paniers', 'Ateliers'],
    rating: 4.8,
    reviews: 76,
    tagline: 'Un potager urbain en traction douce, à vingt minutes du centre de Bruxelles.',
    description:
      "Un hectare de maraîchage sur petite surface, travaillé à la main et à la grelinette. Les paniers sont récoltés le matin même, et des ateliers jardinage accueillent les familles le mercredi après-midi.",
    producer: {
      name: 'Collectif Chant d’Oiseau',
      since: 2019,
      quote: 'Ici, les enfants découvrent qu’une carotte ne pousse pas en barquette.',
    },
    hours: H.market,
    products: [
      { name: 'Salades & jeunes pousses', cat: 'legumes', months: m('4-10') },
      { name: 'Radis', cat: 'legumes', months: m('4-9') },
      { name: 'Herbes aromatiques', cat: 'legumes', months: m('4-10') },
      { name: 'Épinards', cat: 'legumes', months: m('4-6', '9-11') },
      { name: 'Tomates cerises', cat: 'legumes', months: m('7-9') },
    ],
  },
  {
    slug: 'ferme-des-quatre-saisons',
    name: 'Ferme des Quatre Saisons',
    commune: 'Ath',
    zip: '7800',
    address: 'Chemin de la Dendre 9',
    lat: 50.6452,
    lng: 3.8104,
    cats: ['legumes', 'fruits'],
    labels: ['Paniers', 'Libre-service'],
    rating: 4.6,
    reviews: 54,
    tagline: 'Chicons de pleine terre et légumes oubliés du Hainaut.',
    description:
      "Ici, on fait encore le chicon à l'ancienne : forcé en pleine terre, sous paille, comme le faisaient les grands-parents. Le reste de l'année, la ferme propose carottes, choux de Bruxelles, fraises et pommes en libre-service.",
    producer: {
      name: 'Benoît Lecomte',
      since: 2003,
      quote: 'Un chicon de pleine terre, une fois qu’on y a goûté, on ne revient pas en arrière.',
    },
    hours: H.self,
    products: [
      { name: 'Chicons de pleine terre', cat: 'legumes', months: m('10-4') },
      { name: 'Choux de Bruxelles', cat: 'legumes', months: m('10-2') },
      { name: 'Carottes', cat: 'legumes', months: m('6-3') },
      { name: 'Fraises', cat: 'fruits', months: m('5-7') },
      { name: 'Pommes', cat: 'fruits', months: m('9-3') },
    ],
  },
  {
    slug: 'le-fournil-de-la-vallee',
    name: 'Le Fournil de la Vallée',
    commune: 'Dinant',
    zip: '5500',
    address: "Rue d'Anseremme 31",
    lat: 50.2412,
    lng: 4.9055,
    cats: ['pain'],
    labels: ['Farine maison'],
    rating: 4.7,
    reviews: 102,
    tagline: 'Couques de Dinant moulées à la main et pains de campagne.',
    description:
      "Au bord de la Lesse, le fournil perpétue la tradition de la couque de Dinant, moulée dans des formes en bois sculpté. On y trouve aussi des pains de campagne au levain et des galettes au beurre de la ferme voisine.",
    producer: {
      name: 'Hélène Gillet',
      since: 2010,
      quote: 'La couque, il faut la laisser fondre doucement. Surtout, ne croquez pas dedans !',
    },
    hours: H.bakery,
    products: [
      { name: 'Couques de Dinant', cat: 'pain', months: m('all') },
      { name: 'Pain de campagne', cat: 'pain', months: m('all') },
      { name: 'Pain aux noix', cat: 'pain', months: m('10-3') },
      { name: 'Galettes au beurre', cat: 'pain', months: m('all') },
    ],
  },
  {
    slug: 'chevrerie-du-ry',
    name: 'Chèvrerie du Ry',
    commune: 'Rochefort',
    zip: '5580',
    address: 'Le Ry 4',
    lat: 50.1731,
    lng: 5.2511,
    cats: ['fromages', 'lait'],
    labels: ['Bio', 'Visites'],
    rating: 4.9,
    reviews: 87,
    tagline: 'Fromages de chèvre fermiers en Famenne, au lait bio.',
    description:
      "Soixante chèvres alpines en pâturage tournant sur les pelouses calcaires de Famenne. Bûches, crottins cendrés et fromages frais aux herbes sont moulés à la louche. Les chevreaux naissent en mars : c'est le meilleur moment pour une visite.",
    producer: {
      name: 'Lucie Hardy',
      since: 2015,
      quote: 'Les chèvres ont plus de caractère que moi. Ça se retrouve dans les fromages.',
    },
    hours: H.weekend,
    products: [
      { name: 'Bûche de chèvre', cat: 'fromages', months: m('3-12') },
      { name: 'Crottin cendré', cat: 'fromages', months: m('3-12') },
      { name: 'Fromage frais aux herbes', cat: 'fromages', months: m('3-10') },
      { name: 'Lait de chèvre', cat: 'lait', months: m('3-11') },
    ],
  },
  {
    slug: 'ferme-du-grand-chene',
    name: 'Ferme du Grand Chêne',
    commune: 'Bastogne',
    zip: '6600',
    address: 'Route du Grand Chêne 112',
    lat: 50.0286,
    lng: 5.6934,
    cats: ['viandes', 'lait'],
    labels: ['Plein air', 'Colis viande', 'Livraison'],
    rating: 4.8,
    reviews: 119,
    tagline: "Bœuf d'Ardenne nourri à l'herbe et charcuterie fumée maison.",
    description:
      "Sur les hauts plateaux ardennais, le troupeau vit dehors une bonne partie de l'année. Jambons et saucissons sont fumés au bois de hêtre dans le fumoir de la ferme. Livraison possible en Province de Luxembourg.",
    producer: {
      name: 'Pierre & Anne Collard',
      since: 1998,
      quote: "Le temps, c'est notre ingrédient principal. On ne presse ni les bêtes, ni le fumage.",
    },
    hours: H.afternoons,
    products: [
      { name: "Bœuf d'Ardenne", cat: 'viandes', months: m('all') },
      { name: 'Jambon fumé', cat: 'viandes', months: m('all') },
      { name: 'Saucisson sec', cat: 'viandes', months: m('all') },
      { name: 'Lait cru', cat: 'lait', months: m('all') },
    ],
  },
  {
    slug: 'les-jardins-de-sophie',
    name: 'Les Jardins de Sophie',
    commune: 'Bertem',
    zip: '3060',
    address: 'Veldstraat 18',
    lat: 50.8612,
    lng: 4.6371,
    cats: ['legumes', 'fruits'],
    labels: ['Bio', 'Paniers'],
    rating: 4.7,
    reviews: 61,
    tagline: 'Asperges blanches, petits fruits et légumes bio aux portes de Louvain.',
    description:
      "Sophie cultive les fameuses asperges blanches du Brabant au printemps, puis enchaîne avec fraises, fèves, haricots et framboises. Les paniers bio se commandent en ligne et se retirent à la ferme le samedi matin.",
    producer: {
      name: 'Sophie Peeters',
      since: 2013,
      quote: 'Ma saison préférée ? Celle où l’on récolte les premières asperges, à l’aube.',
    },
    hours: H.market,
    products: [
      { name: 'Asperges blanches', cat: 'legumes', months: m('4-6') },
      { name: 'Rhubarbe', cat: 'legumes', months: m('4-6') },
      { name: 'Fèves', cat: 'legumes', months: m('6-8') },
      { name: 'Haricots verts', cat: 'legumes', months: m('7-9') },
      { name: 'Fraises', cat: 'fruits', months: m('5-7') },
      { name: 'Framboises', cat: 'fruits', months: m('6-9') },
    ],
  },
  {
    slug: 'hoeve-ter-linde',
    name: 'Hoeve Ter Linde',
    commune: 'Merelbeke',
    zip: '9820',
    address: 'Lindestraat 5',
    lat: 50.9984,
    lng: 3.7512,
    cats: ['oeufs', 'lait', 'fromages'],
    labels: ['Libre-service', 'Distributeur'],
    rating: 4.6,
    reviews: 48,
    tagline: 'Produits laitiers et œufs frais en distributeur 24 h/24, près de Gand.',
    description:
      "Cette ferme flamande a installé un distributeur automatique à l'entrée de la cour : yaourts, fromage blanc, lait frais et œufs sont disponibles jour et nuit. Les glaces maison font la joie des cyclistes l'été.",
    producer: {
      name: 'Jan & Els De Smet',
      since: 2005,
      quote: 'Même à minuit, on peut venir chercher son lait. Les vaches, elles, dorment.',
    },
    hours: Array.from({ length: 7 }, () => [['00:00', '23:59']]) as Hours,
    products: [
      { name: 'Œufs frais', cat: 'oeufs', months: m('all') },
      { name: 'Yaourts nature & fruits', cat: 'lait', months: m('all') },
      { name: 'Fromage blanc', cat: 'fromages', months: m('all') },
      { name: 'Glace au lait entier', cat: 'lait', months: m('4-9') },
    ],
  },
  {
    slug: 'le-moulin-de-la-dyle',
    name: 'Le Moulin de la Dyle',
    commune: 'Ottignies',
    zip: '1340',
    address: 'Rue du Moulin 1',
    lat: 50.6856,
    lng: 4.5851,
    cats: ['pain'],
    labels: ['Bio', 'Visites'],
    rating: 4.8,
    reviews: 73,
    tagline: 'Farines bio moulues à la meule dans un moulin à eau restauré.',
    description:
      "Le vieux moulin à eau a repris du service : il moud chaque semaine les céréales de cinq fermes bio voisines. Farines de froment, d'épeautre et de seigle, flocons d'avoine et pains complets cuits le samedi.",
    producer: {
      name: 'Coopérative du Moulin',
      since: 2017,
      quote: 'La meule tourne au rythme de la rivière. Et franchement, ça lui va très bien.',
    },
    hours: H.weekend,
    products: [
      { name: 'Farine de froment', cat: 'pain', months: m('all') },
      { name: "Farine d'épeautre", cat: 'pain', months: m('all') },
      { name: "Flocons d'avoine", cat: 'pain', months: m('all') },
      { name: 'Pain complet', cat: 'pain', months: m('all') },
    ],
  },
  {
    slug: 'ferme-du-pre-fleuri',
    name: 'Ferme du Pré Fleuri',
    commune: 'Saint-Symphorien',
    zip: '7030',
    address: 'Chaussée du Roeulx 240',
    lat: 50.4431,
    lng: 4.0046,
    cats: ['oeufs', 'viandes', 'legumes'],
    labels: ['Plein air', 'Libre-service'],
    rating: 4.5,
    reviews: 39,
    tagline: 'Œufs, volailles et légumes de plein champ, aux portes de Mons.',
    description:
      'Une ferme polyvalente comme on en voit de moins en moins : poules pondeuses, poulets de chair, cochons et un grand potager. Le magasin propose aussi des produits de fermes amies de la région.',
    producer: {
      name: 'Manon Delhaye',
      since: 2018,
      quote: 'Je voulais une ferme où tout se tient : les poules mangent les restes du potager, et ainsi de suite.',
    },
    hours: H.daily,
    products: [
      { name: 'Œufs de plein air', cat: 'oeufs', months: m('all') },
      { name: 'Poulet fermier', cat: 'viandes', months: m('all') },
      { name: 'Porc fermier', cat: 'viandes', months: m('all') },
      { name: 'Pommes de terre', cat: 'legumes', months: m('6-4') },
      { name: 'Potirons', cat: 'legumes', months: m('9-12') },
    ],
  },
  {
    slug: 'miellerie-des-fagnes',
    name: 'Miellerie des Fagnes',
    commune: 'Jalhay',
    zip: '4845',
    address: 'Route des Fagnes 66',
    lat: 50.5604,
    lng: 5.9708,
    cats: ['miel'],
    labels: ['Ateliers'],
    rating: 4.9,
    reviews: 64,
    tagline: 'Miel de bruyère des Hautes Fagnes et pain d’épices maison.',
    description:
      "À la lisière des Hautes Fagnes, les abeilles butinent bruyères et myrtilliers sauvages. Le miel de bruyère, rare et ambré, se récolte fin août. La miellerie propose aussi pain d'épices, hydromel et bougies en cire d'abeille.",
    producer: {
      name: 'Thierry Brasseur',
      since: 2009,
      quote: 'Le miel de bruyère a un goût de fin d’été. Il faut l’attendre toute l’année.',
    },
    hours: H.weekend,
    products: [
      { name: 'Miel de bruyère', cat: 'miel', months: m('9-12') },
      { name: 'Miel de forêt', cat: 'miel', months: m('all') },
      { name: "Pain d'épices", cat: 'pain', months: m('all') },
      { name: 'Hydromel', cat: 'miel', months: m('all') },
    ],
  },
  {
    slug: 'cueillette-du-moulinet',
    name: 'Cueillette du Moulinet',
    commune: 'Ophain',
    zip: '1421',
    address: 'Chemin du Moulinet 10',
    lat: 50.6589,
    lng: 4.3921,
    cats: ['fruits', 'legumes'],
    labels: ['Cueillette', 'Libre-service'],
    rating: 4.7,
    reviews: 158,
    tagline: 'Cueillez vous-même fraises, framboises et courges, en famille.',
    description:
      "Paniers en osier fournis à l'entrée, et c'est parti pour les rangs de fraises ! De mai à octobre, la cueillette s'enchaîne : fraises, framboises, haricots puis courges d'automne. Les enfants adorent, les parents aussi.",
    producer: {
      name: 'Famille Vandamme',
      since: 2001,
      quote: 'La meilleure fraise, c’est celle qu’on mange directement dans le rang. Chut, on ne vous a rien dit.',
    },
    hours: H.daily,
    products: [
      { name: 'Fraises à cueillir', cat: 'fruits', months: m('5-8') },
      { name: 'Framboises', cat: 'fruits', months: m('6-9') },
      { name: 'Haricots', cat: 'legumes', months: m('7-9') },
      { name: "Courges d'automne", cat: 'legumes', months: m('9-11') },
    ],
  },
  {
    slug: 'la-ferme-aux-tilleuls',
    name: 'La Ferme aux Tilleuls',
    commune: 'Bouge',
    zip: '5004',
    address: 'Rue des Tilleuls 27',
    lat: 50.4862,
    lng: 4.9118,
    cats: ['legumes', 'oeufs', 'lait'],
    labels: ['Libre-service', 'Paniers'],
    rating: 4.7,
    reviews: 88,
    tagline: 'Le magasin fermier des Namurois, à dix minutes de la citadelle.',
    description:
      "Une grande cour carrée, deux tilleuls centenaires et un magasin à la ferme où l'on trouve les légumes du jour, les œufs des poules de la cour et le lait de la ferme voisine. Le distributeur de lait cru fonctionne tous les jours.",
    producer: {
      name: 'Grégory Martin',
      since: 2007,
      quote: 'Les gens passent pour du lait et restent pour papoter. C’est aussi ça, une ferme.',
    },
    hours: H.daily,
    products: [
      { name: 'Légumes du jour', cat: 'legumes', months: m('all') },
      { name: 'Choux de Bruxelles', cat: 'legumes', months: m('10-2') },
      { name: 'Œufs de la cour', cat: 'oeufs', months: m('all') },
      { name: 'Lait cru', cat: 'lait', months: m('all') },
      { name: 'Beurre de baratte', cat: 'lait', months: m('all') },
    ],
  },
  {
    slug: 'le-clos-des-muriers',
    name: 'Le Clos des Mûriers',
    commune: 'Bierges',
    zip: '1301',
    address: 'Rue du Clos 6',
    lat: 50.7046,
    lng: 4.5818,
    cats: ['fruits', 'miel'],
    labels: ['Bio', 'Cueillette'],
    rating: 4.8,
    reviews: 52,
    tagline: 'Petits fruits bio, confitures et miel du verger.',
    description:
      "Groseilles, cassis, mûres et framboises poussent entre les ruches de ce petit clos bio. Tout ce qui n'est pas vendu frais finit en confitures cuites au chaudron de cuivre.",
    producer: {
      name: 'Inès Lambert',
      since: 2020,
      quote: 'Les abeilles pollinisent, les fruits poussent, et moi je goûte. Une belle répartition des tâches.',
    },
    hours: H.weekend,
    products: [
      { name: 'Groseilles', cat: 'fruits', months: m('6-8') },
      { name: 'Cassis', cat: 'fruits', months: m('7') },
      { name: 'Mûres', cat: 'fruits', months: m('8-9') },
      { name: 'Confitures maison', cat: 'fruits', months: m('all') },
      { name: 'Miel du verger', cat: 'miel', months: m('6-12') },
    ],
  },
  {
    slug: 'les-petits-champs',
    name: 'Les Petits Champs',
    commune: 'Anderlecht',
    zip: '1070',
    address: 'Chemin des Petits Champs 3',
    lat: 50.8241,
    lng: 4.2702,
    cats: ['legumes', 'oeufs'],
    labels: ['Bio', 'Paniers'],
    rating: 4.6,
    reviews: 71,
    tagline: 'Maraîchage bio et poules heureuses, en pleine région bruxelloise.',
    description:
      "À l'ouest de Bruxelles, entre champs et vallons, cette jeune ferme maraîchère prouve qu'on peut cultiver en ville. Les paniers sont livrés à vélo cargo dans plusieurs communes bruxelloises.",
    producer: {
      name: 'Yasmine & Hugo',
      since: 2021,
      quote: 'On a quitté nos bureaux pour un champ. On ne regrette pas une seconde.',
    },
    hours: H.market,
    products: [
      { name: 'Légumes de saison', cat: 'legumes', months: m('all') },
      { name: 'Choux kale', cat: 'legumes', months: m('11-3') },
      { name: 'Courgettes', cat: 'legumes', months: m('6-9') },
      { name: 'Œufs bio', cat: 'oeufs', months: m('all') },
    ],
  },
  {
    slug: 'ferme-de-l-escaut',
    name: "Ferme de l'Escaut",
    commune: 'Tournai',
    zip: '7500',
    address: "Quai de l'Escaut 410",
    lat: 50.6233,
    lng: 3.4211,
    cats: ['legumes', 'viandes'],
    labels: ['Colis viande', 'Livraison'],
    rating: 4.5,
    reviews: 37,
    tagline: 'Légumes de plein champ et agneau du Tournaisis.',
    description:
      "Le long de l'Escaut, la ferme cultive pommes de terre, poireaux et céleris, et élève un petit troupeau de moutons. Les colis d'agneau sont disponibles au printemps et à l'automne.",
    producer: {
      name: 'Olivier Duquesne',
      since: 1995,
      quote: "Ici, la terre est lourde mais généreuse. Comme les gens du coin, d'ailleurs.",
    },
    hours: H.shop,
    products: [
      { name: 'Pommes de terre', cat: 'legumes', months: m('6-4') },
      { name: 'Poireaux', cat: 'legumes', months: m('9-3') },
      { name: 'Céleri-rave', cat: 'legumes', months: m('9-3') },
      { name: "Colis d'agneau", cat: 'viandes', months: m('3-5', '9-11') },
    ],
  },
  {
    slug: 'le-champ-des-alouettes',
    name: 'Le Champ des Alouettes',
    commune: 'Waremme',
    zip: '4300',
    address: 'Rue des Alouettes 15',
    lat: 50.7052,
    lng: 5.2238,
    cats: ['legumes', 'pain'],
    labels: ['Bio', 'Farine maison'],
    rating: 4.6,
    reviews: 41,
    tagline: 'Céréales anciennes, lentilles et légumes secs de Hesbaye.',
    description:
      "Dans les grandes plaines de Hesbaye, cette ferme bio a remis au goût du jour les lentilles, pois chiches et céréales anciennes. Farines et légumineuses sont vendues en vrac au magasin.",
    producer: {
      name: 'Nicolas Renard',
      since: 2014,
      quote: 'Les alouettes sont revenues dans nos champs. Pour moi, c’est le meilleur des labels.',
    },
    hours: H.afternoons,
    products: [
      { name: 'Lentilles vertes', cat: 'legumes', months: m('all') },
      { name: 'Pois chiches', cat: 'legumes', months: m('all') },
      { name: 'Farine de seigle', cat: 'pain', months: m('all') },
      { name: 'Oignons', cat: 'legumes', months: m('7-3') },
    ],
  },
];

export const farmBySlug = Object.fromEntries(farms.map((f) => [f.slug, f])) as Record<string, Farm>;
