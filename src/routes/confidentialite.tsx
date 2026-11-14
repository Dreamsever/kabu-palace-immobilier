import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de Confidentialité — KABU PALACE SARL" },
      { name: "description", content: "Politique de confidentialité et de protection des données personnelles de KABU PALACE SARL à Kinshasa." },
    ],
  }),
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  return (
    <SiteLayout>
      <section className="bg-navy px-4 py-12 text-ivory md:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
          <h1 className="font-display text-3xl font-bold md:text-5xl text-ivory">
            Protection des Données & Confidentialité
          </h1>
          <p className="mt-3 text-sm text-ivory/80">
            Engagement de discrétion absolue et respect de vos informations personnelles
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 text-foreground space-y-8">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy mb-4">
            <Lock className="h-5 w-5 text-gold" /> 1. Collecte et finalité des données
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            KABU PALACE SARL collecte uniquement les informations strictement indispensables au traitement de vos projets immobiliers (nom, numéro de téléphone, adresse e-mail, caractéristiques des biens proposés ou recherchés). Ces données sont recueillies lorsque vous remplissez un formulaire sur le site ou lors de vos échanges directs via WhatsApp.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy mb-4">
            <ShieldCheck className="h-5 w-5 text-gold" /> 2. Confidentialité des transactions
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Dans le secteur de l'immobilier de prestige à Kinshasa, la discrétion est une exigence absolue. Aucune information relative à l'identité d'un propriétaire vendeur, d'un acquéreur ou aux montants effectifs des transactions n'est cédée, vendue ou communiquée à des tiers non autorisés.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy mb-4">
            <UserCheck className="h-5 w-5 text-gold" /> 3. Vos droits
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Vous disposez à tout moment d'un droit d'accès, de rectification ou de suppression de vos informations personnelles enregistrées dans nos bases. Il vous suffit d'adresser une simple demande à notre équipe par email à <a href="mailto:kabupalaceinfo@gmail.com" className="text-gold font-medium hover:underline">kabupalaceinfo@gmail.com</a> ou directement sur WhatsApp au <a href={`tel:+${WHATSAPP_E164}`} className="text-gold font-medium hover:underline">{WHATSAPP_DISPLAY}</a>.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
