/**
 * supabase-properties.ts
 *
 * Couche d'accès à la table `properties` de Supabase.
 *
 * Schéma Supabase (table `properties`) :
 *   id            uuid      (PK, gen_random_uuid())
 *   created_at    timestamptz
 *   Titre         text
 *   categorie     text      (ex: "Acheter" | "Louer")
 *   type          text      (ex: "Villa" | "Appartement" | ...)
 *   district      text      (quartier / district)
 *   prix          numeric
 *   monnaie       text      (défaut "USD")
 *   chambres      int4
 *   salles_de_bain int4
 *   surface       numeric
 *   description   text
 *   images        text      (tableau sérialisé, ex: '["url1","url2"]')
 *   status        text      (défaut "disponible")
 *   listé         bool      (true = annonce publiée)
 *
 * RLS : activée. Pour que les annonces soient visibles sans authentification,
 * créez la politique suivante dans Supabase → Authentication → Policies :
 *   Table : properties | Operation : SELECT | Using : (liste = true)
 */

import { supabase } from './supabase';
import type { Listing } from './listings';

/** Type brut renvoyé par Supabase. */
export interface SupabaseProperty {
  id: string;
  created_at: string;
  Titre: string | null;
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
  listé: boolean | null;
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
    id: p.id, // uuid gardé comme string (compatible avec le routeur)
    title: p.Titre ?? 'Bien immobilier',
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
    // Champs non présents dans Supabase → valeurs par défaut
    history: '',
    legalStatus: '',
    features: [],
    locationHighlights: [],
    featured: p.listé ?? false,
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
    .eq('listé', true)
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
