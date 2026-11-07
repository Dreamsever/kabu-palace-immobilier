import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { 
  Building2, 
  ChevronRight, 
  Compass, 
  FileCheck2, 
  Handshake, 
  Landmark, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp,
  Users
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { ListingCard } from "@/components/ListingCard";
import { FilterSelect, SiteLayout } from "@/components/SiteLayout";
import { 
  BUY_PRICE_FILTERS, 
  COMMUNES, 
  PROPERTY_TYPES, 
  RENT_PRICE_FILTERS 
} from "@/lib/listings";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";
import { useListings } from "@/hooks/use-listings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maisons et villas à vendre à Kinshasa — KABU PALACE SARL" },
      {
        name: "description",
        content:
          "Agence immobilière de référence à Kinshasa. Trouvez votre villa, appartement de luxe ou terrain à Gombe, Ngaliema, Limete, Kintambo, Lingwala, Barumbu, Lemba. Contact WhatsApp immédiat.",
      },
      { property: "og:title", content: "Maisons et villas à vendre à Kinshasa — KABU PALACE SARL" },
      {
        property: "og:description",
        content:
          "Agence immobilière à Kinshasa : villas de luxe, appartements à louer à Gombe, terrains à vendre à Ngaliema. Réseau de partenariat 100% Commission+.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const COMMUNE_INFO: Record<string, { desc: string; count: string }> = {
  Gombe: { desc: "Appartements et villas de prestige", count: "Centre d'affaires & Ambassades" },
  Ngaliema: { desc: "Terrains, villas et résidences de standing", count: "Vues panoramiques & Calme" },
  Kintambo: { desc: "Appartements et maisons familiales", count: "Carrefour stratégique" },
  Lingwala: { desc: "Logements et appartements modernes", count: "Proximité immédiate Gombe" },
  Barumbu: { desc: "Maisons et parcelles à fort potentiel", count: "Axe commercial & Marchés" },
  Limete: { desc: "Immobilier résidentiel et commercial", count: "Quartier résidentiel prisé" },
  Lemba: { desc: "Maisons, appartements et terrains", count: "Cadre verdoyant & Universités" },
};

export default function Index() {
  const { listings: allListings, loading } = useListings();
  const [mode, setMode] = useState<"Acheter" | "Louer">("Acheter");
  const [commune, setCommune] = useState("Toutes");
  const [type, setType] = useState("Tous");
  
  // Dynamic price filters depending on mode
  const currentPriceFilters = mode === "Acheter" ? BUY_PRICE_FILTERS : RENT_PRICE_FILTERS;
  const [price, setPrice] = useState("Tous les prix");

  const [applied, setApplied] = useState<null | {
    mode: string;
    commune: string;
    type: string;
    max: number;
  }>(null);

  // Switch mode and reset price if not in range
  const handleModeChange = (newMode: "Acheter" | "Louer") => {
    setMode(newMode);
    setPrice("Tous les prix");
  };

  const results = useMemo(() => {
    if (!applied) return allListings;
    return allListings.filter((l) => {
      const matchMode = l.mode === applied.mode;
      const matchCommune =
        applied.commune === "Toutes" ||
        l.commune?.toLowerCase() === applied.commune.toLowerCase() ||
        l.quartier.toLowerCase() === applied.commune.toLowerCase();
      const matchType = applied.type === "Tous" || l.type === applied.type;
      const matchPrice = l.price <= applied.max;
      return matchMode && matchCommune && matchType && matchPrice;
    });
  }, [applied, allListings]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFilter = currentPriceFilters.find((p) => p.label === price) ?? currentPriceFilters[0];
    setApplied({
      mode,
      commune,
      type,
      max: selectedFilter.max,
    });
    document.getElementById("biens")?.scrollIntoView({ behavior: "smooth" });
  };

  const filterByCommune = (c: string) => {
    setCommune(c);
    setApplied({
      mode,
      commune: c,
      type: "Tous",
      max: Infinity,
    });
    document.getElementById("biens")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section id="accueil" className="relative">
        <img
          src={hero}
          alt="Agence immobilière à Kinshasa - Villa de luxe Kabu Palace SARL"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-20 md:pb-20 md:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-navy/80 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Agence Immobilière & Marketing à Kinshasa
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] text-ivory md:text-6xl font-display">
            L'excellence immobilière <span className="text-gold">au cœur de Kinshasa</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ivory/85 md:text-lg leading-relaxed">
            Maisons et villas de luxe à vendre, appartements à louer à Gombe, terrains titrés à Ngaliema, Limete et dans toute la capitale. Assistance WhatsApp directe au{" "}
            <a href={`tel:+${WHATSAPP_E164}`} className="font-semibold text-gold hover:underline">
              {WHATSAPP_DISPLAY}
            </a>.
          </p>

          {/* Formulaire de recherche avec filtres Commune et Prix dynamique */}
          <form onSubmit={search} className="mt-8 rounded-2xl bg-card/95 p-4 shadow-2xl backdrop-blur md:p-6 border border-border/50">
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              {(["Acheter", "Louer"] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`h-11 rounded-lg text-sm font-bold transition-all ${
                    mode === m
                      ? "bg-navy text-gold shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "Acheter" ? "Acheter un bien" : "Louer un bien"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <FilterSelect
                label="Commune"
                value={commune}
                onChange={setCommune}
                options={["Toutes", ...COMMUNES]}
              />
              <FilterSelect
                label="Type de bien"
                value={type}
                onChange={setType}
                options={["Tous", ...PROPERTY_TYPES]}
              />
              <div className="col-span-2 md:col-span-1">
                <FilterSelect
                  label={`Prix max (${mode === "Acheter" ? "Achat" : "Loyer"})`}
                  value={price}
                  onChange={setPrice}
                  options={currentPriceFilters.map((p) => p.label)}
                />
              </div>
              <button
                type="submit"
                className="col-span-2 flex h-12 items-center justify-center gap-2 self-end rounded-lg bg-gold-gradient font-bold text-gold-foreground shadow-lg transition hover:opacity-95 md:col-span-1"
              >
                <Search className="h-5 w-5" /> Rechercher
              </button>
            </div>

            {/* Quick-tags Communes prioritaires */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border/50 text-xs">
              <span className="font-semibold text-muted-foreground">Secteurs prioritaires :</span>
              {COMMUNES.slice(0, 5).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => filterByCommune(c)}
                  className={`rounded-full px-2.5 py-1 font-medium transition ${
                    commune === c
                      ? "bg-gold text-gold-foreground"
                      : "bg-muted text-foreground/80 hover:bg-gold/20 hover:text-gold"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Bannière Réseau 100% Commission+ */}
      <section className="bg-gradient-to-r from-navy via-navy/95 to-slate-900 border-y border-gold/20 py-8 px-4 text-ivory">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-gradient text-gold-foreground font-bold shadow-lg">
              <Handshake className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                Nouveau programme de recommandation
              </div>
              <h3 className="mt-1 text-xl font-bold font-display md:text-2xl text-ivory">
                100% COMMISSION+ — Proposez une affaire, gagnez une commission !
              </h3>
              <p className="mt-1 text-sm text-ivory/80 max-w-xl">
                Vous connaissez quelqu'un qui veut vendre, acheter ou louer un bien à Kinshasa ? Mettez-nous en contact et recevez <strong className="text-gold font-semibold">30 % de la commission</strong> réalisée.
              </p>
            </div>
          </div>
          <Link
            to="/commission"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 font-bold text-gold-foreground shadow-gold hover:opacity-95 transition"
          >
            Rejoindre le réseau <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Section Biens d'exception */}
      <section id="biens" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Sélection exclusive
            </p>
            <h2 className="mt-1 text-3xl font-bold font-display md:text-4xl">
              Nos biens d'exception à Kinshasa
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Villas de prestige, résidences sécurisées et terrains à fort potentiel d'investissement.
            </p>
          </div>
          {applied && (
            <button
              onClick={() => {
                setApplied(null);
                setCommune("Toutes");
                setType("Tous");
                setPrice("Tous les prix");
              }}
              className="shrink-0 text-sm font-semibold text-gold hover:underline"
            >
              Réinitialiser les filtres (Afficher tout)
            </button>
          )}
        </div>

        {results.length === 0 && loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-muted h-80 border border-border/60" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-bold">Aucun bien ne correspond à ces critères</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Nous disposons d'un portefeuille confidentiel de biens "hors catalogue" à Gombe, Ngaliema, Limete et dans d'autres communes.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
                `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je recherche un bien (${mode}, commune: ${commune}) qui n'apparaît pas sur le site. Pouvez-vous me proposer vos offres hors catalogue ?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 font-bold text-gold-foreground shadow-gold"
            >
              Contacter un agent sur WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Section Stratégie Géographique : 7 Communes prioritaires */}
      <section className="bg-muted/40 border-y border-border/60 py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Secteurs d'expertise
            </span>
            <h2 className="mt-2 text-3xl font-bold font-display md:text-4xl">
              L'immobilier dans les 7 communes prioritaires de Kinshasa
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              KABU PALACE SARL vous accompagne dans les quartiers les plus recherchés pour l'achat, la vente ou la location à forte rentabilité.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMMUNES.map((c) => {
              const info = COMMUNE_INFO[c] || { desc: "Immobilier résidentiel", count: "Kinshasa" };
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => filterByCommune(c)}
                  className="group flex flex-col text-left rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:border-gold/60 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-gold-foreground transition">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-gold transition">
                      Voir les offres →
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground font-display">
                    {c}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-gold">
                    {info.desc}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {info.count}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rubrique CONSEILS IMMOBILIERS (Stratégie SEO Kinshasa) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Expertise & Réflexion
          </span>
          <h2 className="mt-2 text-3xl font-bold font-display md:text-4xl">
            Conseils Immobiliers à Kinshasa
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Comprendre le marché immobilier kinois, sécuriser vos démarches foncières et optimiser votre patrimoine en RDC.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-gold/40 transition">
            <div className="flex items-center gap-3 text-gold mb-3">
              <Compass className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Guide Achat</span>
            </div>
            <h3 className="text-lg font-bold">
              Les meilleurs quartiers pour acheter une maison à Kinshasa
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              La <strong>Gombe</strong> reste la référence pour les résidences diplomatiques et les sièges d'entreprise. <strong>Ngaliema</strong> (Macampagne, Binza Pigeon) séduit par sa verdure et ses vues surplombantes. <strong>Limete</strong> offre un équilibre exceptionnel entre calme résidentiel et accessibilité.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-gold/40 transition">
            <div className="flex items-center gap-3 text-gold mb-3">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Investissement</span>
            </div>
            <h3 className="text-lg font-bold">
              Pourquoi investir dans l'immobilier à Ngaliema ?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Ngaliema combine une valorisation foncière constante, une forte demande locative de la part des expatriés et cadres, ainsi qu'un cadre de vie aéré et sécurisé. C'est l'une des communes les plus dynamiques pour l'acquisition de parcelles et de villas contemporaines.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-gold/40 transition">
            <div className="flex items-center gap-3 text-gold mb-3">
              <Landmark className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Stratégie</span>
            </div>
            <h3 className="text-lg font-bold">
              Acheter un terrain ou un appartement à Kinshasa ?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              L'appartement neuf en copropriété (Gombe, Limete) procure un rendement locatif immédiat avec une gestion simplifiée. Le terrain titré permet une plus-value patrimoniale majeure sur le long terme avec liberté totale de construction.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-gold/40 transition">
            <div className="flex items-center gap-3 text-gold mb-3">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Sécurité Juridique</span>
            </div>
            <h3 className="text-lg font-bold">
              Les précautions à prendre avant d'acheter une parcelle en RDC
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Exigez toujours le <strong>Certificat d'Enregistrement</strong> officiel, vérifiez l'absence de charges ou de servitudes auprès de la circonscription foncière locale et faites authentifier la transaction par un notaire assermenté. KABU PALACE vérifie systématiquement chaque dossier juridique avant publication.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-muted/60 p-6 text-center border border-border">
          <p className="text-sm font-medium text-foreground">
            Vous avez un projet immobilier spécifique ou besoin d'un audit de bien à Kinshasa ?
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
              `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je souhaite obtenir des conseils personnalisés pour un projet immobilier à Kinshasa.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-gold hover:underline"
          >
            Échanger directement avec nos experts immobiliers sur WhatsApp →
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
