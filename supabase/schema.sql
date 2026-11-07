-- ==============================================================================
-- KABU PALACE IMMOBILIER - Schéma complet de base de données Supabase
-- Exécutez ce script dans : Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Extension pour la génération de clés UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE 1 : properties (Les Annonces Immobilières)
-- Gère toutes les offres de vente et location affichées sur le site.
-- Compatible avec le site web et les filtres existants.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Informations principales
  titre TEXT NOT NULL,
  description TEXT,
  categorie TEXT NOT NULL DEFAULT 'Acheter',      -- 'Acheter' ou 'Louer'
  type TEXT NOT NULL DEFAULT 'Villa',            -- 'Villa', 'Appartement', 'Bureau', 'Terrain', 'Maison', 'Immeuble'
  
  -- Localisation (Kinshasa)
  district TEXT NOT NULL DEFAULT 'Gombe',        -- 'Gombe', 'Ngaliema', 'Limete', 'Mont-Ngafula', 'Kintambo', etc.
  commune TEXT,
  adresse TEXT,
  
  -- Prix & Financier
  prix NUMERIC(14, 2) NOT NULL DEFAULT 0,
  monnaie TEXT NOT NULL DEFAULT 'USD',           -- 'USD' ou 'CDF'
  prix_negociable BOOLEAN DEFAULT true,
  
  -- Caractéristiques du bien
  surface NUMERIC(10, 2) DEFAULT 0,              -- Surface habitable en m²
  surface_terrain NUMERIC(10, 2),                -- Surface du terrain en m²
  chambres INT DEFAULT 0,
  salles_de_bain INT DEFAULT 0,
  annee_construction INT,
  statut_juridique TEXT,                         -- 'Certificat d''enregistrement', 'Livret de logeur', etc.
  disponibilite TEXT DEFAULT 'Disponible',        -- 'Disponible', 'Sous compromis', 'Vendu', 'Loué'
  status TEXT DEFAULT 'disponible',              -- Compatibilité ancien champ
  
  -- Médias & Atouts
  images TEXT DEFAULT '[]',                      -- Tableau JSON d'URLs: ["https://...", "https://..."]
  atouts TEXT[] DEFAULT '{}',                    -- Ex: {'Piscine', 'Groupe électrogène', 'Forage d''eau'}
  points_forts TEXT[] DEFAULT '{}',              -- Ex: {'Vue fleuve', 'Zone sécurisée'}
  
  -- Publication & Visibilité
  liste BOOLEAN NOT NULL DEFAULT true,           -- true = visible sur le site, false = masqué / brouillon
  vedette BOOLEAN DEFAULT false                  -- true = mise en avant (Coup de cœur)
);

-- Index pour accélérer les filtres de recherche fréquents
CREATE INDEX IF NOT EXISTS idx_properties_liste ON public.properties(liste);
CREATE INDEX IF NOT EXISTS idx_properties_categorie ON public.properties(categorie);
CREATE INDEX IF NOT EXISTS idx_properties_district ON public.properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_prix ON public.properties(prix);

-- ==============================================================================
-- TABLE 2 : seller_leads (Formulaire "Vendre mon bien" / Propriétaires)
-- Enregistre automatiquement les soumissions des propriétaires depuis la page /vendre
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.seller_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Coordonnées du propriétaire
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  email TEXT,
  statut_proprietaire TEXT NOT NULL DEFAULT 'Propriétaire direct', -- 'Propriétaire direct', 'Mandataire', 'Gestionnaire'
  
  -- Détails du bien à vendre
  type_bien TEXT NOT NULL,
  district TEXT NOT NULL,
  adresse TEXT,
  prix_souhaite NUMERIC(14, 2),
  prix_negociable BOOLEAN DEFAULT true,
  surface NUMERIC(10, 2),
  chambres INT,
  salles_de_bain INT,
  titre_foncier TEXT,
  atouts TEXT[] DEFAULT '{}',
  details TEXT,
  
  -- Suivi agence Kabu Palace
  statut_dossier TEXT NOT NULL DEFAULT 'nouveau', -- 'nouveau', 'contacte', 'visite_effectuee', 'mandat_signe', 'rejete'
  notes_internes TEXT
);

CREATE INDEX IF NOT EXISTS idx_seller_leads_statut ON public.seller_leads(statut_dossier);
CREATE INDEX IF NOT EXISTS idx_seller_leads_created_at ON public.seller_leads(created_at DESC);

-- ==============================================================================
-- TABLE 3 : inquiries (Demandes de Visite & Contacts)
-- Permet aux visiteurs de demander une visite ou des infos sur un bien
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Lien vers le bien concerné (optionnel, null si contact général)
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  
  -- Contact du visiteur
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  email TEXT,
  
  -- Demande
  type_demande TEXT NOT NULL DEFAULT 'visite',   -- 'visite', 'information', 'offre_achat', 'hors_catalogue'
  message TEXT,
  date_visite_souhaitee DATE,
  budget_max NUMERIC(14, 2),
  
  -- Suivi commercial
  statut TEXT NOT NULL DEFAULT 'a_traiter',      -- 'a_traiter', 'en_cours', 'visite_programmee', 'cloture'
  notes_commerciales TEXT
);

CREATE INDEX IF NOT EXISTS idx_inquiries_property ON public.inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_statut ON public.inquiries(statut);

-- ==============================================================================
-- TABLE 4 : agency_reviews (Avis & Témoignages Clients)
-- Gère les témoignages de clients satisfaits affichés sur le site
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.agency_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  auteur TEXT NOT NULL,
  role TEXT DEFAULT 'Acquéreur à Kinshasa',
  commentaire TEXT NOT NULL,
  note INT NOT NULL DEFAULT 5 CHECK (note >= 1 AND note <= 5),
  publie BOOLEAN NOT NULL DEFAULT true
);

-- ==============================================================================
-- POLITIQUES DE SÉCURITÉ (Row Level Security - RLS)
-- ==============================================================================

-- 1. Table properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des annonces publiées" ON public.properties;
CREATE POLICY "Lecture publique des annonces publiées"
  ON public.properties
  FOR SELECT
  TO anon, authenticated
  USING (liste = true);

DROP POLICY IF EXISTS "Gestion complète pour les administrateurs" ON public.properties;
CREATE POLICY "Gestion complète pour les administrateurs"
  ON public.properties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Table seller_leads (Le public peut soumettre, seuls les connectés peuvent lire)
ALTER TABLE public.seller_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Soumission publique de biens à vendre" ON public.seller_leads;
CREATE POLICY "Soumission publique de biens à vendre"
  ON public.seller_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lecture des leads réservée aux administrateurs" ON public.seller_leads;
CREATE POLICY "Lecture des leads réservée aux administrateurs"
  ON public.seller_leads
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Table inquiries (Le public peut envoyer une demande, les admins la lisent)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Envoi public de demande de visite" ON public.inquiries;
CREATE POLICY "Envoi public de demande de visite"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lecture des demandes pour les administrateurs" ON public.inquiries;
CREATE POLICY "Lecture des demandes pour les administrateurs"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Table agency_reviews
ALTER TABLE public.agency_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des avis publiés" ON public.agency_reviews;
CREATE POLICY "Lecture publique des avis publiés"
  ON public.agency_reviews
  FOR SELECT
  TO anon, authenticated
  USING (publie = true);

-- ==============================================================================
-- INSERTION DE TOUTES LES ANNONCES KABU PALACE (15 Biens d'exception)
-- ==============================================================================
INSERT INTO public.properties (
  id, titre, description, categorie, type, district, commune, adresse, prix, surface, surface_terrain, chambres, salles_de_bain, annee_construction, statut_juridique, disponibilite, status, images, atouts, points_forts, liste, vedette
) VALUES 
(
  '75313570-3c29-418e-a8b6-80aa55992eef',
  'Villa contemporaine avec piscine & grand jardin',
  'Cette somptueuse villa d''architecte incarne le luxe moderne au cœur du quartier le plus convoité de Kinshasa. Elle offre de vastes espaces de vie baignés de lumière naturelle, une cuisine contemporaine avec îlot en marbre, suite parentale d''exception et piscine privée.',
  'Acheter',
  'Villa',
  'Gombe',
  'Gombe',
  'Avenue de la Justice, Quartier Diplomatique, Gombe',
  850000,
  620,
  1000,
  5,
  4,
  2022,
  'Certificat d''enregistrement définitif (Cadastre foncier de la Gombe, sans hypothèque ni litige)',
  'Immédiate — Libre de tout occupant',
  'disponible',
  '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Piscine privée 12m x 5m avec solarium', 'Groupe électrogène insonorisé 60 kVA avec inverseur automatique', 'Forage d''eau 90m avec station de filtration UV et réservoir 5 000L', 'Climatisation centrale inverter dans chaque pièce', 'Guérite de sécurité avec vidéosurveillance CCTV 8 caméras', 'Garage couvert 4 véhicules + parking invités', 'Dépendance pour le personnel (2 pièces avec sanitaires)'],
  ARRAY['À 3 minutes du Boulevard du 30 Juin', 'Proximité immédiate des ambassades et écoles internationales', 'Zone hautement sécurisée avec patrouilles régulières', 'Accès goudronné et éclairage public permanent'],
  true,
  true
),
(
  '520232da-1c15-41de-bfd9-0bf174b89776',
  'Penthouse de prestige vue panoramique sur le fleuve',
  'Penthouse unique offrant une vue féerique sur le majestueux fleuve Congo. Espace de réception spectaculaire avec baies vitrées toute hauteur, parquet massif et finitions européennes.',
  'Louer',
  'Appartement',
  'Gombe',
  'Gombe',
  'Boulevard Tshatshi, Front de fleuve, Gombe',
  4500,
  240,
  NULL,
  3,
  3,
  2023,
  'Titre de copropriété certifié en règle',
  'Disponible au 1er du mois prochain',
  'disponible',
  '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Terrasse panoramique de 45 m²', 'Ascenseur privatif sécurisé par badge', 'Salle de sport et piscine commune au rooftop', 'Groupe de secours et eau sous pression permanente'],
  ARRAY['Vue imprenable et imprenable sur le fleuve Congo et Brazzaville', 'Accès direct aux restaurants gastronomiques et hôtels de prestige', 'Contrôle d''accès biométrique 24h/24'],
  true,
  true
),
(
  '11e38468-8154-42fc-8979-18a85c5f4dbd',
  'Résidence familiale sécurisée avec parc paysager',
  'Idéale pour les grandes familles ou les délégations, cette vaste propriété allie confort, générosité des volumes et sécurité maximale. Ses terrasses ombragées ouvrent sur un magnifique jardin tropical sans vis-à-vis.',
  'Acheter',
  'Villa',
  'Ngaliema',
  'Ngaliema',
  'Avenue Colonel Mondjiba, Macampagne, Ngaliema',
  520000,
  780,
  1400,
  6,
  5,
  2019,
  'Certificat d''enregistrement individuel notarié (Division foncière de Ngaliema)',
  'Immédiate — Visites sur rendez-vous 48h à l''avance',
  'disponible',
  '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Grand jardin arboré de plus de 800 m²', 'Forage industriel 110m avec système d''osmose inverse', 'Générateur Caterpillar 45 kVA', 'Annexe indépendante de 3 chambres pour hôtes ou personnel', 'Stationnement clôturé pour 6 voitures'],
  ARRAY['Quartier résidentiel calme et verdoyant de Macampagne', 'Proche de l''Hôpital du Cinquantenaire et des galeries marchandes', 'Environnement d''expatriés et hauts cadres d''entreprises'],
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000004',
  'Appartement meublé standing contemporain',
  'Appartement clé en main conçu pour les professionnels exigeants. Cuisine moderne équipée et finitions raffinées. Rénovation intégrale avec mobilier italien haut de gamme fin 2023.',
  'Louer',
  'Appartement',
  'Limete',
  'Limete',
  '7ème Rue Résidentielle, Limete',
  2200,
  130,
  NULL,
  2,
  2,
  2021,
  'Bail notarié disponible sous 24h',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Mobilier complet inclus', 'Fibre optique installée', 'Sécurité gardiennée 24/7'],
  ARRAY['Côté résidentiel calme de Limete', 'Accès rapide à l''Aéroport International de N''djili et au centre-ville'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000005',
  'Plateau de bureaux premium aménagé',
  'Espace de travail moderne et modulable prêt à accueillir un siège d''entreprise ou une organisation internationale. Ancien siège d''un groupe minier international.',
  'Louer',
  'Bureau',
  'Gombe',
  'Gombe',
  'Boulevard du 30 Juin, Gombe',
  6800,
  400,
  NULL,
  0,
  2,
  2020,
  'Contrat de bail commercial standard OHADA',
  'Disponible sous 15 jours',
  'disponible',
  '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Câblage réseau Cat 7 et salle serveur climatisée', 'Double alimentation électrique secourue', 'Contrôle d''accès par cartes magnétiques'],
  ARRAY['Emplacement prestigieux sur le Boulevard du 30 Juin', 'Proche des banques centrales, ministères et grands hôtels'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000006',
  'Terrain constructible viabilisé 1 200 m²',
  'Opportunité rare d''acquérir une parcelle de plus de 1 200 m² dans un cadre paisible et aéré de Mont-Ngafula, idéale pour la construction d''une résidence privée ou d''un complexe d''appartements locatifs. Bornage contradictoire et PV de délimitation officialisés.',
  'Acheter',
  'Terrain',
  'Mont-Ngafula',
  'Mont-Ngafula',
  'Avenue By-Pass, Quartier Télécom, Mont-Ngafula',
  180000,
  1200,
  1200,
  0,
  0,
  NULL,
  'Certificat d''enregistrement définitif (Guichet unique du Cadastre)',
  'Immédiate — Prêt pour démarrage chantier',
  'disponible',
  '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Terrain entièrement clôturé de murs en béton de 2,80m', 'Portail métallique coulissant déjà posé', 'Voie d''accès carrossable toute saison'],
  ARRAY['Quartier résidentiel en pleine expansion', 'Topographie plate avec sol ferme idéal pour fondations économiques', 'Raccordement SNEL et REGIDESO disponible à la parcelle'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000007',
  'Villa de maître coloniale modernisée avec jardin arboré',
  'Alliance parfaite du charme intemporel et du confort contemporain. De grands volumes, une lumière traversante et un jardin mature offrant une fraîcheur naturelle incomparable. Maison de caractère rénovée de fond en comble en 2018.',
  'Acheter',
  'Villa',
  'Limete',
  'Limete',
  '10ème Rue Résidentielle, Limete',
  390000,
  500,
  950,
  4,
  3,
  2018,
  'Certificat d''enregistrement régulier, mutation immédiate',
  'Immédiate — Clés disponibles en agence',
  'disponible',
  '["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Piscine rénovée avec filtration automatique', 'Forage avec réserve d''eau 4 000L', 'Groupe électrogène Perkins 30 kVA', 'Grande terrasse couverte donnant sur le jardin'],
  ARRAY['Le secteur le plus prisé de Limete Résidentiel', 'Voies asphaltées et très faible circulation', 'Voisinage calme de notables et diplomates'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000008',
  'Duplex contemporain de grand standing avec rooftop',
  'Ce duplex d''exception séduit par sa hauteur sous plafond cathédrale, son escalier aérien en verre et acier et ses espaces de réception conçus pour recevoir dans une élégance absolue. Matériaux et équipements importés d''Italie et d''Espagne.',
  'Acheter',
  'Appartement',
  'Gombe',
  'Gombe',
  'Avenue Batetela, Proximité Fleuve Congo Hôtel, Gombe',
  430000,
  260,
  NULL,
  3,
  3,
  2023,
  'Titre de propriété individuel en copropriété notariée',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Terrasse rooftop privée avec vue dégagée', 'Cuisine italienne sur mesure avec électroménager Bosch', '2 places de parking en sous-sol sécurisé', 'Service de conciergerie et gardiennage 24h/24'],
  ARRAY['À deux pas de l''Hôtel Fleuve Congo et du Palais de la Nation', 'Quartier hyper-sécurisé avec patrouilles continues', 'Proche des meilleures tables de la capitale'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000009',
  'Propriété d''exception Macampagne avec parc & vue',
  'Une véritable œuvre architecturale offrant une qualité de vie sans équivalent à Kinshasa. Tout y a été pensé pour le confort absolu, l''intimité et la pérennité de l''investissement. Marbre travertin, bois exotique wengé et ferronnerie d''art.',
  'Acheter',
  'Villa',
  'Ngaliema',
  'Ngaliema',
  'Avenue de la Montagne, Macampagne Haute, Ngaliema',
  1100000,
  920,
  2200,
  6,
  6,
  2021,
  'Certificat d''enregistrement perpétuel au Ministère des Affaires Foncières',
  'Immédiate — Dossier confidentiel disponible sur demande',
  'disponible',
  '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Piscine miroir chauffée avec cascade décorative', 'Installation solaire photovoltaïque 15 kWc avec batteries lithium', 'Générateur de secours 80 kVA', 'Maison de gardien indépendante et bureau extérieur', 'Cave à vin climatisée et salle de projection privée'],
  ARRAY['Point culminant de Macampagne avec brise constante et air pur', 'Vue imprenable sur les collines et la baie de Ngaliema', 'Zone ultra-résidentielle réservée aux grandes propriétés'],
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000010',
  'Vaste concession résidentielle avec vue panoramique',
  'Emplacement stratégique pour un investissement foncier d''envergure. Terrain constructible immédiatement avec potentiel de valorisation exceptionnel. Propriété foncière historique titrée au cadastre moderne.',
  'Acheter',
  'Terrain',
  'Mont-Ngafula',
  'Mont-Ngafula',
  'Route de Matadi, Proximité UPN / Kimwenza, Mont-Ngafula',
  950000,
  2500,
  2500,
  0,
  0,
  NULL,
  'Certificat d''enregistrement définitif (2 parcelles jumelées)',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Concession murée sur l''ensemble de son périmètre', 'Source d''eau naturelle sur la parcelle', 'Transformateur électrique privé haute tension'],
  ARRAY['Accès direct par route principale asphaltée', 'Vue spectaculaire à 180° sur la plaine de Kinshasa', 'Idéal pour grand complexe hôtelier, école ou lotissement privé'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000011',
  'Maison contemporaine quartier résidentiel calme',
  'Maison fonctionnelle et élégante offrant une distribution idéale pour la vie de famille : grand séjour traversant, cuisine avec cellier et suite parentale séparée. Dalle en béton armé prête pour une surélévation.',
  'Acheter',
  'Villa',
  'Kintambo',
  'Kintambo',
  'Avenue Komoriko, Kintambo',
  320000,
  420,
  650,
  4,
  3,
  2020,
  'Certificat d''enregistrement officiel certifié conforme',
  'Immédiate — Libre de tout engagement',
  'disponible',
  '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Jardin intime avec terrasse carrelée', 'Forage d''eau 75m avec suppresseur automatique', 'Groupe électrogène 25 kVA', 'Parking intérieur pour 4 voitures'],
  ARRAY['Entre la Gombe et Ngaliema, carrefour stratégique', 'Proche du Pont Kintambo et des axes rapides', 'Commerces et banques accessibles à pied'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000012',
  'Appartement neuf 3 chambres dans résidence sécurisée',
  'Excellente opportunité d''investissement locatif ou de résidence principale dans un immeuble récent et très bien géré à Limete. Matériaux et finitions aux dernières normes de construction.',
  'Acheter',
  'Appartement',
  'Limete',
  'Limete',
  'Boulevard Lumumba, 12ème Rue Résidentielle, Limete',
  210000,
  175,
  NULL,
  3,
  2,
  2024,
  'Acte notarié de vente et certificat d''enregistrement de copropriété',
  'Immédiate — Jamais habité',
  'disponible',
  '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Balcon privatif avec vue dégagée', 'Cuisine moderne aménagée', 'Parking titré au rez-de-chaussée', 'Groupe électrogène commun automatique'],
  ARRAY['Accès rapide au centre-ville et aux zones d''affaires', 'Immeuble clôturé avec gardiennage armé', 'Ascenseur Otis et parties communes de haut standing'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000013',
  'Appartement contemporain sécurisé proche centre des affaires',
  'Logement idéal pour un pied-à-terre sécurisé à Kinshasa ou pour un investissement locatif à fort rendement à proximité directe du centre d''affaires.',
  'Acheter',
  'Appartement',
  'Lingwala',
  'Lingwala',
  'Avenue de la Libération (ex-24 Novembre), Lingwala',
  185000,
  145,
  NULL,
  3,
  2,
  2023,
  'Certificat d''enregistrement de copropriété en règle',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Ascenseur et gardiennage 24h/24', 'Groupe électrogène et réserve d''eau', 'Finitions soignées et cuisine équipée'],
  ARRAY['À 5 minutes de la Gombe et du Boulevard du 30 Juin', 'Proximité des institutions et grandes universités', 'Accès facile sans les embouteillages du centre'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000014',
  'Parcelle d''angle avec maison et fort potentiel commercial',
  'Rare opportunité foncière à Barumbu pour investisseurs avisés cherchant à développer une activité commerciale ou un projet résidentiel mixte sur une artère très passante.',
  'Acheter',
  'Maison',
  'Barumbu',
  'Barumbu',
  'Avenue Kasa-Vubu, Barumbu',
  230000,
  280,
  550,
  4,
  2,
  2017,
  'Certificat d''enregistrement perpétuel vérifié',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Clôture intégrale et portail métallique renforcé', 'Alimentation SNEL et Regideso stables', 'Cour intérieure spacieuse avec stationnement pour 5 véhicules'],
  ARRAY['Emplacement d''angle sur artère très fréquentée', 'Potentiel de transformation en immeuble de commerce ou appartements', 'Accès rapide au Marché Central et au centre-ville'],
  true,
  false
),
(
  '00000000-0000-0000-0000-000000000015',
  'Villa résidentielle familiale avec jardin et dépendance',
  'Une magnifique opportunité pour une famille souhaitant s''installer dans un cadre paisible et chaleureux à Lemba Righini, avec tout le confort moderne.',
  'Acheter',
  'Villa',
  'Lemba',
  'Lemba',
  'Quartier Righini, Lemba',
  245000,
  340,
  600,
  5,
  3,
  2019,
  'Certificat d''enregistrement en ordre sans contestation',
  'Immédiate',
  'disponible',
  '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=75"]',
  ARRAY['Jardin arboré et pelouse', 'Forage avec réserve d''eau 3 000L', 'Dépendance 2 pièces pour personnel ou bureau', 'Garage fermé 2 voitures'],
  ARRAY['Secteur calme et verdoyant de Lemba Righini', 'Proximité des commerces de l''Échangeur et des écoles réputées', 'Voie pavée avec bon voisinage'],
  true,
  false
)
ON CONFLICT (id) DO UPDATE SET
  titre = EXCLUDED.titre,
  description = EXCLUDED.description,
  categorie = EXCLUDED.categorie,
  type = EXCLUDED.type,
  district = EXCLUDED.district,
  commune = EXCLUDED.commune,
  adresse = EXCLUDED.adresse,
  prix = EXCLUDED.prix,
  surface = EXCLUDED.surface,
  surface_terrain = EXCLUDED.surface_terrain,
  chambres = EXCLUDED.chambres,
  salles_de_bain = EXCLUDED.salles_de_bain,
  annee_construction = EXCLUDED.annee_construction,
  statut_juridique = EXCLUDED.statut_juridique,
  disponibilite = EXCLUDED.disponibilite,
  images = EXCLUDED.images,
  atouts = EXCLUDED.atouts,
  points_forts = EXCLUDED.points_forts,
  liste = EXCLUDED.liste,
  vedette = EXCLUDED.vedette;
