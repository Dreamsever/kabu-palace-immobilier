/**
 * supabase-properties.ts
 *
 * Couche d'accès sécurisée à la table `properties` de Supabase.
 * Tolérante aux erreurs et variations de casse des colonnes (titre/Titre, liste/listé).
 */

import { supabase } from './supabase';
import type { Listing } from './listings';

export interface SupabaseProperty {
  id: string;
  created_at?: string;
  titre?: string | null;
  Titre?: string | null;
  categorie?: string | null;
  type?: string | null;
  district?: string | null;
  quartier?: string | null;
  prix?: number | null;
  monnaie?: string | null;
  chambres?: number | null;
  salles_de_bain?: number | null;
  surface?: number | null;
  description?: string | null;
  images?: string | null;
  status?: string | null;
  liste?: boolean | null;
  listé?: boolean | null;
}

function parseImages(raw: string | null | undefined): string[] {
  if (!raw || raw === 'array[]::text[]' || raw.trim() === '{}') return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    if (raw.startsWith('{') && raw.endsWith('}')) {
      return raw
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
    }
    if (raw.startsWith('http')) return [raw];
  }
  return [];
}

export function mapPropertyToListing(p: SupabaseProperty): Listing {
  const images = parseImages(p.images);
  const img = images[0] ?? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75';

  const rawMode = (p.categorie ?? '').toLowerCase();
  const mode: 'Acheter' | 'Louer' = rawMode.includes('lou') ? 'Louer' : 'Acheter';

  const statusMap: Record<string, string> = {
    disponible: 'Disponible',
    vendu: 'Vendu',
    loué: 'Loué',
    'sous compromis': 'Sous compromis',
    réservé: 'Réservé',
  };
  const availability =
    statusMap[(p.status ?? '').toLowerCase()] ?? (p.status ?? 'Disponible');

  const title = p.titre ?? p.Titre ?? 'Bien immobilier';
  const quartier = p.district ?? p.quartier ?? 'Kinshasa';
  const isListed = p.liste ?? p.listé ?? true;

  return {
    id: p.id,
    title,
    quartier,
    type: p.type ?? 'Villa',
    mode,
    price: p.prix ? Number(p.prix) : 0,
    beds: p.chambres ? Number(p.chambres) : 0,
    baths: p.salles_de_bain ? Number(p.salles_de_bain) : 0,
    area: p.surface ? Number(p.surface) : 0,
    img,
    gallery: images.length > 0 ? images : [img],
    availability,
    description: p.description ?? '',
    history: '',
    legalStatus: '',
    features: [],
    locationHighlights: [],
    featured: isListed,
  };
}

export interface FetchResult<T> {
  data: T[];
  error: string | null;
}

export async function fetchProperties(): Promise<FetchResult<Listing>> {
  if (!supabase) {
    return { data: [], error: 'Supabase client non configuré' };
  }

  try {
    // Essai 1 : avec filtre `liste = true`
    let query = supabase.from('properties').select('*').order('created_at', { ascending: false });

    const resWithFilter = await query.eq('liste', true);
    if (!resWithFilter.error && resWithFilter.data && resWithFilter.data.length > 0) {
      return {
        data: (resWithFilter.data as SupabaseProperty[]).map(mapPropertyToListing),
        error: null,
      };
    }

    // Essai 2 : si aucun résultat ou colonne `liste` inexistante, sélectionne tout
    const resAll = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (resAll.error) {
      console.warn('[Supabase] fetchProperties error:', resAll.error.message);
      return { data: [], error: resAll.error.message };
    }

    const items = (resAll.data ?? []) as SupabaseProperty[];
    // Filtrer côté client si le flag existe
    const filtered = items.filter((p) => (p.liste !== false && p.listé !== false));

    return {
      data: (filtered.length > 0 ? filtered : items).map(mapPropertyToListing),
      error: null,
    };
  } catch (err) {
    console.warn('[Supabase] fetchProperties exception:', err);
    return { data: [], error: String(err) };
  }
}

export async function fetchPropertyById(
  id: string,
): Promise<{ data: Listing | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Supabase client non configuré' };
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] fetchPropertyById error:', error.message);
      return { data: null, error: error.message };
    }

    if (!data) return { data: null, error: null };

    return { data: mapPropertyToListing(data as SupabaseProperty), error: null };
  } catch (err) {
    console.warn('[Supabase] fetchPropertyById exception:', err);
    return { data: null, error: String(err) };
  }
}
