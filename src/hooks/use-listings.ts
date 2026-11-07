/**
 * use-listings.ts
 *
 * Hook React pour charger les annonces exclusivement depuis la base de données Supabase.
 * Aucune annonce fictive ou hors base de données n'est affichée.
 */

import { useEffect, useState } from 'react';
import { fetchProperties } from '@/lib/supabase-properties';
import type { Listing } from '@/lib/listings';

export type UseListingsResult = {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  fromSupabase: boolean;
};

// Cache en mémoire pour éviter les re-fetchs inutiles entre pages
let cachedListings: Listing[] | null = null;

export function useListings(): UseListingsResult {
  const [listings, setListings] = useState<Listing[]>(cachedListings ?? []);
  const [loading, setLoading] = useState<boolean>(!cachedListings);
  const [error, setError] = useState<string | null>(null);
  const [fromSupabase, setFromSupabase] = useState<boolean>(!!cachedListings);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!cachedListings) {
        setLoading(true);
      }
      setError(null);

      try {
        const { data, error: fetchError } = await fetchProperties();

        if (cancelled) return;

        if (fetchError) {
          setError(fetchError);
          // Si nous n'avions pas de cache, la liste reste vide (aucune annonce hors base de données)
          if (!cachedListings) {
            setListings([]);
            setFromSupabase(false);
          }
        } else {
          cachedListings = data;
          setListings(data);
          setFromSupabase(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(String(err));
          if (!cachedListings) {
            setListings([]);
            setFromSupabase(false);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { listings, loading, error, fromSupabase };
}
