/**
 * supabase-properties.ts
 *
 * Couche d'accès à la table `properties` de Supabase.
 *
 * Schéma Supabase (table `properties`) :
 *   id             uuid         (PK, gen_random_uuid())
 *   created_at     timestamptz  (now())
 *   titre          text         Titre de l'annonce
 *   categorie      text         "Acheter" | "Louer"
 *   type           text         "Villa" | "Appartement" | "Bureau" | "Terrain" | "Maison" | "Immeuble"
 *   district       text         Quartier (Gombe, Ngaliema, Limete, ...)
 *   prix           numeric      Prix en USD
 *   monnaie        text         "USD" (défaut) | "CDF"
 *   chambres       int4         Nombre de chambres
 *   salles_de_bain int4         Nombre de salles de bain
 *   surface        numeric      Surface en m²
 *   description    text         Description de l'annonce
 *   images         text         JSON array d'URLs : '["url1","url2"]'
 *   status         text         "disponible" | "vendu" | "loué" | "sous compromis" | "réservé"
 *   liste          bool         true = annonce visible sur le site (défaut: false)
 *
 * RLS : activée. Politique requise pour SELECT anon :
 *   CREATE POLICY "Lecture publique"
 *   ON public.properties FOR SELECT TO anon
 *   USING (liste = true);
 */

import { supabase } from './supabase';
import type { Listing } from './listings';

/** Type brut renvoyé par Supabase. */
export interface SupabaseProperty {
  id: string;
  created_at: string;
  titre: string | null;       // nom minuscule, sans accent
  categorie: string | null;
  type: string | null;
  district: string | null;
  prix: number | null;
  monnaie: string | null;
  chambres: number | null;
  salles_de_bain: number | null;
  surface: number | null;
  description: string | null;
  images: string | null;
  status: string | null;
  liste: boolean | null;      // sans accent (évite les bugs d'encodage)
}

/**
 * Parse le champ `images` stocké en JSON ou en texte PostgreSQL.
 * Formats supportés :
 *   - JSON array: '["url1","url2"]'
 *   - PostgreSQL array literal: '{url1,url2}'
 *   - URL simple : 'https://...'
 */
function parseImages(raw: string | null): string[] {
  if (!raw || raw === 'array[]::text[]' || raw.trim() === '{}') return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    // Format PostgreSQL littéral : {url1,url2}
    if (raw.startsWith('{') && raw.endsWith('}')) {
      return raw
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
    }
    // URL simple
    if (raw.startsWith('http')) return [raw];
  }
  return [];
}

/**
 * Convertit une ligne Supabase en objet `Listing` compatible
 * avec les composants existants du projet.
 */
export function mapPropertyToListing(p: SupabaseProperty): Listing {
  const images = parseImages(p.images);
  const img = images[0] ?? '';

  // Détermine le mode Acheter / Louer depuis la colonne `categorie`
  const rawMode = (p.categorie ?? '').toLowerCase();
  const mode: 'Acheter' | 'Louer' = rawMode.includes('lou') ? 'Louer' : 'Acheter';

  // Statut → disponibilité lisible
  const statusMap: Record<string, string> = {
    disponible: 'Disponible',
    vendu: 'Vendu',
    loué: 'Loué',
    'sous compromis': 'Sous compromis',
    réservé: 'Réservé',
  };
  const availability =
    statusMap[(p.status ?? '').toLowerCase()] ?? (p.status ?? 'Disponible');

  return {
    id: p.id,
    title: p.titre ?? 'Bien immobilier',
    quartier: p.district ?? '',
    type: p.type ?? '',
    mode,
    price: p.prix ?? 0,
    beds: p.chambres ?? 0,
    baths: p.salles_de_bain ?? 0,
    area: p.surface ?? 0,
    img,
    gallery: images,
    availability,
    description: p.description ?? '',
    history: '',
    legalStatus: '',
    features: [],
    locationHighlights: [],
    featured: p.liste ?? false,
  };
}

/** Résultat d'une requête Supabase. */
export interface FetchResult<T> {
  data: T[];
  error: string | null;
}

/**
 * Récupère toutes les annonces publiées (listé = true).
 * Retourne un tableau vide en cas d'erreur plutôt que de planter l'UI.
 */
export async function fetchProperties(): Promise<FetchResult<Listing>> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('liste', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] fetchProperties error:', error.message);
    return { data: [], error: error.message };
  }

  return {
    data: ((data ?? []) as SupabaseProperty[]).map(mapPropertyToListing),
    error: null,
  };
}

/**
 * Récupère une annonce par son id (uuid ou numérique legacy).
 */
export async function fetchPropertyById(
  id: string,
): Promise<{ data: Listing | null; error: string | null }> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[Supabase] fetchPropertyById error:', error.message);
    return { data: null, error: error.message };
  }

  return { data: mapPropertyToListing(data as SupabaseProperty), error: null };
}
