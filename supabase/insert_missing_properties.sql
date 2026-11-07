-- ==============================================================================
-- SCRIPT D'INSERTION DES ANNONCES MANQUANTES DANS SUPABASE (dont ID 10)
-- Exécutez ce script dans : Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- Annonce 3 : Résidence familiale sécurisée avec parc paysager (Ngaliema)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Résidence familiale sécurisée avec parc paysager',
  'Idéale pour les grandes familles ou les délégations, cette vaste propriété allie confort, générosité des volumes et sécurité maximale. Ses terrasses ombragées ouvrent sur un magnifique jardin tropical sans vis-à-vis.',
  'Acheter',
  'Villa',
  'Ngaliema',
  'Ngaliema',
  'Avenue Colonel Mondjiba, Macampagne, Ngaliema',
  520000,
  'USD',
  780,
  1400,
  6,
  5,
  2019,
  'Certificat d''enregistrement individuel notarié (Division foncière de Ngaliema)',
  'Immédiate — Visites sur rendez-vous 48h à l''avance',
  'disponible',
  '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=75"]',
  '{"Grand jardin arboré de plus de 800 m²","Forage industriel 110m avec système d''osmose inverse","Générateur Caterpillar 45 kVA","Annexe indépendante de 3 chambres pour hôtes ou personnel","Stationnement clôturé pour 6 voitures"}',
  '{"Quartier résidentiel calme et verdoyant de Macampagne","Proche de l''Hôpital du Cinquantenaire et des galeries marchandes","Environnement d''expatriés et hauts cadres d''entreprises"}',
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Résidence familiale sécurisée avec parc paysager'
);

-- Annonce 4 : Appartement meublé standing contemporain (Limete)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Appartement meublé standing contemporain',
  'Appartement clé en main conçu pour les professionnels exigeants. Cuisine moderne équipée et finitions raffinées.',
  'Louer',
  'Appartement',
  'Limete',
  'Limete',
  '7ème Rue Résidentielle, Limete',
  2200,
  'USD',
  130,
  NULL,
  2,
  2,
  2021,
  'Bail notarié disponible sous 24h',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=75"]',
  '{"Mobilier complet inclus","Fibre optique installée","Sécurité gardiennée 24/7"}',
  '{"Côté résidentiel calme de Limete","Accès rapide à l''Aéroport International de N''djili et au centre-ville"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Appartement meublé standing contemporain'
);

-- Annonce 5 : Plateau de bureaux premium aménagé (Gombe)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Plateau de bureaux premium aménagé',
  'Espace de travail moderne et modulable prêt à accueillir un siège d''entreprise ou une organisation internationale.',
  'Louer',
  'Bureau',
  'Gombe',
  'Gombe',
  'Boulevard du 30 Juin, Gombe',
  6800,
  'USD',
  400,
  NULL,
  0,
  2,
  2020,
  'Contrat de bail commercial standard OHADA',
  'Disponible sous 15 jours',
  'disponible',
  '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=75"]',
  '{"Câblage réseau Cat 7 et salle serveur climatisée","Double alimentation électrique secourue","Contrôle d''accès par cartes magnétiques"}',
  '{"Emplacement prestigieux sur le Boulevard du 30 Juin","Proche des banques centrales, ministères et grands hôtels"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Plateau de bureaux premium aménagé'
);

-- Annonce 6 : Terrain constructible viabilisé 1 200 m² (Mont-Ngafula)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Terrain constructible viabilisé 1 200 m²',
  'Opportunité rare d''acquérir une parcelle de plus de 1 200 m² dans un cadre paisible et aéré de Mont-Ngafula, idéale pour la construction d''une résidence privée ou d''un complexe d''appartements locatifs.',
  'Acheter',
  'Terrain',
  'Mont-Ngafula',
  'Mont-Ngafula',
  'Avenue By-Pass, Quartier Télécom, Mont-Ngafula',
  180000,
  'USD',
  1200,
  1200,
  0,
  0,
  NULL,
  'Certificat d''enregistrement définitif (Guichet unique du Cadastre)',
  'Immédiate — Prêt pour démarrage chantier',
  'disponible',
  '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=75"]',
  '{"Terrain entièrement clôturé de murs en béton de 2,80m","Portail métallique coulissant déjà posé","Voie d''accès carrossable toute saison"}',
  '{"Quartier résidentiel en pleine expansion","Topographie plate avec sol ferme idéal pour fondations économiques","Raccordement SNEL et REGIDESO disponible à la parcelle"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Terrain constructible viabilisé 1 200 m²'
);

-- Annonce 7 : Villa de maître coloniale modernisée avec jardin arboré (Limete)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Villa de maître coloniale modernisée avec jardin arboré',
  'Alliance parfaite du charme intemporel et du confort contemporain. De grands volumes, une lumière traversante et un jardin mature offrant une fraîcheur naturelle incomparable.',
  'Acheter',
  'Villa',
  'Limete',
  'Limete',
  '10ème Rue Résidentielle, Limete',
  390000,
  'USD',
  500,
  950,
  4,
  3,
  2018,
  'Certificat d''enregistrement régulier, mutation immédiate',
  'Immédiate — Clés disponibles en agence',
  'disponible',
  '["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75"]',
  '{"Piscine rénovée avec filtration automatique","Forage avec réserve d''eau 4 000L","Groupe électrogène Perkins 30 kVA","Grande terrasse couverte donnant sur le jardin"}',
  '{"Le secteur le plus prisé de Limete Résidentiel","Voies asphaltées et très faible circulation","Voisinage calme de notables et diplomates"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Villa de maître coloniale modernisée avec jardin arboré'
);

-- Annonce 8 : Duplex contemporain de grand standing avec rooftop (Gombe)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Duplex contemporain de grand standing avec rooftop',
  'Ce duplex d''exception séduit par sa hauteur sous plafond cathédrale, son escalier aérien en verre et acier et ses espaces de réception conçus pour recevoir dans une élégance absolue.',
  'Acheter',
  'Appartement',
  'Gombe',
  'Gombe',
  'Avenue Batetela, Proximité Fleuve Congo Hôtel, Gombe',
  430000,
  'USD',
  260,
  NULL,
  3,
  3,
  2023,
  'Titre de propriété individuel en copropriété notariée',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=75"]',
  '{"Terrasse rooftop privée avec vue dégagée","Cuisine italienne sur mesure avec électroménager Bosch","2 places de parking en sous-sol sécurisé","Service de conciergerie et gardiennage 24h/24"}',
  '{"À deux pas de l''Hôtel Fleuve Congo et du Palais de la Nation","Quartier hyper-sécurisé avec patrouilles continues","Proche des meilleures tables de la capitale"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Duplex contemporain de grand standing avec rooftop'
);

-- Annonce 9 : Propriété d'exception Macampagne avec parc & vue (Ngaliema)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Propriété d''exception Macampagne avec parc & vue',
  'Une véritable œuvre architecturale offrant une qualité de vie sans équivalent à Kinshasa. Tout y a été pensé pour le confort absolu, l''intimité et la pérennité de l''investissement.',
  'Acheter',
  'Villa',
  'Ngaliema',
  'Ngaliema',
  'Avenue de la Montagne, Macampagne Haute, Ngaliema',
  1100000,
  'USD',
  920,
  2200,
  6,
  6,
  2021,
  'Certificat d''enregistrement perpétuel au Ministère des Affaires Foncières',
  'Immédiate — Dossier confidentiel disponible sur demande',
  'disponible',
  '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  '{"Piscine miroir chauffée avec cascade décorative","Installation solaire photovoltaïque 15 kWc avec batteries lithium","Générateur de secours 80 kVA","Maison de gardien indépendante et bureau extérieur","Cave à vin climatisée et salle de projection privée"}',
  '{"Point culminant de Macampagne avec brise constante et air pur","Vue imprenable sur les collines et la baie de Ngaliema","Zone ultra-résidentielle réservée aux grandes propriétés"}',
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Propriété d''exception Macampagne avec parc & vue'
);

-- Annonce 10 : Vaste concession résidentielle avec vue panoramique (Mont-Ngafula)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Vaste concession résidentielle avec vue panoramique',
  'Emplacement stratégique pour un investissement foncier d''envergure. Terrain constructible immédiatement avec potentiel de valorisation exceptionnel.',
  'Acheter',
  'Terrain',
  'Mont-Ngafula',
  'Mont-Ngafula',
  'Route de Matadi, Proximité UPN / Kimwenza, Mont-Ngafula',
  950000,
  'USD',
  2500,
  2500,
  0,
  0,
  NULL,
  'Certificat d''enregistrement définitif (2 parcelles jumelées)',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=75"]',
  '{"Concession murée sur l''ensemble de son périmètre","Source d''eau naturelle sur la parcelle","Transformateur électrique privé haute tension"}',
  '{"Accès direct par route principale asphaltée","Vue spectaculaire à 180° sur la plaine de Kinshasa","Idéal pour grand complexe hôtelier, école ou lotissement privé"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Vaste concession résidentielle avec vue panoramique'
);

-- Annonce 11 : Maison contemporaine quartier résidentiel calme (Kintambo)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Maison contemporaine quartier résidentiel calme',
  'Maison fonctionnelle et élégante offrant une distribution idéale pour la vie de famille : grand séjour traversant, cuisine avec cellier et suite parentale séparée.',
  'Acheter',
  'Villa',
  'Kintambo',
  'Kintambo',
  'Avenue Komoriko, Kintambo',
  320000,
  'USD',
  420,
  650,
  4,
  3,
  2020,
  'Certificat d''enregistrement officiel certifié conforme',
  'Immédiate — Libre de tout engagement',
  'disponible',
  '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75"]',
  '{"Jardin intime avec terrasse carrelée","Forage d''eau 75m avec suppresseur automatique","Groupe électrogène 25 kVA","Parking intérieur pour 4 voitures"}',
  '{"Entre la Gombe et Ngaliema, carrefour stratégique","Proche du Pont Kintambo et des axes rapides","Commerces et banques accessibles à pied"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Maison contemporaine quartier résidentiel calme'
);

-- Annonce 12 : Appartement neuf 3 chambres dans résidence sécurisée (Limete)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Appartement neuf 3 chambres dans résidence sécurisée',
  'Excellente opportunité d''investissement locatif ou de résidence principale dans un immeuble récent et très bien géré à Limete.',
  'Acheter',
  'Appartement',
  'Limete',
  'Limete',
  'Boulevard Lumumba, 12ème Rue Résidentielle, Limete',
  210000,
  'USD',
  175,
  NULL,
  3,
  2,
  2024,
  'Acte notarié de vente et certificat d''enregistrement de copropriété',
  'Immédiate — Jamais habité',
  'disponible',
  '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  '{"Balcon privatif avec vue dégagée","Cuisine moderne aménagée","Parking titré au rez-de-chaussée","Groupe électrogène commun automatique"}',
  '{"Accès rapide au centre-ville et aux zones d''affaires","Immeuble clôturé avec gardiennage armé","Ascenseur Otis et parties communes de haut standing"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Appartement neuf 3 chambres dans résidence sécurisée'
);

-- Annonce 13 : Appartement contemporain sécurisé proche centre des affaires (Lingwala)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Appartement contemporain sécurisé proche centre des affaires',
  'Logement idéal pour un pied-à-terre sécurisé à Kinshasa ou pour un investissement locatif à fort rendement à proximité directe du centre d''affaires.',
  'Acheter',
  'Appartement',
  'Lingwala',
  'Lingwala',
  'Avenue de la Libération (ex-24 Novembre), Lingwala',
  185000,
  'USD',
  145,
  NULL,
  3,
  2,
  2023,
  'Certificat d''enregistrement de copropriété en règle',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  '{"Ascenseur et gardiennage 24h/24","Groupe électrogène et réserve d''eau","Finitions soignées et cuisine équipée"}',
  '{"À 5 minutes de la Gombe et du Boulevard du 30 Juin","Proximité des institutions et grandes universités","Accès facile sans les embouteillages du centre"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Appartement contemporain sécurisé proche centre des affaires'
);

-- Annonce 14 : Parcelle d'angle avec maison et fort potentiel commercial (Barumbu)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Parcelle d''angle avec maison et fort potentiel commercial',
  'Rare opportunité foncière à Barumbu pour investisseurs avisés cherchant à développer une activité commerciale ou un projet résidentiel mixte.',
  'Acheter',
  'Maison',
  'Barumbu',
  'Barumbu',
  'Avenue Kasa-Vubu, Barumbu',
  230000,
  'USD',
  280,
  550,
  4,
  2,
  2017,
  'Certificat d''enregistrement perpétuel vérifié',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75"]',
  '{"Clôture intégrale et portail métallique renforcé","Alimentation SNEL et Regideso stables","Cour intérieure spacieuse avec stationnement pour 5 véhicules"}',
  '{"Emplacement d''angle sur artère très fréquentée","Potentiel de transformation en immeuble de commerce ou appartements","Accès rapide au Marché Central et au centre-ville"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Parcelle d''angle avec maison et fort potentiel commercial'
);

-- Annonce 15 : Villa résidentielle familiale avec jardin et dépendance (Lemba)
INSERT INTO public.properties (
  titre, description, categorie, type, district, commune, adresse, prix, monnaie,
  surface, surface_terrain, chambres, salles_de_bain, annee_construction,
  statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) SELECT
  'Villa résidentielle familiale avec jardin et dépendance',
  'Une magnifique opportunité pour une famille souhaitant s''installer dans un cadre paisible et chaleureux à Lemba, avec tout le confort moderne.',
  'Acheter',
  'Villa',
  'Lemba',
  'Lemba',
  'Quartier Righini, Lemba',
  245000,
  'USD',
  340,
  600,
  5,
  3,
  2019,
  'Certificat d''enregistrement en ordre sans contestation',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=75","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75"]',
  '{"Jardin arboré et pelouse","Forage avec réserve d''eau 3 000L","Dépendance 2 pièces pour personnel ou bureau","Garage fermé 2 voitures"}',
  '{"Secteur calme et verdoyant de Lemba Righini","Proximité des commerces de l''Échangeur et des écoles réputées","Voie pavée avec bon voisinage"}',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties WHERE titre = 'Villa résidentielle familiale avec jardin et dépendance'
);

