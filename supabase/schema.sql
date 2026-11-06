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
-- INSERTION DES PREMIÈRES DONNÉES RÉELLES (Échantillons Kabu Palace)
-- ==============================================================================
INSERT INTO public.properties (
  titre, description, categorie, type, district, adresse, prix, surface, surface_terrain, chambres, salles_de_bain, images, disponibilite, status, liste, vedette
) VALUES 
(
  'Villa contemporaine avec piscine & grand jardin',
  'Cette somptueuse villa d''architecte incarne le luxe moderne au cœur du quartier le plus convoité de Kinshasa. Elle offre de vastes espaces de vie baignés de lumière naturelle, une cuisine avec îlot en marbre, suite parentale d''exception et piscine privée.',
  'Acheter',
  'Villa',
  'Gombe',
  'Avenue de la Justice, Gombe',
  850000,
  620,
  1000,
  5,
  4,
  '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75"]',
  'Immédiate — Libre de tout occupant',
  'disponible',
  true,
  true
),
(
  'Penthouse de prestige vue panoramique sur le fleuve',
  'Appartement d''exception situé au dernier étage d''une tour résidentielle récente. Prestations haut de gamme avec vue imprenable sur le fleuve Congo.',
  'Louer',
  'Appartement',
  'Gombe',
  'Boulevard Tshatshi, Gombe',
  4500,
  240,
  NULL,
  3,
  3,
  '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=75"]',
  'Disponible',
  'disponible',
  true,
  true
),
(
  'Résidence moderne familiale avec jardin paysager',
  'Propriété sécurisée idéale pour famille dans un écrin de verdure calme à Ngaliema, à proximité immédiate des écoles.',
  'Acheter',
  'Villa',
  'Ngaliema',
  'Quartier Macampagne, Ngaliema',
  480000,
  380,
  650,
  4,
  3,
  '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=75"]',
  'Disponible',
  'disponible',
  true,
  false
);
