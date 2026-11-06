/**
 * use-listings.ts
 *
 * Hook React sécurisé pour charger les annonces depuis Supabase
 * avec fallback immédiat sur les annonces statiques LISTINGS.
 */

import { useEffect, useState } from 'react';
import { fetchProperties } from '@/lib/supabase-properties';
import { LISTINGS, type Listing } from '@/lib/listings';

export type UseListingsResult = {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  fromSupabase: boolean;
};

export function useListings(): UseListingsResult {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromSupabase, setFromSupabase] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await fetchProperties();

        if (cancelled) return;

        if (fetchError) {
          // Erreur réseau ou Supabase : conserver les données statiques
          setListings(LISTINGS);
          setFromSupabase(false);
          setError(fetchError);
        } else if (data.length === 0) {
          // Table vide ou non configurée : conserver les données statiques
          setListings(LISTINGS);
          setFromSupabase(false);
        } else {
          setListings(data);
          setFromSupabase(true);
        }
      } catch (err) {
        if (!cancelled) {
          setListings(LISTINGS);
          setFromSupabase(false);
          setError(String(err));
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
