import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  EyeOff,
  Flame,
  Home,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Link2,
  LogOut,
  MapPin,
  Maximize,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { COMMUNES, PROPERTY_TYPES, fmtPrice } from "@/lib/listings";
import {
  adminLogin,
  adminLogout,
  createProperty,
  deleteProperty,
  fetchAllPropertiesForAdmin,
  fetchSellerLeads,
  getAdminUser,
  togglePropertyVedette,
  togglePropertyVisibility,
  updateProperty,
  updatePropertyAvailability,
  uploadPropertyImage,
  type PropertyFormData,
  type SellerLead,
} from "@/lib/supabase-admin";
import type { SupabaseProperty } from "@/lib/supabase-properties";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Kabu Palace SARL" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const DEFAULT_FORM: PropertyFormData = {
  titre: "",
  description: "",
  categorie: "Acheter",
  type: "Villa",
  district: "Gombe",
  commune: "Gombe",
  adresse: "",
  prix: 250000,
  monnaie: "USD",
  prix_negociable: true,
  surface: 350,
  surface_terrain: 600,
  chambres: 4,
  salles_de_bain: 3,
  annee_construction: 2022,
  statut_juridique: "Certificat d'enregistrement en ordre",
  disponibilite: "Immédiate",
  status: "disponible",
  images: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75",
  ],
  atouts: ["Groupe électrogène", "Forage d'eau", "Guérite de sécurité", "Climatisation"],
  points_forts: ["Accès goudronné", "Zone résidentielle calme et sécurisée"],
  liste: true,
  vedette: false,
};

const COMMON_ATOUTS = [
  "Piscine privée",
  "Groupe électrogène",
  "Forage d'eau",
  "Guérite de sécurité",
  "Climatisation centrale",
  "Installation solaire",
  "Parking fermé",
  "Jardin arboré",
  "Fibre optique",
  "Ascenseur",
  "Terrasse panoramique",
  "Dépendance personnel",
];

const COMMON_POINTS_FORTS = [
  "À 3 minutes du Boulevard du 30 Juin",
  "Proximité immédiate des ambassades et écoles",
  "Zone hautement sécurisée avec patrouilles",
  "Accès goudronné et éclairage public",
  "Vue panoramique sur le fleuve Congo",
  "Quartier résidentiel calme et verdoyant",
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"annonces" | "nouveau" | "leads">("annonces");
  const [properties, setProperties] = useState<SupabaseProperty[]>([]);
  const [sellerLeads, setSellerLeads] = useState<SellerLead[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Search & filter in listings
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"Tous" | "Acheter" | "Louer">("Tous");

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(DEFAULT_FORM);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [multiUrlInput, setMultiUrlInput] = useState("");
  const [photoMethod, setPhotoMethod] = useState<"upload" | "multi" | "single">("upload");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [customAtout, setCustomAtout] = useState("");
  const [customPointFort, setCustomPointFort] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Gestion du téléversement de fichiers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    setUploadProgressText(`Téléversement de ${files.length} photo(s)…`);

    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          setUploadProgressText(`Téléversement de la photo ${i + 1}/${files.length}…`);
          const url = await uploadPropertyImage(file);
          if (url) uploadedUrls.push(url);
        }
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      showNotification(`${uploadedUrls.length} photo(s) téléversée(s) avec succès !`);
    } catch (err) {
      alert("Erreur lors du téléversement : " + String(err));
    } finally {
      setUploadingFiles(false);
      setUploadProgressText("");
    }
  };

  // Gestion des URLs multiples (séparées par des virgules, retours à la ligne ou espaces)
  const handleAddMultipleUrls = () => {
    if (!multiUrlInput.trim()) return;

    // Découpage automatique par : retours à la ligne, virgules, points-virgules ou espaces
    const urls = multiUrlInput
      .split(/[\n,;\s]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:image"));

    if (urls.length === 0) {
      alert("Aucune URL valide trouvée. Les URLs doivent commencer par http:// ou https://");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
    setMultiUrlInput("");
    showNotification(`${urls.length} photo(s) ajoutée(s) à l'annonce !`);
  };

  // Définir une photo comme photo de couverture (principale)
  const handleSetCoverPhoto = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const selected = prev.images[index];
      if (!selected) return prev;
      const rest = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: [selected, ...rest],
      };
    });
    showNotification("Photo définie comme couverture principale !");
  };

  // Déplacer l'ordre d'une photo
  const handleMovePhoto = (fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= formData.images.length) return;
    setFormData((prev) => {
      const newImages = [...prev.images];
      const temp = newImages[fromIndex];
      const target = newImages[toIndex];
      if (temp !== undefined && target !== undefined) {
        newImages[fromIndex] = target;
        newImages[toIndex] = temp;
      }
      return { ...prev, images: newImages };
    });
  };

  // Check existing session
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getAdminUser();
        if (user) {
          setIsAuthenticated(true);
          setAdminEmail(user.email ?? "admin@kabupalace.cd");
        } else {
          // Check local PIN / Session
          const localAuth = localStorage.getItem("kp_admin_logged_in");
          if (localAuth === "true") {
            setIsAuthenticated(true);
            setAdminEmail(localStorage.getItem("kp_admin_email") || "admin@kabupalace.cd");
          }
        }
      } catch {
        // Fallback
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch properties and leads when logged in
  const loadData = async () => {
    setLoadingData(true);
    try {
      const [props, leads] = await Promise.all([
        fetchAllPropertiesForAdmin(),
        fetchSellerLeads(),
      ]);
      setProperties(props);
      setSellerLeads(leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    // 1. Supabase Auth attempt
    try {
      await adminLogin(loginEmail, loginPassword);
      setIsAuthenticated(true);
      setAdminEmail(loginEmail);
      localStorage.setItem("kp_admin_logged_in", "true");
      localStorage.setItem("kp_admin_email", loginEmail);
      setLoginLoading(false);
      return;
    } catch {
      // 2. Master fallback code if Supabase email confirmation is pending
      if (
        (loginEmail === "admin@kabupalace.cd" || loginEmail === "alain@kabupalace.cd" || loginEmail === "admin") &&
        (loginPassword === "KabuPalace2026!" || loginPassword === "KABU2026!" || loginPassword === "admin123")
      ) {
        setIsAuthenticated(true);
        setAdminEmail(loginEmail);
        localStorage.setItem("kp_admin_logged_in", "true");
        localStorage.setItem("kp_admin_email", loginEmail);
        setLoginLoading(false);
        return;
      }

      setLoginError("Identifiants incorrects. Veuillez vérifier votre adresse email et votre mot de passe.");
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    localStorage.removeItem("kp_admin_logged_in");
    localStorage.removeItem("kp_admin_email");
    setIsAuthenticated(false);
  };

  // Quick listing actions
  const handleToggleVisibility = async (p: SupabaseProperty) => {
    try {
      const current = p.liste !== false && p.listé !== false;
      await togglePropertyVisibility(p.id, current);
      setProperties((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, liste: !current, listé: !current } : item)),
      );
      showNotification(`Visibilité mise à jour : l'annonce est ${!current ? "en ligne" : "masquée"}.`);
    } catch (err) {
      alert("Erreur lors de la modification : " + String(err));
    }
  };

  const handleToggleVedette = async (p: SupabaseProperty) => {
    try {
      const current = !!p.vedette;
      await togglePropertyVedette(p.id, current);
      setProperties((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, vedette: !current } : item)),
      );
      showNotification(`Statut Coup de Cœur mis à jour (${!current ? "Vedette activée" : "Vedette retirée"}).`);
    } catch (err) {
      alert("Erreur lors de la modification : " + String(err));
    }
  };

  const handleUpdateAvailability = async (p: SupabaseProperty, newStatus: string) => {
    try {
      await updatePropertyAvailability(p.id, newStatus);
      setProperties((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, disponibilite: newStatus, status: newStatus.toLowerCase() } : item)),
      );
      showNotification(`Disponibilité mise à jour : ${newStatus}`);
    } catch (err) {
      alert("Erreur : " + String(err));
    }
  };

  const handleDelete = async (id: string, titre?: string | null) => {
    if (!window.confirm(`Confirmez-vous la suppression définitive de l'annonce "${titre || "Bien"}" ?`)) {
      return;
    }
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((item) => item.id !== id));
      showNotification("Annonce supprimée avec succès.");
    } catch (err) {
      alert("Erreur lors de la suppression : " + String(err));
    }
  };

  const handleEditClick = (p: SupabaseProperty) => {
    setEditingId(p.id);

    // Parse images
    let imgs: string[] = [];
    if (p.images) {
      try {
        const parsed = JSON.parse(p.images);
        if (Array.isArray(parsed)) imgs = parsed;
      } catch {
        if (p.images.startsWith("http")) imgs = [p.images];
      }
    }

    setFormData({
      titre: p.titre || p.Titre || "",
      description: p.description || "",
      categorie: (p.categorie === "Louer" ? "Louer" : "Acheter"),
      type: p.type || "Villa",
      district: p.district || "Gombe",
      commune: p.commune || p.district || "Gombe",
      adresse: p.adresse || "",
      prix: p.prix ? Number(p.prix) : 0,
      monnaie: p.monnaie || "USD",
      prix_negociable: p.prix_negociable !== false,
      surface: p.surface ? Number(p.surface) : 0,
      surface_terrain: p.surface_terrain ? Number(p.surface_terrain) : undefined,
      chambres: p.chambres ? Number(p.chambres) : 0,
      salles_de_bain: p.salles_de_bain ? Number(p.salles_de_bain) : 0,
      annee_construction: p.annee_construction ? Number(p.annee_construction) : undefined,
      statut_juridique: p.statut_juridique || "Certificat d'enregistrement",
      disponibilite: p.disponibilite || "Disponible",
      status: p.status || "disponible",
      images: imgs.length > 0 ? imgs : [DEFAULT_FORM.images[0]!],
      atouts: Array.isArray(p.atouts) ? p.atouts : [],
      points_forts: Array.isArray(p.points_forts) ? p.points_forts : [],
      liste: p.liste !== false && p.listé !== false,
      vedette: !!p.vedette,
    });
    setActiveTab("nouveau");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Form submit (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre.trim()) {
      alert("Veuillez saisir un titre pour l'annonce.");
      return;
    }

    const minPrice = formData.categorie === "Louer" ? 50 : 1000;
    if (!formData.prix || formData.prix < minPrice) {
      alert(
        formData.categorie === "Louer"
          ? `Le loyer mensuel minimum accepté est de ${minPrice} $ USD / mois (vous avez saisi : ${formData.prix || 0} $).`
          : `Le prix d'acquisition minimum accepté est de ${minPrice.toLocaleString("fr-FR")} $ USD (vous avez saisi : ${formData.prix || 0} $).`
      );
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateProperty(editingId, formData);
        showNotification("Annonce mise à jour avec succès dans la base de données !");
      } else {
        await createProperty(formData);
        showNotification("Nouvelle annonce publiée avec succès sur le site !");
      }
      await loadData();
      setEditingId(null);
      setFormData(DEFAULT_FORM);
      setActiveTab("annonces");
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + String(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const title = (p.titre || p.Titre || "").toLowerCase();
      const district = (p.district || p.commune || "").toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        title.includes(searchQuery.toLowerCase()) ||
        district.includes(searchQuery.toLowerCase());
      const matchesMode =
        filterMode === "Tous" ||
        (filterMode === "Louer" && (p.categorie || "").toLowerCase().includes("lou")) ||
        (filterMode === "Acheter" && !(p.categorie || "").toLowerCase().includes("lou"));
      return matchesSearch && matchesMode;
    });
  }, [properties, searchQuery, filterMode]);

  // Statistics
  const stats = useMemo(() => {
    const total = properties.length;
    const online = properties.filter((p) => p.liste !== false && p.listé !== false).length;
    const vedettes = properties.filter((p) => p.vedette).length;
    const louer = properties.filter((p) => (p.categorie || "").toLowerCase().includes("lou")).length;
    const acheter = total - louer;
    return { total, online, vedettes, louer, acheter, leads: sellerLeads.length };
  }, [properties, sellerLeads]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 grid place-items-center text-ivory">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="h-8 w-8 text-gold animate-spin" />
          <p className="text-sm font-semibold">Vérification des droits d'accès…</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-navy to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-card/95 p-8 shadow-2xl backdrop-blur">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient p-2.5 shadow-lg">
              <KeyRound className="h-7 w-7 text-navy" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-navy">
              KABU PALACE SARL
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-bold mt-1">
              Portail d'Administration
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Connectez-vous pour ajouter, modifier et gérer les annonces immobilières en direct.
            </p>
          </div>

          {loginError && (
            <div className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive font-medium flex items-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Adresse Email
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@kabupalace.cd"
                className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Mot de Passe
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient font-bold text-gold-foreground shadow-gold transition hover:brightness-105 active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Connexion en cours…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Accéder au tableau de bord
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/80 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-gold transition inline-flex items-center gap-1 font-medium"
            >
              ← Retour au site public
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 items-center justify-center rounded-lg bg-white p-1">
                <img src="/logo.jpg" alt="Kabu Palace" className="h-6 w-auto object-contain" />
              </div>
              <span className="leading-tight">
                <span className="block font-display text-lg font-bold text-ivory">
                  Kabu Palace
                </span>
                <span className="block text-[9px] tracking-[0.25em] text-gold font-bold">
                  ADMINISTRATION
                </span>
              </span>
            </Link>

            <span className="hidden sm:inline-flex rounded-full bg-gold/15 px-3 py-0.5 text-[11px] font-bold text-gold">
              Base Supabase Connectée
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs text-ivory/70">
              Connecté : <strong className="text-ivory">{adminEmail}</strong>
            </span>
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10 transition"
            >
              <Eye className="h-3.5 w-3.5" /> Voir le site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/15 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/25 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <Check className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto max-w-7xl w-full flex-1 px-4 py-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 mb-8">
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Annonces
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-navy">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              En Ligne
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{stats.online}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Coups de Cœur
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-gold">{stats.vedettes}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              À Vendre
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-navy">{stats.acheter}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              À Louer
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-navy">{stats.louer}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Leads Propriétaires
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-gold">{stats.leads}</p>
          </div>
        </div>

        {/* Navigation Tabs & Main Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("annonces");
                setEditingId(null);
              }}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "annonces"
                  ? "bg-navy text-gold shadow-md"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              📋 Gestion des Annonces ({properties.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("nouveau");
                if (!editingId) setFormData(DEFAULT_FORM);
              }}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "nouveau"
                  ? "bg-gold-gradient text-gold-foreground shadow-gold"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              {editingId ? "Modifier l'annonce" : "Nouvelle Annonce"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "leads"
                  ? "bg-navy text-gold shadow-md"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Leads Vendeurs ({sellerLeads.length})
            </button>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loadingData}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
            Actualiser les données
          </button>
        </div>

        {/* TAB 1: GESTION DES ANNONCES */}
        {activeTab === "annonces" && (
          <div className="space-y-6">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou commune…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {(["Tous", "Acheter", "Louer"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilterMode(mode)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      filterMode === mode
                        ? "bg-navy text-gold"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode === "Tous" ? "Toutes" : mode === "Acheter" ? "Ventes" : "Locations"}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Table / Cards */}
            {filteredProperties.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
                <p className="font-display text-lg font-bold text-navy">Aucune annonce trouvée</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Créez votre première annonce en cliquant sur « Nouvelle Annonce » ci-dessus.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProperties.map((p) => {
                  const title = p.titre || p.Titre || "Bien immobilier";
                  const district = p.district || p.commune || "Kinshasa";
                  const price = p.prix ? Number(p.prix) : 0;
                  const isOnline = p.liste !== false && p.listé !== false;
                  const isVedette = !!p.vedette;

                  // Parse thumbnail
                  let thumb =
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=75";
                  if (p.images) {
                    try {
                      const parsed = JSON.parse(p.images);
                      if (Array.isArray(parsed) && parsed[0]) thumb = parsed[0];
                    } catch {
                      if (p.images.startsWith("http")) thumb = p.images;
                    }
                  }

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 transition hover:border-gold/50 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={thumb}
                          alt={title}
                          className="h-20 w-24 rounded-xl object-cover shrink-0 bg-muted"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-gold">
                              {p.categorie === "Louer" ? "Location" : "Vente"}
                            </span>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              {p.type || "Villa"}
                            </span>
                            {isVedette && (
                              <span className="rounded-full bg-gold/20 text-gold-foreground px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                                <Flame className="h-3 w-3 text-gold" /> Vedette
                              </span>
                            )}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isOnline
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : "bg-slate-500/15 text-slate-500"
                              }`}
                            >
                              {isOnline ? "● En ligne" : "○ Masqué"}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm md:text-base text-navy line-clamp-1">
                            {title}
                          </h3>

                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                            <span>{p.adresse || district}</span>
                            <span>·</span>
                            <strong className="text-gold font-bold">
                              {fmtPrice(price)} $ {p.categorie === "Louer" ? "/ mois" : ""}
                            </strong>
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                        {/* Statut disponibilité dropdown */}
                        <select
                          value={p.disponibilite || "Disponible"}
                          onChange={(e) => handleUpdateAvailability(p, e.target.value)}
                          className="h-9 rounded-lg border border-input bg-card px-2.5 text-xs font-semibold text-foreground outline-none"
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="Sous compromis">Sous compromis</option>
                          <option value="Vendu">Vendu</option>
                          <option value="Loué">Loué</option>
                        </select>

                        {/* Toggle Vedette */}
                        <button
                          type="button"
                          onClick={() => handleToggleVedette(p)}
                          title="Mettre en coup de cœur"
                          className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
                            isVedette
                              ? "border-gold bg-gold/20 text-gold shadow-sm"
                              : "border-border text-muted-foreground hover:text-gold"
                          }`}
                        >
                          <Star className={`h-4 w-4 ${isVedette ? "fill-gold text-gold" : ""}`} />
                        </button>

                        {/* Toggle En ligne / Masqué */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(p)}
                          title={isOnline ? "Masquer du site" : "Publier sur le site"}
                          className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
                            isOnline
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {isOnline ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>

                        {/* Modifier */}
                        <button
                          type="button"
                          onClick={() => handleEditClick(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-navy hover:bg-muted transition"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-gold" /> Modifier
                        </button>

                        {/* Supprimer */}
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.titre)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AJOUTER / MODIFIER UNE ANNONCE */}
        {activeTab === "nouveau" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-card">
            <div className="mb-6 pb-4 border-b border-border/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
                  {editingId ? "Mise à jour" : "Formulaire de publication"}
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-navy">
                  {editingId ? "Modifier l'annonce immobilière" : "Ajouter une nouvelle annonce"}
                </h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(DEFAULT_FORM);
                    setActiveTab("annonces");
                  }}
                  className="text-xs font-bold text-muted-foreground hover:text-navy"
                >
                  Annuler la modification
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              {/* Informations principales */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Titre de l'annonce *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Superbe villa contemporaine avec piscine à Gombe"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Catégorie (Transaction) *
                  </label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => {
                      const newCat = e.target.value as "Acheter" | "Louer";
                      setFormData((prev) => {
                        let newPrice = prev.prix;
                        if (newCat === "Louer" && prev.prix > 50000) {
                          newPrice = 3500;
                        } else if (newCat === "Acheter" && prev.prix < 10000) {
                          newPrice = 250000;
                        }
                        return {
                          ...prev,
                          categorie: newCat,
                          prix: newPrice,
                        };
                      });
                    }}
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold font-semibold"
                  >
                    <option value="Acheter">Acheter (Vente)</option>
                    <option value="Louer">Louer (Location)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Type de bien *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Commune à Kinshasa *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        district: e.target.value,
                        commune: e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  >
                    {COMMUNES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Adresse précise
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Avenue de la Justice, Quartier Diplomatique"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {formData.categorie === "Louer" ? "Loyer mensuel ($ USD / mois) *" : "Prix d'acquisition ($ USD) *"}
                    </label>
                    <span className="text-[10px] font-bold text-gold px-1.5 py-0.5 rounded bg-gold/10">
                      Min : {formData.categorie === "Louer" ? "50 $" : "1 000 $"}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={formData.categorie === "Louer" ? 50 : 1000}
                      step="any"
                      required
                      placeholder={formData.categorie === "Louer" ? "Ex: 1500, 2200, 5500..." : "Ex: 180000, 250000..."}
                      value={formData.prix === 0 ? "" : formData.prix}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, prix: val === "" ? 0 : Number(val) });
                      }}
                      className="h-12 w-full rounded-xl border border-input bg-card px-4 pr-12 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold font-bold text-gold"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-bold text-muted-foreground">
                      {formData.categorie === "Louer" ? "$/m" : "$"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {formData.categorie === "Louer"
                      ? "Tous les montants à partir de 50 $ sont acceptés (ex : 5 500 $, 2 200 $, etc.)."
                      : "Tous les montants à partir de 1 000 $ sont acceptés (ex : 180 000 $, 250 000 $, etc.)."}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-muted-foreground font-medium">Suggestions :</span>
                    {(formData.categorie === "Louer"
                      ? [1500, 2200, 3500, 4500, 5500, 8000]
                      : [180000, 250000, 390000, 520000, 850000]
                    ).map((montant) => (
                      <button
                        key={montant}
                        type="button"
                        onClick={() => setFormData({ ...formData, prix: montant })}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground hover:bg-gold/20 hover:text-gold transition"
                      >
                        {montant.toLocaleString("fr-FR")} $
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Surfaces & Pièces */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 pt-4 border-t border-border/80">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Surface Bâtie (m²)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: Number(e.target.value) })}
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Terrain (m²)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Optionnel"
                    value={formData.surface_terrain || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        surface_terrain: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Chambres
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.chambres}
                    onChange={(e) => setFormData({ ...formData, chambres: Number(e.target.value) })}
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Salles de bain
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.salles_de_bain}
                    onChange={(e) =>
                      setFormData({ ...formData, salles_de_bain: Number(e.target.value) })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Année construction
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 2023"
                    value={formData.annee_construction || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        annee_construction: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Statut juridique & Disponibilité */}
              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-border/80">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Statut Juridique (Titre Foncier)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Certificat d'enregistrement définitif sans hypothèque"
                    value={formData.statut_juridique}
                    onChange={(e) => setFormData({ ...formData, statut_juridique: e.target.value })}
                    className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Disponibilité du bien
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Immédiate — Libre de tout occupant"
                    value={formData.disponibilite}
                    onChange={(e) => setFormData({ ...formData, disponibilite: e.target.value })}
                    className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Photos / Images - Système complet d'upload & URLs multiples */}
              <div className="pt-5 border-t border-border/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                      Photos du bien ({formData.images.length} photo{formData.images.length > 1 ? "s" : ""})
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      La première photo de la liste sera utilisée comme <strong>photo principale de couverture</strong>.
                    </p>
                  </div>

                  {/* Méthode d'ajout */}
                  <div className="flex items-center gap-1.5 rounded-xl bg-muted p-1">
                    <button
                      type="button"
                      onClick={() => setPhotoMethod("upload")}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition ${
                        photoMethod === "upload"
                          ? "bg-navy text-gold shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5" /> Uploader des fichiers
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoMethod("multi")}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition ${
                        photoMethod === "multi"
                          ? "bg-navy text-gold shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Link2 className="h-3.5 w-3.5" /> Coller plusieurs URLs
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoMethod("single")}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition ${
                        photoMethod === "single"
                          ? "bg-navy text-gold shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" /> 1 par 1
                    </button>
                  </div>
                </div>

                {/* MÉTHODE 1 : UPLOAD DEPUIS SMARTPHONE OU PC */}
                {photoMethod === "upload" && (
                  <div className="rounded-2xl border-2 border-dashed border-gold/40 bg-gold/5 p-6 text-center hover:bg-gold/10 transition">
                    <label className="cursor-pointer flex flex-col items-center">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-gold-foreground mb-3 shadow-md">
                        <Upload className={`h-6 w-6 ${uploadingFiles ? "animate-bounce" : ""}`} />
                      </div>
                      <span className="text-sm font-bold text-navy">
                        {uploadingFiles ? uploadProgressText : "Cliquez ici pour sélectionner vos photos ou glissez-les ici"}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Formats acceptés : JPG, PNG, WEBP · Vous pouvez sélectionner plusieurs photos en même temps
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadingFiles}
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* MÉTHODE 2 : COLLER PLUSIEURS URLS (séparation par retour à la ligne ou virgule) */}
                {photoMethod === "multi" && (
                  <div className="space-y-2 rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        Collez vos liens d'images (une par ligne ou séparées par des virgules) :
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Ex: https://image1.jpg, https://image2.jpg
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder={`https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2...\nou séparées par des virgules`}
                      value={multiUrlInput}
                      onChange={(e) => setMultiUrlInput(e.target.value)}
                      className="w-full rounded-xl border border-input bg-card p-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-gold font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddMultipleUrls}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-gold-foreground shadow-sm hover:brightness-105 transition"
                    >
                      <Plus className="h-3.5 w-3.5" /> Extraire et ajouter ces photos
                    </button>
                  </div>
                )}

                {/* MÉTHODE 3 : 1 PAR 1 */}
                {photoMethod === "single" && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Coller l'URL d'une photo (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="h-11 flex-1 rounded-xl border border-input bg-card px-4 text-xs text-foreground outline-none focus:ring-2 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newImageUrl.trim()) {
                          setFormData({
                            ...formData,
                            images: [...formData.images, newImageUrl.trim()],
                          });
                          setNewImageUrl("");
                        }
                      }}
                      className="rounded-xl bg-navy px-4 text-xs font-bold text-gold hover:opacity-90 transition"
                    >
                      Ajouter
                    </button>
                  </div>
                )}

                {/* Galerie des photos ajoutées avec gestion de la couverture et ordre */}
                {formData.images.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Cliquez sur l'étoile ★ pour définir la photo principale de couverture</span>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, images: [] })}
                          className="text-destructive hover:underline text-[11px]"
                        >
                          Tout retirer
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {formData.images.map((img, index) => {
                        const isMain = index === 0;
                        return (
                          <div
                            key={img + index}
                            className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition group shadow-sm bg-muted ${
                              isMain ? "border-gold ring-2 ring-gold/20" : "border-border hover:border-gold/40"
                            }`}
                          >
                            <img src={img} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />

                            {/* Badge Couverture */}
                            <div className="absolute top-1.5 left-1.5">
                              {isMain ? (
                                <span className="rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold text-gold-foreground shadow flex items-center gap-0.5">
                                  ★ Principale
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverPhoto(index)}
                                  className="rounded-full bg-navy/80 hover:bg-gold hover:text-gold-foreground text-ivory px-1.5 py-0.5 text-[9px] font-semibold backdrop-blur transition opacity-0 group-hover:opacity-100"
                                  title="Définir comme photo de couverture"
                                >
                                  ★ En couverture
                                </button>
                              )}
                            </div>

                            {/* Boutons d'actions rapides (déplacer, supprimer) */}
                            <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-90 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    images: formData.images.filter((_, i) => i !== index),
                                  })
                                }
                                className="grid h-5 w-5 place-items-center rounded-full bg-destructive text-white shadow hover:scale-110 transition"
                                title="Supprimer cette photo"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Flèches pour réorganiser l'ordre */}
                            {formData.images.length > 1 && (
                              <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/60 backdrop-blur rounded-lg px-1 py-0.5 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMovePhoto(index, "left")}
                                  className="text-white hover:text-gold disabled:opacity-30 text-[10px]"
                                  title="Déplacer vers la gauche"
                                >
                                  ◀
                                </button>
                                <span className="text-[9px] text-white font-mono">#{index + 1}</span>
                                <button
                                  type="button"
                                  disabled={index === formData.images.length - 1}
                                  onClick={() => handleMovePhoto(index, "right")}
                                  className="text-white hover:text-gold disabled:opacity-30 text-[10px]"
                                  title="Déplacer vers la droite"
                                >
                                  ▶
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Atouts & Équipements */}
              <div className="pt-4 border-t border-border/80 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Équipements & Prestations (Sélectionnez ou ajoutez)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ATOUTS.map((atout) => {
                    const isSelected = formData.atouts.includes(atout);
                    return (
                      <button
                        key={atout}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            atouts: isSelected
                              ? formData.atouts.filter((a) => a !== atout)
                              : [...formData.atouts, atout],
                          });
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          isSelected
                            ? "bg-navy text-gold shadow-sm"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {atout}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Ajouter un autre équipement sur mesure…"
                    value={customAtout}
                    onChange={(e) => setCustomAtout(e.target.value)}
                    className="h-10 flex-1 rounded-xl border border-input bg-card px-3 text-xs text-foreground outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAtout.trim()) {
                        setFormData({
                          ...formData,
                          atouts: [...formData.atouts, customAtout.trim()],
                        });
                        setCustomAtout("");
                      }
                    }}
                    className="rounded-xl border border-border px-3 text-xs font-bold text-navy hover:bg-muted"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Points forts de localisation */}
              <div className="pt-4 border-t border-border/80 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Atouts de localisation (Kinshasa)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_POINTS_FORTS.map((pt) => {
                    const isSelected = formData.points_forts.includes(pt);
                    return (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            points_forts: isSelected
                              ? formData.points_forts.filter((p) => p !== pt)
                              : [...formData.points_forts, pt],
                          });
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          isSelected
                            ? "bg-gold text-gold-foreground font-bold"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {pt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-border/80">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez les atouts, l'agencement et les points forts de cette propriété…"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card p-4 text-xs md:text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Options de visibilité */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.liste}
                    onChange={(e) => setFormData({ ...formData, liste: e.target.checked })}
                    className="h-4 w-4 rounded accent-gold"
                  />
                  <span className="text-xs font-bold text-navy">
                    Mettre en ligne immédiatement sur le site
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vedette}
                    onChange={(e) => setFormData({ ...formData, vedette: e.target.checked })}
                    className="h-4 w-4 rounded accent-gold"
                  />
                  <span className="text-xs font-bold text-gold">
                    Mettre en avant (Coup de cœur vedette)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-border/80">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-gold-gradient px-8 font-bold text-gold-foreground shadow-gold hover:opacity-95 transition disabled:opacity-50 text-sm"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Enregistrement…
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {editingId ? "Mettre à jour l'annonce" : "Enregistrer et publier"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(DEFAULT_FORM);
                    setActiveTab("annonces");
                  }}
                  className="h-12 rounded-xl border border-input bg-card px-6 text-xs font-bold text-muted-foreground hover:bg-muted transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LEADS VENDEURS */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/80 bg-card p-6">
              <h2 className="font-display text-xl font-bold text-navy">
                Demandes des Propriétaires (Page /vendre)
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Propriétaires ayant soumis un bien à vendre ou louer via votre site. Contactez-les
                directement sur WhatsApp.
              </p>
            </div>

            {sellerLeads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
                <p className="font-display text-lg font-bold text-navy">Aucune demande reçue pour l'instant</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Les soumissions des propriétaires depuis la page /vendre s'afficheront ici en direct.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {sellerLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-navy">{lead.nom}</span>
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
                          {lead.type_bien} · {lead.district}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Téléphone : <strong className="text-foreground">{lead.telephone}</strong>
                        {lead.prix_souhaite && (
                          <span>
                            {" "}
                            · Prix souhaité :{" "}
                            <strong className="text-gold">{fmtPrice(lead.prix_souhaite)} $</strong>
                          </span>
                        )}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${lead.telephone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Bonjour ${lead.nom}, je suis l'administrateur de Kabu Palace SARL. J'ai bien reçu votre demande pour votre bien (${lead.type_bien} à ${lead.district}).`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-whatsapp px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105"
                    >
                      <Phone className="h-3.5 w-3.5" /> Répondre sur WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
