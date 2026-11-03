import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { FilterSelect, SiteLayout } from "@/components/SiteLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PROPERTY_TYPES, QUARTIERS } from "@/lib/listings";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/vendre")({
  head: () => ({
    meta: [
      { title: "Vendre mon bien — Kabu Palace SARL" },
      {
        name: "description",
        content: "Propriétaires : envoyez les détails de votre bien à Kabu Palace pour une estimation et une mise en vente à Kinshasa.",
      },
    ],
  }),
  component: VendrePage,
});

function VendrePage() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [quartier, setQuartier] = useState(QUARTIERS[0]);
  const [type, setType] = useState(PROPERTY_TYPES[0]);
  const [prix, setPrix] = useState("");
  const [surface, setSurface] = useState("");
  const [details, setDetails] = useState("");

  const message = useMemo(() => {
    return [
      `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je suis propriétaire et je souhaite vendre mon bien.`,
      `Nom : ${nom || "—"}`,
      `Téléphone : ${telephone || "—"}`,
      email ? `E-mail : ${email}` : null,
      `Quartier : ${quartier}`,
      `Type : ${type}`,
      prix ? `Prix souhaité : ${prix} $` : "Prix souhaité : à discuter",
      surface ? `Surface : ${surface} m²` : null,
      details ? `Détails : ${details}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }, [nom, telephone, email, quartier, type, prix, surface, details]);

  return (
    <SiteLayout stickyWhatsApp={false}>
      <section className="bg-navy px-4 py-12 text-ivory md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Propriétaires</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Vendre avec <span className="text-gold">Kabu Palace</span>
          </h1>
          <p className="mt-3 max-w-xl text-ivory/80">
            Décrivez votre bien : un agent vous contacte sur WhatsApp au {WHATSAPP_DISPLAY} avec un message déjà prérempli.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-10">
        <form
          className="space-y-4 rounded-2xl bg-card p-5 shadow-card md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet" htmlFor="nom">
              <input
                id="nom"
                name="nom"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={fieldClass}
                placeholder="Ex. Jean Mukendi"
              />
            </Field>
            <Field label="Téléphone" htmlFor="telephone">
              <input
                id="telephone"
                name="telephone"
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className={fieldClass}
                placeholder="Ex. 082 000 0000"
              />
            </Field>
          </div>
          <Field label="E-mail (optionnel)" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              placeholder="vous@email.com"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <FilterSelect label="Quartier" value={quartier} onChange={setQuartier} options={QUARTIERS} />
            <FilterSelect label="Type de bien" value={type} onChange={setType} options={PROPERTY_TYPES} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prix souhaité ($)" htmlFor="prix">
              <input
                id="prix"
                name="prix"
                type="number"
                min={0}
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className={fieldClass}
                placeholder="Ex. 450000"
              />
            </Field>
            <Field label="Surface (m²)" htmlFor="surface">
              <input
                id="surface"
                name="surface"
                type="number"
                min={0}
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                className={fieldClass}
                placeholder="Ex. 320"
              />
            </Field>
          </div>
          <Field label="Détails du bien" htmlFor="details">
            <textarea
              id="details"
              name="details"
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className={`${fieldClass} min-h-32 py-3`}
              placeholder="Nombre de chambres, état, documents, accès, etc."
            />
          </Field>
          <WhatsAppButton message={message} className="w-full">
            Envoyer les détails sur WhatsApp
          </WhatsAppButton>
          <p className="text-center text-xs text-muted-foreground">
            L'envoi ouvre WhatsApp avec un message prérempli vers {WHATSAPP_DISPLAY}.
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}

const fieldClass =
  "h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
