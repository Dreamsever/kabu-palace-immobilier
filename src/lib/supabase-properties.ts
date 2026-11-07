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
  updated_at?: string;
  titre?: string | null;
  Titre?: string | null;
  description?: string | null;
  categorie?: string | null;
  type?: string | null;
  district?: string | null;
  commune?: string | null;
  adresse?: string | null;
  quartier?: string | null;
  prix?: number | null;
  monnaie?: string | null;
  prix_negociable?: boolean | null;
  surface?: number | null;
  surface_terrain?: number | null;
  chambres?: number | null;
  salles_de_bain?: number | null;
  annee_construction?: number | null;
  statut_juridique?: string | null;
  disponibilite?: string | null;
  status?: string | null;
  images?: string | null;
  atouts?: string[] | string | null;
  points_forts?: string[] | string | null;
  liste?: boolean | null;
  listé?: boolean | null;
  vedette?: boolean | null;
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

function parseArray(raw: string[] | string | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string') {
    if (raw.trim() === '{}' || raw.trim() === '[]') return [];
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
    }
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
    p.disponibilite ??
    statusMap[(p.status ?? '').toLowerCase()] ??
    (p.status ?? 'Disponible');

  const title = p.titre ?? p.Titre ?? 'Bien immobilier';
  const commune = p.commune ?? p.district ?? p.quartier ?? 'Kinshasa';
  const quartier = p.district ?? p.quartier ?? commune;
  const isListed = p.liste ?? p.listé ?? true;
  const isFeatured = p.vedette ?? isListed;

  return {
    id: p.id,
    title,
    quartier,
    commune,
    address: p.adresse ?? `${quartier}, Kinshasa`,
    type: p.type ?? 'Villa',
    mode,
    price: p.prix ? Number(p.prix) : 0,
    beds: p.chambres ? Number(p.chambres) : 0,
    baths: p.salles_de_bain ? Number(p.salles_de_bain) : 0,
    area: p.surface ? Number(p.surface) : 0,
    landArea: p.surface_terrain ? Number(p.surface_terrain) : undefined,
    yearBuilt: p.annee_construction ? Number(p.annee_construction) : undefined,
    img,
    gallery: images.length > 0 ? images : [img],
    availability,
    description: p.description ?? '',
    history: p.description ?? '',
    legalStatus: p.statut_juridique ?? 'Certificat d\'enregistrement en cours',
    features: parseArray(p.atouts),
    locationHighlights: parseArray(p.points_forts),
    featured: isFeatured,
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

// Mappage de compatibilité pour les identifiants numériques historiques vers leurs UUIDs Supabase
const LEGACY_ID_MAP: Record<string, string> = {
  '1': '75313570-3c29-418e-a8b6-80aa55992eef',
  '2': '520232da-1c15-41de-bfd9-0bf174b89776',
  '3': '11e38468-8154-42fc-8979-18a85c5f4dbd',
  '4': '00000000-0000-0000-0000-000000000004',
  '5': '00000000-0000-0000-0000-000000000005',
  '6': '00000000-0000-0000-0000-000000000006',
  '7': '00000000-0000-0000-0000-000000000007',
  '8': '00000000-0000-0000-0000-000000000008',
  '9': '00000000-0000-0000-0000-000000000009',
  '10': '00000000-0000-0000-0000-000000000010',
  '11': '00000000-0000-0000-0000-000000000011',
  '12': '00000000-0000-0000-0000-000000000012',
  '13': '00000000-0000-0000-0000-000000000013',
  '14': '00000000-0000-0000-0000-000000000014',
  '15': '00000000-0000-0000-0000-000000000015',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function fetchPropertyById(
  id: string,
): Promise<{ data: Listing | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Supabase client non configuré' };
  }

  // Résoudre les anciens identifiants numériques vers leur UUID en base
  const resolvedId = LEGACY_ID_MAP[id] ?? (id.match(/^\d+$/) ? `00000000-0000-0000-0000-${id.padStart(12, '0')}` : id);

  // Si ce n'est pas un UUID valide, pas la peine d'envoyer une requête invalide à Postgres
  if (!UUID_REGEX.test(resolvedId)) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', resolvedId)
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
