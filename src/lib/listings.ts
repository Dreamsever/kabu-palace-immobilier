export type Listing = {
  id: number | string; // number pour les données statiques, uuid string pour Supabase
  title: string;
  quartier: string;
  commune?: string;
  address?: string;
  type: string;
  mode: "Acheter" | "Louer";
  price: number;
  beds: number;
  baths: number;
  area: number;
  landArea?: number;
  img: string;
  gallery: string[];
  availability: string;
  history: string;
  yearBuilt?: number;
  legalStatus: string;
  features: string[];
  description: string;
  locationHighlights: string[];
  featured?: boolean;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;

export const LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Villa contemporaine avec piscine & grand jardin",
    quartier: "Gombe",
    commune: "Gombe",
    address: "Avenue de la Justice, Quartier Diplomatique, Gombe",
    type: "Villa",
    mode: "Acheter",
    price: 850000,
    beds: 5,
    baths: 4,
    area: 620,
    landArea: 1000,
    yearBuilt: 2022,
    img: u("photo-1613490493576-7fde63acd811"),
    gallery: [
      u("photo-1613490493576-7fde63acd811"),
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1600596542815-ffad4c1539a9"),
      u("photo-1600607687939-ce8a6c25118c"),
      u("photo-1512917774080-9991f1c4c750"),
    ],
    availability: "Immédiate — Libre de tout occupant",
    history:
      "Érigée en 2022 selon les standards internationaux par un cabinet d'architecture reconnu, la villa a été entretenue de manière irréprochable par son premier propriétaire. Dossier technique complet avec plans certifiés et garantie décennale.",
    legalStatus:
      "Certificat d'enregistrement définitif (Cadastre foncier de la Gombe, sans hypothèque ni litige)",
    locationHighlights: [
      "À 3 minutes du Boulevard du 30 Juin",
      "Proximité immédiate des ambassades et écoles internationales",
      "Zone hautement sécurisée avec patrouilles régulières",
      "Accès goudronné et éclairage public permanent",
    ],
    features: [
      "Piscine privée 12m x 5m avec solarium",
      "Groupe électrogène insonorisé 60 kVA avec inverseur automatique",
      "Forage d'eau 90m avec station de filtration UV et réservoir 5 000L",
      "Climatisation centrale inverter dans chaque pièce",
      "Guérite de sécurité avec vidéosurveillance CCTV 8 caméras",
      "Garage couvert 4 véhicules + parking invités",
      "Dépendance pour le personnel (2 pièces avec sanitaires)",
    ],
    description:
      "Cette somptueuse villa d'architecte incarne le luxe moderne au cœur du quartier le plus convoité de Kinshasa. Elle offre de vastes espaces de vie baignés de lumière naturelle, de hauts plafonds, une cuisine contemporaine avec îlot en marbre, ainsi qu'une suite parentale d'exception avec dressing sur mesure et terrasse privative surplombant le jardin paysager.",
    featured: true,
  },
  {
    id: 2,
    title: "Penthouse de prestige vue panoramique sur le fleuve",
    quartier: "Gombe",
    commune: "Gombe",
    address: "Boulevard Tshatshi, Front de fleuve, Gombe",
    type: "Appartement",
    mode: "Louer",
    price: 4500,
    beds: 3,
    baths: 3,
    area: 240,
    yearBuilt: 2023,
    img: u("photo-1600607687939-ce8a6c25118c"),
    gallery: [
      u("photo-1600607687939-ce8a6c25118c"),
      u("photo-1512917774080-9991f1c4c750"),
      u("photo-1502672260266-1c1ef2d93688"),
    ],
    availability: "Disponible au 1er du mois prochain",
    history:
      "Appartement situé au dernier étage d'une tour résidentielle récente livrée en 2023. Prestations haut de gamme gérées par un syndic professionnel international.",
    legalStatus: "Titre de copropriété certifié en règle",
    locationHighlights: [
      "Vue imprenable et imprenable sur le fleuve Congo et Brazzaville",
      "Accès direct aux restaurants gastronomiques et hôtels de prestige",
      "Contrôle d'accès biométrique 24h/24",
    ],
    features: [
      "Terrasse panoramique de 45 m²",
      "Ascenseur privatif sécurisé par badge",
      "Salle de sport et piscine commune au rooftop",
      "Groupe de secours et eau sous pression permanente",
    ],
    description:
      "Penthouse unique offrant une vue féerique sur le majestueux fleuve Congo. Espace de réception spectaculaire avec baies vitrées toute hauteur, parquet massif et finitions européennes.",
  },
  {
    id: 3,
    title: "Résidence familiale sécurisée avec parc paysager",
    quartier: "Ngaliema",
    commune: "Ngaliema",
    address: "Avenue Colonel Mondjiba, Macampagne, Ngaliema",
    type: "Villa",
    mode: "Acheter",
    price: 520000,
    beds: 6,
    baths: 5,
    area: 780,
    landArea: 1400,
    yearBuilt: 2019,
    img: u("photo-1600596542815-ffad4c1539a9"),
    gallery: [
      u("photo-1600596542815-ffad4c1539a9"),
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1580587771525-78b9dba3b914"),
      u("photo-1564013799919-ab600027ffc6"),
    ],
    availability: "Immédiate — Visites sur rendez-vous 48h à l'avance",
    history:
      "Propriété construite en 2019 dans le respect des règles d'urbanisme kinois. Un seul propriétaire depuis l'origine. Travaux d'étanchéité et de rafraîchissement complets réalisés en 2024.",
    legalStatus: "Certificat d'enregistrement individuel notarié (Division foncière de Ngaliema)",
    locationHighlights: [
      "Quartier résidentiel calme et verdoyant de Macampagne",
      "Proche de l'Hôpital du Cinquantenaire et des galeries marchandes",
      "Environnement d'expatriés et hauts cadres d'entreprises",
    ],
    features: [
      "Grand jardin arboré de plus de 800 m²",
      "Forage industriel 110m avec système d'osmose inverse",
      "Générateur Caterpillar 45 kVA",
      "Annexe indépendante de 3 chambres pour hôtes ou personnel",
      "Stationnement clôturé pour 6 voitures",
    ],
    description:
      "Idéale pour les grandes familles ou les délégations, cette vaste propriété allie confort, générosité des volumes et sécurité maximale. Ses terrasses ombragées ouvrent sur un magnifique jardin tropical sans vis-à-vis.",
    featured: true,
  },
  {
    id: 4,
    title: "Appartement meublé standing contemporain",
    quartier: "Limete",
    commune: "Limete",
    address: "7ème Rue Résidentielle, Limete",
    type: "Appartement",
    mode: "Louer",
    price: 2200,
    beds: 2,
    baths: 2,
    area: 130,
    yearBuilt: 2021,
    img: u("photo-1600210492486-724fe5c67fb0"),
    gallery: [u("photo-1600210492486-724fe5c67fb0"), u("photo-1522708323590-d24dbb6b0267")],
    availability: "Immédiate",
    history: "Rénovation intégrale avec mobilier italien haut de gamme fin 2023.",
    legalStatus: "Bail notarié disponible sous 24h",
    locationHighlights: [
      "Côté résidentiel calme de Limete",
      "Accès rapide à l'Aéroport International de N'djili et au centre-ville",
    ],
    features: ["Mobilier complet inclus", "Fibre optique installée", "Sécurité gardiennée 24/7"],
    description:
      "Appartement clé en main conçu pour les professionnels exigeants. Cuisine moderne équipée et finitions raffinées.",
  },
  {
    id: 5,
    title: "Plateau de bureaux premium aménagé",
    quartier: "Gombe",
    commune: "Gombe",
    address: "Boulevard du 30 Juin, Gombe",
    type: "Bureau",
    mode: "Louer",
    price: 6800,
    beds: 0,
    baths: 2,
    area: 400,
    yearBuilt: 2020,
    img: u("photo-1497366216548-37526070297c"),
    gallery: [u("photo-1497366216548-37526070297c"), u("photo-1497215728101-856f4ea42174")],
    availability: "Disponible sous 15 jours",
    history: "Ancien siège d'un groupe minier international.",
    legalStatus: "Contrat de bail commercial standard OHADA",
    locationHighlights: [
      "Emplacement prestigieux sur le Boulevard du 30 Juin",
      "Proche des banques centrales, ministères et grands hôtels",
    ],
    features: [
      "Câblage réseau Cat 7 et salle serveur climatisée",
      "Double alimentation électrique secourue",
      "Contrôle d'accès par cartes magnétiques",
    ],
    description:
      "Espace de travail moderne et modulable prêt à accueillir un siège d'entreprise ou une organisation internationale.",
  },
  {
    id: 6,
    title: "Terrain constructible viabilisé 1 200 m²",
    quartier: "Mont-Ngafula",
    commune: "Mont-Ngafula",
    address: "Avenue By-Pass, Quartier Télécom, Mont-Ngafula",
    type: "Terrain",
    mode: "Acheter",
    price: 180000,
    beds: 0,
    baths: 0,
    area: 1200,
    landArea: 1200,
    img: u("photo-1500382017468-9049fed747ef"),
    gallery: [u("photo-1500382017468-9049fed747ef"), u("photo-1500382017468-9049fed747ef")],
    availability: "Immédiate — Prêt pour démarrage chantier",
    history:
      "Terrain vierge acquis directement auprès de la circonscription foncière sans antécédent contentieux. Bornage contradictoire et PV de délimitation officialisés en 2023.",
    legalStatus: "Certificat d'enregistrement définitif (Guichet unique du Cadastre)",
    locationHighlights: [
      "Quartier résidentiel en pleine expansion",
      "Topographie plate avec sol ferme idéal pour fondations économiques",
      "Raccordement SNEL et REGIDESO disponible à la parcelle",
    ],
    features: [
      "Terrain entièrement clôturé de murs en béton de 2,80m",
      "Portail métallique coulissant déjà posé",
      "Voie d'accès carrossable toute saison",
    ],
    description:
      "Opportunité rare d'acquérir une parcelle de plus de 1 200 m² dans un cadre paisible et aéré de Mont-Ngafula, idéale pour la construction d'une résidence privée ou d'un complexe d'appartements locatifs.",
  },
  {
    id: 7,
    title: "Villa de maître coloniale modernisée avec jardin arboré",
    quartier: "Limete",
    commune: "Limete",
    address: "10ème Rue Résidentielle, Limete",
    type: "Villa",
    mode: "Acheter",
    price: 390000,
    beds: 4,
    baths: 3,
    area: 500,
    landArea: 950,
    yearBuilt: 2018,
    img: u("photo-1580587771525-78b9dba3b914"),
    gallery: [
      u("photo-1580587771525-78b9dba3b914"),
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1600596542815-ffad4c1539a9"),
    ],
    availability: "Immédiate — Clés disponibles en agence",
    history:
      "Maison de caractère rénovée de fond en comble en 2018 : toiture neuve, plomberie multicouche, électricité aux normes CE et menuiseries aluminium à double vitrage.",
    legalStatus: "Certificat d'enregistrement régulier, mutation immédiate",
    locationHighlights: [
      "Le secteur le plus prisé de Limete Résidentiel",
      "Voies asphaltées et très faible circulation",
      "Voisinage calme de notables et diplomates",
    ],
    features: [
      "Piscine rénovée avec filtration automatique",
      "Forage avec réserve d'eau 4 000L",
      "Groupe électrogène Perkins 30 kVA",
      "Grande terrasse couverte donnant sur le jardin",
    ],
    description:
      "Alliance parfaite du charme intemporel et du confort contemporain. De grands volumes, une lumière traversante et un jardin mature offrant une fraîcheur naturelle incomparable.",
  },
  {
    id: 8,
    title: "Duplex contemporain de grand standing avec rooftop",
    quartier: "Gombe",
    commune: "Gombe",
    address: "Avenue Batetela, Proximité Fleuve Congo Hôtel, Gombe",
    type: "Appartement",
    mode: "Acheter",
    price: 430000,
    beds: 3,
    baths: 3,
    area: 260,
    yearBuilt: 2023,
    img: u("photo-1512917774080-9991f1c4c750"),
    gallery: [
      u("photo-1512917774080-9991f1c4c750"),
      u("photo-1600607687939-ce8a6c25118c"),
      u("photo-1600210492486-724fe5c67fb0"),
    ],
    availability: "Immédiate",
    history:
      "Livré neuf en décembre 2023 dans un immeuble de seulement 6 logements. Matériaux et équipements importés d'Italie et d'Espagne.",
    legalStatus: "Titre de propriété individuel en copropriété notariée",
    locationHighlights: [
      "À deux pas de l'Hôtel Fleuve Congo et du Palais de la Nation",
      "Quartier hyper-sécurisé avec patrouilles continues",
      "Proche des meilleures tables de la capitale",
    ],
    features: [
      "Terrasse rooftop privée avec vue dégagée",
      "Cuisine italienne sur mesure avec électroménager Bosch",
      "2 places de parking en sous-sol sécurisé",
      "Service de conciergerie et gardiennage 24h/24",
    ],
    description:
      "Ce duplex d'exception séduit par sa hauteur sous plafond cathédrale, son escalier aérien en verre et acier et ses espaces de réception conçus pour recevoir dans une élégance absolue.",
  },
  {
    id: 9,
    title: "Propriété d'exception Macampagne avec parc & vue",
    quartier: "Ngaliema",
    commune: "Ngaliema",
    address: "Avenue de la Montagne, Macampagne Haute, Ngaliema",
    type: "Villa",
    mode: "Acheter",
    price: 1100000,
    beds: 6,
    baths: 6,
    area: 920,
    landArea: 2200,
    yearBuilt: 2021,
    img: u("photo-1600585154340-be6161a56a0c"),
    gallery: [
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1613490493576-7fde63acd811"),
      u("photo-1600596542815-ffad4c1539a9"),
      u("photo-1512917774080-9991f1c4c750"),
    ],
    availability: "Immédiate — Dossier confidentiel disponible sur demande",
    history:
      "Conçue sur mesure pour une famille de diplomates, cette propriété remarquable a fait l'objet de contrôles de structure rigoureux. Matériaux nobles : marbre travertin, bois exotique wengé et ferronnerie d'art.",
    legalStatus: "Certificat d'enregistrement perpétuel au Ministère des Affaires Foncières",
    locationHighlights: [
      "Point culminant de Macampagne avec brise constante et air pur",
      "Vue imprenable sur les collines et la baie de Ngaliema",
      "Zone ultra-résidentielle réservée aux grandes propriétés",
    ],
    features: [
      "Piscine miroir chauffée avec cascade décorative",
      "Installation solaire photovoltaïque 15 kWc avec batteries lithium",
      "Générateur de secours 80 kVA",
      "Maison de gardien indépendante et bureau extérieur",
      "Cave à vin climatisée et salle de projection privée",
    ],
    description:
      "Une véritable œuvre architecturale offrant une qualité de vie sans équivalent à Kinshasa. Tout y a été pensé pour le confort absolu, l'intimité et la pérennité de l'investissement.",
    featured: true,
  },
  {
    id: 10,
    title: "Vaste concession résidentielle avec vue panoramique",
    quartier: "Mont-Ngafula",
    commune: "Mont-Ngafula",
    address: "Route de Matadi, Proximité UPN / Kimwenza, Mont-Ngafula",
    type: "Terrain",
    mode: "Acheter",
    price: 950000,
    beds: 0,
    baths: 0,
    area: 2500,
    landArea: 2500,
    img: u("photo-1500382017468-9049fed747ef"),
    gallery: [u("photo-1500382017468-9049fed747ef"), u("photo-1500382017468-9049fed747ef")],
    availability: "Immédiate",
    history:
      "Propriété foncière historique détenue par la même famille depuis 1995. Titres régularisés au cadastre moderne.",
    legalStatus: "Certificat d'enregistrement définitif (2 parcelles jumelées)",
    locationHighlights: [
      "Accès direct par route principale asphaltée",
      "Vue spectaculaire à 180° sur la plaine de Kinshasa",
      "Idéal pour grand complexe hôtelier, école ou lotissement privé",
    ],
    features: [
      "Concession murée sur l'ensemble de son périmètre",
      "Source d'eau naturelle sur la parcelle",
      "Transformateur électrique privé haute tension",
    ],
    description:
      "Emplacement stratégique pour un investissement foncier d'envergure. Terrain constructible immédiatement avec potentiel de valorisation exceptionnel.",
  },
  {
    id: 11,
    title: "Maison contemporaine quartier résidentiel calme",
    quartier: "Kintambo",
    commune: "Kintambo",
    address: "Avenue Komoriko, Kintambo",
    type: "Villa",
    mode: "Acheter",
    price: 320000,
    beds: 4,
    baths: 3,
    area: 420,
    landArea: 650,
    yearBuilt: 2020,
    img: u("photo-1564013799919-ab600027ffc6"),
    gallery: [
      u("photo-1564013799919-ab600027ffc6"),
      u("photo-1580587771525-78b9dba3b914"),
      u("photo-1600585154340-be6161a56a0c"),
    ],
    availability: "Immédiate — Libre de tout engagement",
    history:
      "Bâtie en 2020 avec dalle en béton armé prête pour une surélévation éventuelle d'un étage supplémentaire.",
    legalStatus: "Certificat d'enregistrement officiel certifié conforme",
    locationHighlights: [
      "Entre la Gombe et Ngaliema, carrefour stratégique",
      "Proche du Pont Kintambo et des axes rapides",
      "Commerces et banques accessibles à pied",
    ],
    features: [
      "Jardin intime avec terrasse carrelée",
      "Forage d'eau 75m avec suppresseur automatique",
      "Groupe électrogène 25 kVA",
      "Parking intérieur pour 4 voitures",
    ],
    description:
      "Maison fonctionnelle et élégante offrant une distribution idéale pour la vie de famille : grand séjour traversant, cuisine avec cellier et suite parentale séparée.",
  },
  {
    id: 12,
    title: "Appartement neuf 3 chambres dans résidence sécurisée",
    quartier: "Limete",
    commune: "Limete",
    address: "Boulevard Lumumba, 12ème Rue Résidentielle, Limete",
    type: "Appartement",
    mode: "Acheter",
    price: 210000,
    beds: 3,
    baths: 2,
    area: 175,
    yearBuilt: 2024,
    img: u("photo-1522708323590-d24dbb6b0267"),
    gallery: [
      u("photo-1522708323590-d24dbb6b0267"),
      u("photo-1600210492486-724fe5c67fb0"),
      u("photo-1512917774080-9991f1c4c750"),
    ],
    availability: "Immédiate — Jamais habité",
    history:
      "Nouvelle résidence livrée en 2024 aux dernières normes de construction par un promoteur réputé.",
    legalStatus: "Acte notarié de vente et certificat d'enregistrement de copropriété",
    locationHighlights: [
      "Accès rapide au centre-ville et aux zones d'affaires",
      "Immeuble clôturé avec gardiennage armé",
      "Ascenseur Otis et parties communes de haut standing",
    ],
    features: [
      "Balcon privatif avec vue dégagée",
      "Cuisine moderne aménagée",
      "Parking titré au rez-de-chaussée",
      "Groupe électrogène commun automatique",
    ],
    description:
      "Excellente opportunité d'investissement locatif ou de résidence principale dans un immeuble récent et très bien géré à Limete.",
  },
];

export const QUARTIERS = ["Gombe", "Ngaliema", "Limete", "Mont-Ngafula", "Kintambo"] as const;

export const PROPERTY_TYPES = [
  "Villa",
  "Appartement",
  "Bureau",
  "Terrain",
  "Maison",
  "Immeuble",
] as const;

export const SALE_PRICE_FILTERS = [
  { label: "Tous les prix", min: 0, max: Infinity },
  { label: "≤ 250 000 $", min: 0, max: 250000 },
  { label: "≤ 500 000 $", min: 0, max: 500000 },
  { label: "≤ 800 000 $", min: 0, max: 800000 },
  { label: "≤ 1 000 000 $", min: 0, max: 1000000 },
  { label: "> 1 000 000 $", min: 1000000, max: Infinity },
] as const;

export const fmtPrice = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f/g, " ");

export function getListingById(id: number | string): Listing | undefined {
  // Support uuid (string) ou id numérique legacy
  if (typeof id === "string" && isNaN(Number(id))) {
    return LISTINGS.find((l) => String(l.id) === id);
  }
  const numericId = typeof id === "string" ? Number(id) : id;
  return LISTINGS.find((l) => l.id === numericId);
}
