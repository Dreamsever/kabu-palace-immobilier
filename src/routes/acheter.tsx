import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { FilterSelect, SiteLayout } from "@/components/SiteLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LISTINGS, QUARTIERS, SALE_PRICE_FILTERS } from "@/lib/listings";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/acheter")({
  head: () => ({
    meta: [
      { title: "Acheter un bien — Kabu Palace SARL" },
      {
        name: "description",
        content: "Filtrez les villas, appartements et terrains à vendre à Kinshasa par quartier et par prix.",
      },
    ],
  }),
  component: AcheterPage,
});

function AcheterPage() {
  const [quartier, setQuartier] = useState("Tous");
  const [price, setPrice] = useState(SALE_PRICE_FILTERS[0].label);

  const max = SALE_PRICE_FILTERS.find((p) => p.label === price)?.max ?? Infinity;

  const results = useMemo(() => {
    return LISTINGS.filter(
      (l) =>
        l.mode === "Acheter" &&
        (quartier === "Tous" || l.quartier === quartier) &&
        l.price <= max,
    );
  }, [quartier, max]);

  return (
    <SiteLayout>
      <section className="bg-navy px-4 py-12 text-ivory md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Catalogue vente</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Acheter à <span className="text-gold">Kinshasa</span>
          </h1>
          <p className="mt-3 max-w-xl text-ivory/80">
            Filtrez par quartier et par budget pour trouver la villa, l'appartement ou le terrain qui vous correspond.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <form
          className="mb-8 grid gap-3 rounded-2xl bg-card p-4 shadow-card sm:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Filtres de recherche"
        >
          <FilterSelect
            label="Quartier"
            value={quartier}
            onChange={setQuartier}
            options={["Tous", ...QUARTIERS]}
          />
          <FilterSelect
            label="Prix maximum"
            value={price}
            onChange={setPrice}
            options={SALE_PRICE_FILTERS.map((p) => p.label)}
          />
        </form>

        <p className="mb-5 text-sm text-muted-foreground">
          {results.length} bien{results.length > 1 ? "s" : ""} à vendre
        </p>

        {results.length === 0 ? (
          <div className="rounded-xl bg-muted p-8 text-center">
            <p className="text-muted-foreground">
              Aucun bien ne correspond à ces filtres. Nos agents ont d'autres offres hors catalogue.
            </p>
            <WhatsAppButton
              message={`Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je cherche à acheter à ${quartier === "Tous" ? "Kinshasa" : quartier} (${price}).`}
              className="mx-auto mt-4"
            >
              Demander d'autres biens
            </WhatsAppButton>
          </div>
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
