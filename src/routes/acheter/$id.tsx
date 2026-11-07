import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  Info,
  Layers,
  MapPin,
  Maximize,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { SiteLayout } from "@/components/SiteLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { fmtPrice, getListingById, LISTINGS, type Listing } from "@/lib/listings";
import { fetchPropertyById } from "@/lib/supabase-properties";
import { useListings } from "@/hooks/use-listings";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

export const Route = createFileRoute("/acheter/$id")({
  head: ({ params }) => {
    const listing = getListingById(params.id);
    return {
      meta: [
        {
          title: listing
            ? `${listing.title} — Vente à ${listing.quartier} | Kabu Palace`
            : "Bien immobilier à vendre — Kabu Palace SARL",
        },
        {
          name: "description",
          content: listing
            ? `${listing.title} à vendre à Kinshasa (${listing.quartier}). Prix : ${fmtPrice(listing.price)} $. Disponibilité : ${listing.availability}. Contact WhatsApp direct : ${WHATSAPP_DISPLAY}.`
            : `Consultez les détails de ce bien immobilier haut de gamme à Kinshasa avec Kabu Palace. Contact : ${WHATSAPP_DISPLAY}.`,
        },
      ],
    };
  },
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { id } = Route.useParams();
  const { listings: allListings, loading: listingsLoading } = useListings();
  const [supabaseListing, setSupabaseListing] = useState<Listing | null>(null);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);

  // 1. Chercher d'abord dans les annonces de la base de données déjà chargées
  const listingFromList = useMemo(
    () =>
      allListings.find(
        (l) => String(l.id) === String(id) || (id === "1" && l.id === "75313570-3c29-418e-a8b6-80aa55992eef") || (id === "2" && l.id === "520232da-1c15-41de-bfd9-0bf174b89776") || (id === "3" && l.id === "11e38468-8154-42fc-8979-18a85c5f4dbd")
      ),
    [allListings, id],
  );

  useEffect(() => {
    if (listingFromList) {
      setFetchLoading(false);
      return;
    }
    let cancelled = false;
    setFetchLoading(true);
    fetchPropertyById(id)
      .then(({ data }) => {
        if (!cancelled) {
          setSupabaseListing(data);
        }
      })
      .catch(() => {
        // En cas d'erreur, le bien n'est pas affiché s'il n'existe pas en base
      })
      .finally(() => {
        if (!cancelled) {
          setFetchLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, listingFromList]);

  // Seules les annonces effectivement présentes dans la base de données peuvent être affichées
  const listing = listingFromList ?? supabaseListing;

  const loading = !listing && (listingsLoading || fetchLoading);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Biens similaires : proviennent STRICTEMENT des annonces de la base de données (allListings)
  const similarListings = useMemo(() => {
    if (!listing) return [];
    return allListings
      .filter((l) => l.mode === listing.mode && String(l.id) !== String(listing.id))
      .sort((a, b) => {
        if (a.quartier === listing.quartier && b.quartier !== listing.quartier) return -1;
        if (b.quartier === listing.quartier && a.quartier !== listing.quartier) return 1;
        return Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price);
      })
      .slice(0, 3);
  }, [listing, allListings]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gold/10 text-gold mb-4 animate-pulse">
              <Sparkles className="h-8 w-8 animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Chargement de l'annonce en cours…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Veuillez patienter pendant la récupération des détails de ce bien d'exception.
            </p>
          </div>

          {/* Skeleton de chargement élégant */}
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-40 rounded-full bg-muted" />
            <div className="h-10 w-3/4 rounded-xl bg-muted" />
            <div className="h-5 w-1/3 rounded-full bg-muted" />
            <div className="aspect-[16/9] w-full rounded-2xl bg-muted" />
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 w-1/2 rounded bg-muted" />
                <div className="h-28 w-full rounded-xl bg-muted" />
              </div>
              <div className="h-52 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!listing) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-gold mb-4">
            <Info className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-navy">Annonce introuvable</h1>
          <p className="mt-2 text-muted-foreground">
            L'annonce que vous recherchez (réf. KP-{id}) n'est plus disponible ou a été déplacée.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/acheter"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 font-bold text-gold-foreground transition hover:brightness-105"
            >
              <ArrowLeft className="h-4 w-4" /> Retour au catalogue
            </Link>
            <WhatsAppButton
              message={`Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je recherche une annonce avec la référence KP-${id}.`}
              variant="outline"
            >
              Contacter un agent
            </WhatsAppButton>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const gallery = listing.gallery?.length > 0 ? listing.gallery : [listing.img];
  const activeImage = gallery[activePhotoIndex] || listing.img;

  const inquiryMessage = `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je souhaite acheter ce bien : "${listing.title}" (${listing.quartier}, réf. KP-${listing.id}, au prix de ${fmtPrice(listing.price)} $). Pouvez-vous me transmettre la fiche technique complète et organiser une visite privée ?`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Découvrez ce bien à vendre à Kinshasa (${listing.quartier}) avec Kabu Palace : ${fmtPrice(listing.price)} $`,
          url: window.location.href,
        });
        return;
      } catch {
        // Ignorer si l'utilisateur annule
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <SiteLayout>
      {/* Fil d'Ariane & Actions */}
      <div className="border-b border-border/80 bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs">
          <nav className="flex items-center gap-2 text-muted-foreground" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-foreground transition">
              Accueil
            </Link>
            <span>/</span>
            <Link to="/acheter" className="hover:text-foreground transition">
              Acheter
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground truncate max-w-xs">{listing.title}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-navy transition"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-whatsapp" /> Lien copié !
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" /> Partager
                </>
              )}
            </button>
            <Link
              to="/acheter"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold-foreground bg-gold/20 hover:bg-gold/30 px-3 py-1.5 rounded-full transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Catalogue
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Titre & Prix Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-gold">
                {listing.mode === "Acheter" ? "À vendre" : "À louer"}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                Réf. KP-{listing.id}
              </span>
              <span className="rounded-full bg-gold/15 text-gold-foreground px-3 py-1 text-xs font-bold">
                {listing.type}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-navy md:text-4xl lg:text-5xl leading-tight">
              {listing.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-gold shrink-0" />
              <span>
                {listing.address ||
                  `${listing.quartier}, Kinshasa, République Démocratique du Congo`}
              </span>
            </p>
          </div>

          <div className="md:text-right shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Prix d'acquisition
            </p>
            <p className="font-display text-3xl font-bold text-navy md:text-4xl text-gold">
              {fmtPrice(listing.price)} $
              <span className="text-sm font-sans font-medium text-muted-foreground"> USD</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Titre foncier inclus · Honoraires clairs
            </p>
          </div>
        </div>

        {/* Galerie Photos */}
        <section className="mb-10 space-y-3" aria-label="Galerie de photos du bien">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted shadow-card md:aspect-[21/9]">
            <img
              src={activeImage}
              alt={`${listing.title} - Photo ${activePhotoIndex + 1}`}
              className="h-full w-full object-cover transition duration-300"
            />
            <div className="absolute bottom-3 right-3 rounded-full bg-navy/80 backdrop-blur px-3 py-1 text-xs font-bold text-ivory">
              Photo {activePhotoIndex + 1} / {gallery.length}
            </div>
            <div className="absolute top-3 left-3 rounded-full bg-navy/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-ivory flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>Disponibilité : {listing.availability}</span>
            </div>
          </div>

          {/* Miniatures */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {gallery.map((photo, index) => (
                <button
                  key={photo + index}
                  type="button"
                  onClick={() => setActivePhotoIndex(index)}
                  className={`relative aspect-[4/3] h-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activePhotoIndex === index
                      ? "border-gold shadow-md scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Afficher la photo ${index + 1}`}
                >
                  <img
                    src={photo}
                    alt={`Miniature ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Grid principale : Informations détaillées + Contact Box */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne Principale (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chiffres clés */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
              <div className="rounded-xl bg-muted/50 p-3 text-center">
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-navy/10 text-navy mb-1">
                  <Maximize className="h-4 w-4" />
                </span>
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                  Surface bâtie
                </p>
                <p className="text-base font-bold text-navy">{fmtPrice(listing.area)} m²</p>
              </div>

              {listing.landArea && (
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-navy/10 text-navy mb-1">
                    <Layers className="h-4 w-4" />
                  </span>
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Terrain
                  </p>
                  <p className="text-base font-bold text-navy">{fmtPrice(listing.landArea)} m²</p>
                </div>
              )}

              {listing.beds > 0 && (
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-navy/10 text-navy mb-1">
                    <BedDouble className="h-4 w-4" />
                  </span>
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Chambres
                  </p>
                  <p className="text-base font-bold text-navy">{listing.beds}</p>
                </div>
              )}

              {listing.baths > 0 && (
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-navy/10 text-navy mb-1">
                    <Bath className="h-4 w-4" />
                  </span>
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Salles de bain
                  </p>
                  <p className="text-base font-bold text-navy">{listing.baths}</p>
                </div>
              )}

              {listing.yearBuilt && (
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-navy/10 text-navy mb-1">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">Année</p>
                  <p className="text-base font-bold text-navy">{listing.yearBuilt}</p>
                </div>
              )}
            </div>

            {/* Description générale */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-8">
              <h2 className="font-display text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-gold" /> Description de la propriété
              </h2>
              <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                {listing.description}
              </p>
            </div>

            {/* Localisation & Environnement */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-8">
              <h2 className="font-display text-2xl font-bold text-navy mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold" /> Localisation & Environnement
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Secteur : <strong className="text-foreground">{listing.quartier}</strong>, Commune
                de{" "}
                <strong className="text-foreground">{listing.commune || listing.quartier}</strong>,
                Kinshasa.
              </p>

              {listing.address && (
                <div className="mb-4 rounded-xl bg-muted/60 p-3.5 text-xs text-foreground font-medium flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>Adresse précise : {listing.address}</span>
                </div>
              )}

              {listing.locationHighlights && listing.locationHighlights.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Atouts de l'emplacement :
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-2 text-xs md:text-sm text-foreground/90">
                    {listing.locationHighlights.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Disponibilité & Historique */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-8">
              <h2 className="font-display text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" /> Disponibilité & Historique du bien
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Statut de disponibilité
                  </span>
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-whatsapp inline-block animate-pulse" />
                    {listing.availability}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Visites privées accompagnées par un agent Kabu Palace sur simple rendez-vous.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Situation juridique
                  </span>
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                    {listing.legalStatus}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Certificat d'enregistrement en règle et vérifié auprès du Cadastre foncier.
                  </p>
                </div>
              </div>

              {listing.history && (
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Historique & Entretien du bâti :
                  </p>
                  <p className="text-xs md:text-sm text-foreground/85 leading-relaxed bg-muted/40 p-4 rounded-xl border border-border/50">
                    {listing.history}
                  </p>
                </div>
              )}
            </div>

            {/* Équipements & Prestations */}
            {listing.features && listing.features.length > 0 && (
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-8">
                <h2 className="font-display text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" /> Équipements & Prestations de prestige
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {listing.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-muted/30 p-3 text-xs md:text-sm font-medium text-foreground"
                    >
                      <Check className="h-4 w-4 text-gold shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne Latérale : Carte d'achat & Contact direct (1/3) */}
          <div className="space-y-6">
            <div className="sticky top-20 rounded-2xl border-2 border-gold/40 bg-card p-6 shadow-card">
              <div className="text-center pb-4 border-b border-border/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Intéressé par ce bien ?
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-navy text-gold">
                  {fmtPrice(listing.price)} $
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Réf. KP-{listing.id} · {listing.quartier}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {/* Bouton WhatsApp principal */}
                <WhatsAppButton message={inquiryMessage} className="w-full h-13 text-sm shadow-md">
                  Acheter / Réserver sur WhatsApp
                </WhatsAppButton>

                <p className="text-center text-[11px] text-muted-foreground">
                  Ouvre WhatsApp avec la référence KP-{listing.id} vers le{" "}
                  <strong className="text-foreground">{WHATSAPP_DISPLAY}</strong>.
                </p>

                {/* Appel téléphonique direct */}
                <a
                  href={`tel:+${WHATSAPP_E164}`}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-input bg-card font-semibold text-foreground transition hover:bg-muted text-xs"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  <span>Appeler le {WHATSAPP_DISPLAY}</span>
                </a>
              </div>

              {/* Garanties Kabu Palace */}
              <div className="mt-6 pt-5 border-t border-border space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Sécurité foncière :</strong> Vérification cadastrale complète avant
                    signature.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Acte notarié :</strong> Rédaction du compromis et transfert officiel du
                    certificat d'enregistrement.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Visites privées :</strong> Organisation discrète et accompagnement sur
                    site.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biens similaires */}
        {similarListings.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border/80">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  Opportunités associées
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-navy md:text-3xl">
                  Biens similaires à vendre
                </h2>
              </div>
              <Link
                to="/acheter"
                className="text-xs font-bold text-navy hover:text-gold transition underline"
              >
                Voir tout le catalogue
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarListings.map((sim) => (
                <ListingCard key={sim.id} listing={sim} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
