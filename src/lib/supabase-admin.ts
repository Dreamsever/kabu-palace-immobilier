import { supabase } from './supabase';
import type { SupabaseProperty } from './supabase-properties';

export interface PropertyFormData {
  titre: string;
  description: string;
  categorie: 'Acheter' | 'Louer';
  type: string;
  district: string;
  commune: string;
  adresse: string;
  prix: number;
  monnaie: string;
  prix_negociable: boolean;
  surface: number;
  surface_terrain?: number;
  chambres: number;
  salles_de_bain: number;
  annee_construction?: number;
  statut_juridique: string;
  disponibilite: string;
  status: string;
  images: string[];
  videos?: string[];
  atouts: string[];
  points_forts: string[];
  liste: boolean;
  vedette: boolean;
}

export interface SellerLead {
  id: string;
  created_at: string;
  nom: string;
  telephone: string;
  email?: string;
  type_bien: string;
  district: string;
  adresse?: string;
  prix_souhaite?: number;
  chambres?: number;
  salles_de_bain?: number;
  surface?: number;
  titre_foncier?: string;
  statut_dossier: string;
}

// 1. Authentification
export async function adminLogin(email: string, password: string) {
  if (!supabase) throw new Error('Client Supabase non initialisé');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function adminLogout() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getAdminUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// 2. Gestion des annonces
export async function fetchAllPropertiesForAdmin(): Promise<SupabaseProperty[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur chargement annonces admin:', error.message);
    throw error;
  }
  return (data ?? []) as SupabaseProperty[];
}

export async function createProperty(payload: PropertyFormData) {
  if (!supabase) throw new Error('Client Supabase non initialisé');

  const row = {
    titre: payload.titre,
    description: payload.description,
    categorie: payload.categorie,
    type: payload.type,
    district: payload.district,
    commune: payload.commune || payload.district,
    adresse: payload.adresse,
    prix: Number(payload.prix) || 0,
    monnaie: payload.monnaie || 'USD',
    prix_negociable: payload.prix_negociable ?? true,
    surface: Number(payload.surface) || 0,
    surface_terrain: payload.surface_terrain ? Number(payload.surface_terrain) : null,
    chambres: Number(payload.chambres) || 0,
    salles_de_bain: Number(payload.salles_de_bain) || 0,
    annee_construction: payload.annee_construction ? Number(payload.annee_construction) : null,
    statut_juridique: payload.statut_juridique,
    disponibilite: payload.disponibilite || 'Disponible',
    status: payload.status || 'disponible',
    images: JSON.stringify([
      ...(payload.images || []).filter(Boolean),
      ...(payload.videos || []).filter(Boolean).map((v) => (v.startsWith('video:') ? v : `video:${v}`)),
    ]),
    atouts: payload.atouts.filter(Boolean),
    points_forts: payload.points_forts.filter(Boolean),
    liste: payload.liste ?? true,
    vedette: payload.vedette ?? false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('properties').insert([row]).select().single();
  if (error) throw error;
  return data;
}

export async function updateProperty(id: string, payload: Partial<PropertyFormData>) {
  if (!supabase) throw new Error('Client Supabase non initialisé');

  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (payload.titre !== undefined) row.titre = payload.titre;
  if (payload.description !== undefined) row.description = payload.description;
  if (payload.categorie !== undefined) row.categorie = payload.categorie;
  if (payload.type !== undefined) row.type = payload.type;
  if (payload.district !== undefined) row.district = payload.district;
  if (payload.commune !== undefined) row.commune = payload.commune;
  if (payload.adresse !== undefined) row.adresse = payload.adresse;
  if (payload.prix !== undefined) row.prix = Number(payload.prix);
  if (payload.monnaie !== undefined) row.monnaie = payload.monnaie;
  if (payload.prix_negociable !== undefined) row.prix_negociable = payload.prix_negociable;
  if (payload.surface !== undefined) row.surface = Number(payload.surface);
  if (payload.surface_terrain !== undefined)
    row.surface_terrain = payload.surface_terrain ? Number(payload.surface_terrain) : null;
  if (payload.chambres !== undefined) row.chambres = Number(payload.chambres);
  if (payload.salles_de_bain !== undefined) row.salles_de_bain = Number(payload.salles_de_bain);
  if (payload.annee_construction !== undefined)
    row.annee_construction = payload.annee_construction ? Number(payload.annee_construction) : null;
  if (payload.statut_juridique !== undefined) row.statut_juridique = payload.statut_juridique;
  if (payload.disponibilite !== undefined) row.disponibilite = payload.disponibilite;
  if (payload.status !== undefined) row.status = payload.status;
  if (payload.images !== undefined || payload.videos !== undefined) {
    const imgs = (payload.images || []).filter(Boolean);
    const vids = (payload.videos || []).filter(Boolean).map((v) => (v.startsWith('video:') ? v : `video:${v}`));
    row.images = JSON.stringify([...imgs, ...vids]);
  }
  if (payload.atouts !== undefined) row.atouts = payload.atouts.filter(Boolean);
  if (payload.points_forts !== undefined) row.points_forts = payload.points_forts.filter(Boolean);
  if (payload.liste !== undefined) row.liste = payload.liste;
  if (payload.vedette !== undefined) row.vedette = payload.vedette;

  const { data, error } = await supabase.from('properties').update(row).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProperty(id: string) {
  if (!supabase) throw new Error('Client Supabase non initialisé');
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function togglePropertyVisibility(id: string, currentStatus: boolean) {
  return updateProperty(id, { liste: !currentStatus });
}

export async function togglePropertyVedette(id: string, currentVedette: boolean) {
  return updateProperty(id, { vedette: !currentVedette });
}

export async function updatePropertyAvailability(id: string, newAvailability: string) {
  return updateProperty(id, {
    disponibilite: newAvailability,
    status: newAvailability.toLowerCase().includes('vendu')
      ? 'vendu'
      : newAvailability.toLowerCase().includes('lou')
        ? 'loué'
        : 'disponible',
  });
}

export async function uploadPropertyImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Client Supabase non initialisé');

  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt || 'jpg'}`;
  const filePath = `properties/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    }
  } catch (err) {
    console.warn('[Storage] Upload failed, falling back to data URL:', err);
  }

  // Fallback si le bucket Storage n'a pas encore été créé dans Supabase
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export async function uploadPropertyVideo(file: File): Promise<string> {
  if (!supabase) throw new Error('Client Supabase non initialisé');

  const fileExt = file.name.split('.').pop() || 'mp4';
  const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt || 'mp4'}`;
  const filePath = `videos/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    }
  } catch (err) {
    console.warn('[Storage] Video upload failed, falling back to data URL:', err);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// 3. Leads Propriétaires (Vendre mon bien)
export async function fetchSellerLeads(): Promise<SellerLead[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('seller_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Erreur chargement seller_leads:', error.message);
    return [];
  }
  return (data ?? []) as SellerLead[];
}
