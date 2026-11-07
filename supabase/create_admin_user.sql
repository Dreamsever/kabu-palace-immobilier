-- ==============================================================================
-- KABU PALACE IMMOBILIER - Configuration du Compte Administrateur & Droits
-- Exécutez ce script dans : Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Assurer que pgcrypto est actif
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Création automatique du compte Administrateur
-- Identifiants créés :
--   Email : admin@kabupalace.cd
--   Mot de passe : KabuPalace2026!
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'admin@kabupalace.cd';
  admin_password TEXT := 'KabuPalace2026!';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"admin"}',
      '{"name":"Administrateur Kabu Palace"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  ELSE
    -- Mettre à jour le mot de passe et confirmer l'email si déjà existant
    UPDATE auth.users
    SET encrypted_password = crypt(admin_password, gen_salt('bf')),
        email_confirmed_at = now(),
        raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin"}'
    WHERE email = admin_email;
  END IF;
END $$;

-- 3. Politiques RLS pour permettre à l'administrateur de gérer toutes les annonces
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Lecture de toutes les annonces (publiées et brouillons)
DROP POLICY IF EXISTS "Lecture complète pour les annonces" ON public.properties;
CREATE POLICY "Lecture complète pour les annonces"
  ON public.properties
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ajout d'annonces
DROP POLICY IF EXISTS "Gestion insertion annonces" ON public.properties;
CREATE POLICY "Gestion insertion annonces"
  ON public.properties
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Modification d'annonces
DROP POLICY IF EXISTS "Gestion modification annonces" ON public.properties;
CREATE POLICY "Gestion modification annonces"
  ON public.properties
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Suppression d'annonces
DROP POLICY IF EXISTS "Gestion suppression annonces" ON public.properties;
CREATE POLICY "Gestion suppression annonces"
  ON public.properties
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Lecture des leads vendeurs (formulaires /vendre)
DROP POLICY IF EXISTS "Lecture leads vendeurs" ON public.seller_leads;
CREATE POLICY "Lecture leads vendeurs"
  ON public.seller_leads
  FOR SELECT
  TO anon, authenticated
  USING (true);
