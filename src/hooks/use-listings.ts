/**
 * useListings.ts
 *
 * Hook React qui charge les annonces depuis Supabase.
 * Si Supabase est inaccessible ou ne retourne rien (ex: RLS sans politique),
 * il bascule automatiquement sur les données statiques LISTINGS.
 */

import { useEffect, useState } from 'react';
import { fetchProperties } from '@/lib/supabase-properties';
import { LISTINGS, type Listing } from '@/lib/listings';

export type UseListingsResult = {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  /** true si les données viennent de Supabase, false si données statiques */
  fromSupabase: boolean;
};

export function useListings(): UseListingsResult {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromSupabase, setFromSupabase] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchProperties();

      if (cancelled) return;

      if (fetchError) {
        // Erreur réseau ou Supabase → fallback données statiques
        console.warn('[useListings] Supabase error, using static data:', fetchError);
        setListings(LISTINGS);
        setFromSupabase(false);
        setError(fetchError);
      } else if (data.length === 0) {
        // RLS sans politique ou table vide → fallback données statiques
        console.warn('[useListings] Supabase returned 0 results (RLS policy missing?), using static data');
        setListings(LISTINGS);
        setFromSupabase(false);
      } else {
        setListings(data);
        setFromSupabase(true);
      }

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { listings, loading, error, fromSupabase };
}
