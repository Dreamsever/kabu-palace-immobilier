import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpDown, CheckCircle2, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { FilterSelect, SiteLayout } from "@/components/SiteLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LISTINGS, PROPERTY_TYPES, QUARTIERS, SALE_PRICE_FILTERS } from "@/lib/listings";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/acheter/")({
  head: () => ({
    meta: [
      { title: "Acheter un bien immobilier à Kinshasa — Kabu Palace SARL" },
      {
        name: "description",
        content: `Achetez votre villa, appartement ou terrain de prestige à Kinshasa (Gombe, Ngaliema, Limete, Mont-Ngafula). Filtres par prix et quartier. Contact WhatsApp direct au ${WHATSAPP_DISPLAY}.`,
      },
    ],
  }),
  component: AcheterPage,
});

type SortOption = "recommandes" | "prix-croissant" | "prix-decroissant" | "surface-decroissante";

function AcheterPage() {
  const [quartier, setQuartier] = useState<string>("Tous");
  const [pricePreset, setPricePreset] = useState<string>(SALE_PRICE_FILTERS[0].label);
  const [propertyType, setPropertyType] = useState<string>("Tous");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [useCustomRange, setUseCustomRange] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommandes");

  const activePreset = useMemo(
    () => SALE_PRICE_FILTERS.find((p) => p.label === pricePreset) ?? SALE_PRICE_FILTERS[0],
    [pricePreset],
  );

  const parsedMin = useCustomRange
    ? minPriceInput
      ? Number(minPriceInput) || 0
      : 0
    : activePreset.min;
  const parsedMax = useCustomRange
    ? maxPriceInput
      ? Number(maxPriceInput) || Infinity
      : Infinity
    : activePreset.max;

  const isFiltered =
    quartier !== "Tous" ||
    propertyType !== "Tous" ||
    (useCustomRange
      ? minPriceInput !== "" || maxPriceInput !== ""
      : pricePreset !== SALE_PRICE_FILTERS[0].label);

  const resetFilters = () => {
    setQuartier("Tous");
    setPricePreset(SALE_PRICE_FILTERS[0].label);
    setPropertyType("Tous");
    setMinPriceInput("");
    setMaxPriceInput("");
    setUseCustomRange(false);
    setSortBy("recommandes");
  };

  const results = useMemo(() => {
    const filtered = LISTINGS.filter((l) => {
      if (l.mode !== "Acheter") return false;
      if (quartier !== "Tous" && l.quartier !== quartier) return false;
      if (propertyType !== "Tous" && l.type !== propertyType) return false;
      if (l.price < parsedMin) return false;
      if (l.price > parsedMax) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "prix-croissant") return a.price - b.price;
      if (sortBy === "prix-decroissant") return b.price - a.price;
      if (sortBy === "surface-decroissante") return b.area - a.area;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [quartier, propertyType, parsedMin, parsedMax, sortBy]);

  const emptyStateMessage = useMemo(() => {
    const qPart = quartier === "Tous" ? "à Kinshasa" : `à ${quartier}`;
    const pPart = useCustomRange
      ? minPriceInput || maxPriceInput
        ? ` (budget entre ${minPriceInput || "0"} $ et ${maxPriceInput || "max"} $)`
        : ""
      : pricePreset !== "Tous les prix"
        ? ` (${pricePreset})`
        : "";
    const tPart =
      propertyType === "Tous" ? "un bien immobilier" : `un(e) ${propertyType.toLowerCase()}`;
    return `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je cherche à acheter ${tPart} ${qPart}${pPart}. Avez-vous des offres hors catalogue ?`;
  }, [quartier, propertyType, pricePreset, useCustomRange, minPriceInput, maxPriceInput]);

  return (
    <SiteLayout>
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy px-4 py-12 text-ivory md:py-16">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <Sparkles className="h-4 w-4" />
            <span>Catalogue Vente Exclusive</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Acheter un bien d'exception à <span className="text-gold">Kinshasa</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ivory/80 md:text-lg">
            Explorez notre sélection rigoureuse de villas de luxe, appartements standing et terrains
            sécurisés avec titre foncier à Gombe, Ngaliema, Limete et Mont-Ngafula.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ivory/70 md:gap-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" /> Titres fonciers vérifiés
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" /> Visites privées sur mesure
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" /> Négociation & acte notarié
            </span>
            <span className="flex items-center gap-1.5 text-gold font-medium">
              WhatsApp : {WHATSAPP_DISPLAY}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Filters Form Box */}
        <div className="mb-8 rounded-2xl border border-border/80 bg-card p-5 shadow-card md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-gold" />
              <h2 className="font-sans text-base font-bold text-foreground">
                Filtres de recherche
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUseCustomRange(!useCustomRange)}
                className="text-xs font-semibold text-muted-foreground hover:text-navy underline transition"
              >
                {useCustomRange
                  ? "Utiliser les tranches de prix"
                  : "Saisir un budget personnalisé (Min/Max)"}
              </button>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-foreground bg-gold/20 hover:bg-gold/30 px-3 py-1.5 rounded-full transition"
                >
                  <RotateCcw className="h-3 w-3" /> Réinitialiser
                </button>
              )}
            </div>
          </div>

          <form
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Filtres de recherche"
          >
            {/* Neighborhood Filter */}
            <FilterSelect
              label="Quartier à Kinshasa"
              value={quartier}
              onChange={setQuartier}
              options={["Tous", ...QUARTIERS]}
            />

            {/* Price Filter (Preset or Custom) */}
            {!useCustomRange ? (
              <FilterSelect
                label="Budget (Prix)"
                value={pricePreset}
                onChange={setPricePreset}
                options={SALE_PRICE_FILTERS.map((p) => p.label)}
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Prix min ($)
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="h-12 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Prix max ($)
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="h-12 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
            )}

            {/* Property Type Filter */}
            <FilterSelect
              label="Type de bien"
              value={propertyType}
              onChange={setPropertyType}
              options={["Tous", ...PROPERTY_TYPES]}
            />

            {/* Sorting */}
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <ArrowUpDown className="h-3 w-3" /> Trier par
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="recommandes">Coups de cœur / Vedettes</option>
                <option value="prix-croissant">Prix croissant ($ → $$$)</option>
                <option value="prix-decroissant">Prix décroissant ($$$ → $)</option>
                <option value="surface-decroissante">Grande surface d'abord</option>
              </select>
            </label>
          </form>

          {/* Quick neighborhood tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border/50 text-xs">
            <span className="text-muted-foreground font-medium">Quartiers populaires :</span>
            {QUARTIERS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuartier(quartier === q ? "Tous" : q)}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  quartier === q
                    ? "bg-navy text-gold"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {results.length} bien{results.length > 1 ? "s" : ""} disponible
              {results.length > 1 ? "s" : ""} à l'achat
              {quartier !== "Tous" && <span className="text-gold font-bold"> · {quartier}</span>}
              {!useCustomRange && pricePreset !== "Tous les prix" && (
                <span className="text-muted-foreground"> ({pricePreset})</span>
              )}
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            Contact direct WhatsApp :{" "}
            <a href={`tel:+243824068231`} className="font-bold text-navy hover:underline">
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        {/* Listings Grid or Empty State */}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 md:p-12 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold mb-4">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-navy">
              Aucun bien ne correspond à vos filtres
            </h3>
            <p className="mt-2 mx-auto max-w-lg text-sm text-muted-foreground">
              Nos agents disposent d'un portefeuille de biens confidentiels "off-market" à Kinshasa
              qui ne sont pas encore publiés en ligne.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <WhatsAppButton message={emptyStateMessage} variant="solid">
                Demander des biens hors catalogue
              </WhatsAppButton>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted transition"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Information & Seller Call-to-action */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-navy via-navy-soft to-navy p-6 md:p-10 text-ivory">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold">
                Propriétaire à Kinshasa ?
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                Vous souhaitez vendre votre bien immobilier ?
              </h2>
              <p className="mt-2 text-sm text-ivory/80">
                Kabu Palace vous met en relation directe avec des acquéreurs solvables à Kinshasa et
                dans la diaspora. Estimation gratuite et discrète.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <Link
                to="/vendre"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gold-gradient px-6 font-bold text-gold-foreground transition hover:brightness-105"
              >
                Vendre mon bien
              </Link>
              <WhatsAppButton
                message={`Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je souhaite des renseignements pour vendre un bien immobilier.`}
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory hover:text-navy"
              >
                Parler à un conseiller
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
