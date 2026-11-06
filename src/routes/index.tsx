import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { ListingCard } from "@/components/ListingCard";
import { FilterSelect, SiteLayout } from "@/components/SiteLayout";
import { PROPERTY_TYPES, QUARTIERS } from "@/lib/listings";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { useListings } from "@/hooks/use-listings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kabu Palace SARL — Immobilier de prestige à Kinshasa" },
      {
        name: "description",
        content:
          "Villas, appartements et bureaux haut de gamme à vendre et à louer à Gombe, Ngaliema, Limete. Contact direct WhatsApp.",
      },
      { property: "og:title", content: "Kabu Palace SARL — Immobilier de prestige à Kinshasa" },
      {
        property: "og:description",
        content: "Biens d'exception à vendre et à louer à Kinshasa. Contact WhatsApp immédiat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PRICES = [
  { label: "Tous les prix", max: Infinity },
  { label: "≤ 5 000 $", max: 5000 },
  { label: "≤ 250 000 $", max: 250000 },
  { label: "≤ 600 000 $", max: 600000 },
];

function Index() {
  const { listings: allListings, loading } = useListings();
  const [mode, setMode] = useState<"Acheter" | "Louer">("Acheter");
  const [quartier, setQuartier] = useState("Tous");
  const [type, setType] = useState("Tous");
  const [price, setPrice] = useState("Tous les prix");
  const [applied, setApplied] = useState<null | {
    mode: string;
    quartier: string;
    type: string;
    max: number;
  }>(null);

  const results = useMemo(() => {
    if (!applied) return allListings;
    return allListings.filter(
      (l) =>
        l.mode === applied.mode &&
        (applied.quartier === "Tous" || l.quartier === applied.quartier) &&
        (applied.type === "Tous" || l.type === applied.type) &&
        l.price <= applied.max,
    );
  }, [applied, allListings]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ mode, quartier, type, max: PRICES.find((p) => p.label === price)!.max });
    document.getElementById("biens")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SiteLayout>
      <section id="accueil" className="relative">
        <img
          src={hero}
          alt="Villa de luxe Kabu Palace à Kinshasa"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-20 md:pb-16 md:pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Immobilier de prestige
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.05] text-ivory md:text-6xl">
            L'excellence immobilière <span className="text-gold">au cœur de Kinshasa</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-ivory/80">
            Villas, appartements et bureaux d'exception à Gombe, Ngaliema et au-delà. WhatsApp{" "}
            {WHATSAPP_DISPLAY}.
          </p>

          <form onSubmit={search} className="mt-8 rounded-2xl bg-card p-4 shadow-card md:p-5">
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              {(["Acheter", "Louer"] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m)}
                  className={`h-11 rounded-lg text-sm font-bold transition ${mode === m ? "bg-navy text-gold" : "text-muted-foreground"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <FilterSelect
                label="Quartier"
                value={quartier}
                onChange={setQuartier}
                options={["Tous", ...QUARTIERS]}
              />
              <FilterSelect
                label="Type"
                value={type}
                onChange={setType}
                options={["Tous", ...PROPERTY_TYPES]}
              />
              <div className="col-span-2 md:col-span-1">
                <FilterSelect
                  label="Prix max"
                  value={price}
                  onChange={setPrice}
                  options={PRICES.map((p) => p.label)}
                />
              </div>
              <button
                type="submit"
                className="col-span-2 flex h-12 items-center justify-center gap-2 self-end rounded-lg bg-gold-gradient font-bold text-gold-foreground md:col-span-1"
              >
                <Search className="h-5 w-5" /> Rechercher
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="biens" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Sélection exclusive
            </p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">Nos biens d'exception</h2>
          </div>
          {applied && (
            <button
              onClick={() => setApplied(null)}
              className="shrink-0 text-sm font-semibold text-muted-foreground underline"
            >
              Tout voir
            </button>
          )}
        </div>

        {results.length === 0 && loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-muted h-80 border border-border/60" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="rounded-xl bg-muted p-8 text-center text-muted-foreground">
            Aucun bien ne correspond. Contactez-nous sur WhatsApp, nous avons d'autres biens hors
            catalogue.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
