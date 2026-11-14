import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, FileCheck, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions Légales — KABU PALACE SARL Kinshasa" },
      { name: "description", content: "Informations légales et réglementaires de l'agence immobilière KABU PALACE SARL à Kinshasa, RDC." },
    ],
  }),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
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
            Mentions Légales & Réglementaires
          </h1>
          <p className="mt-3 text-sm text-ivory/80">
            KABU PALACE SARL — Société à Responsabilité Limitée de droit congolais (RDC)
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 text-foreground space-y-8">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy mb-4">
            <Building2 className="h-5 w-5 text-gold" /> 1. Identification de l'entreprise
          </h2>
          <ul className="space-y-2 text-sm text-foreground/90 leading-relaxed">
            <li><strong>Dénomination sociale :</strong> KABU PALACE SARL</li>
            <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)</li>
            <li><strong>Siège social :</strong> Boulevard du 30 Juin, Commune de la Gombe, Ville de Kinshasa, République Démocratique du Congo</li>
            <li><strong>Registre de Commerce et du Crédit Mobilier (RCCM) :</strong> RCCM Kinshasa</li>
            <li><strong>Numéro d'Identification Nationale (ID. NAT.) :</strong> En cours d'immatriculation officielle au Guichet Unique</li>
            <li><strong>Activité principale :</strong> Transaction immobilière, courtage, conseil en investissement foncier, gestion locative et marketing immobilier</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy mb-4">
            <Phone className="h-5 w-5 text-gold" /> 2. Coordonnées de contact
          </h2>
          <ul className="space-y-2 text-sm text-foreground/90 leading-relaxed">
            <li><strong>Téléphone & WhatsApp :</strong> <a href={`tel:+${WHATSAPP_E164}`} className="text-gold font-bold hover:underline">{WHATSAPP_DISPLAY}</a></li>
            <li><strong>Courrier électronique :</strong> <a href="mailto:kabupalaceinfo@gmail.com" className="text-gold hover:underline">kabupalaceinfo@gmail.com</a></li>
            <li><strong>Site Internet officiel :</strong> https://kabupalace.cd</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy mb-4">
            <ShieldCheck className="h-5 w-5 text-gold" /> 3. Sécurité juridique & Titres fonciers
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Conformément à la législation foncière de la République Démocratique du Congo (Loi n° 73-021 du 20 juillet 1973 portant régime général des biens, régime foncier et immobilier), le sol est la propriété exclusive, inaliénable et imprescriptible de l'État congolais. KABU PALACE SARL s'assure que chaque bien mis en vente dispose d'un <strong>Certificat d'Enregistrement</strong> valide ou d'un titre authentifié auprès des circonscriptions foncières compétentes de la ville de Kinshasa avant toute publication ou transaction.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy mb-4">
            <FileCheck className="h-5 w-5 text-gold" /> 4. Propriété intellectuelle
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            L'ensemble des éléments constituant ce site internet (textes, visuels, photographies des biens, logo, architecture logicielle, bases de données) est la propriété exclusive de KABU PALACE SARL ou fait l'objet d'une autorisation d'utilisation. Toute reproduction totale ou partielle sans accord préalable écrit est strictement interdite.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
