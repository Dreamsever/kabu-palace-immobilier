import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  ExternalLink,
  HelpCircle,
  Home,
  MapPin,
  RotateCcw,
  ShieldCheck,
  User,
} from "lucide-react";
import { useId, useMemo, useState, type ReactNode } from "react";
import { FilterSelect, SiteLayout } from "@/components/SiteLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PROPERTY_TYPES, QUARTIERS } from "@/lib/listings";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/vendre")({
  head: () => ({
    meta: [
      { title: "Vendre un bien immobilier à Kinshasa — Kabu Palace SARL" },
      {
        name: "description",
        content: `Propriétaires : confiez la vente de votre villa, appartement, terrain ou immeuble à Kinshasa à Kabu Palace SARL. Estimation rapide et mise en relation directe sur WhatsApp au ${WHATSAPP_DISPLAY}.`,
      },
    ],
  }),
  component: VendrePage,
});

const STATUTS_PROPRIETAIRE = [
  "Propriétaire direct",
  "Mandataire / Ayant droit",
  "Gestionnaire de patrimoine",
] as const;

const TITRES_FONCIERS = [
  "Certificat d'enregistrement (Titre foncier définitif)",
  "Livret de logeur",
  "Contrat de concession perpétuelle / ordinaire",
  "Acte notarié / Jugement",
  "En cours de régularisation",
] as const;

const ATOUTS_OPTIONS = [
  "Piscine",
  "Groupe électrogène",
  "Forage d'eau / Citerne",
  "Clôture haute sécurisée",
  "Grand jardin",
  "Bord de route goudronnée",
  "Parking spacieux (+4 véhicules)",
  "Gardiennage / Guérite",
] as const;

function VendrePage() {
  const formId = useId();

  // Propriétaire
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [statutProprietaire, setStatutProprietaire] = useState<string>(STATUTS_PROPRIETAIRE[0]);

  // Bien
  const [quartier, setQuartier] = useState<string>(QUARTIERS[0]);
  const [autreQuartier, setAutreQuartier] = useState("");
  const [type, setType] = useState<string>(PROPERTY_TYPES[0]);
  const [adresse, setAdresse] = useState("");
  const [prix, setPrix] = useState("");
  const [prixNegociable, setPrixNegociable] = useState(true);
  const [surface, setSurface] = useState("");
  const [chambres, setChambres] = useState("");
  const [sallesDeBain, setSallesDeBain] = useState("");
  const [titreFoncier, setTitreFoncier] = useState<string>(TITRES_FONCIERS[0]);
  const [selectedAtouts, setSelectedAtouts] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  // État de soumission
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleAtout = (atout: string) => {
    setSelectedAtouts((prev) =>
      prev.includes(atout) ? prev.filter((a) => a !== atout) : [...prev, atout],
    );
  };

  const quartierFinal =
    quartier === "Autre" ? autreQuartier || "Autre quartier Kinshasa" : quartier;

  const formattedMessage = useMemo(() => {
    const lines = [
      `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je souhaite vous confier la vente de mon bien immobilier à Kinshasa.`,
      "",
      "--- COORDONNÉES DU PROPRIÉTAIRE ---",
      `Nom complet : ${nom || "—"}`,
      `Téléphone / WhatsApp : ${telephone || "—"}`,
      email ? `E-mail : ${email}` : null,
      `Statut : ${statutProprietaire}`,
      "",
      "--- DÉTAILS DU BIEN ---",
      `Type de bien : ${type}`,
      `Quartier : ${quartierFinal}`,
      adresse ? `Adresse / Avenue / Repère : ${adresse}` : null,
      prix
        ? `Prix souhaité : ${Number(prix).toLocaleString("fr-FR")} $ ${prixNegociable ? "(négociable)" : "(ferme)"}`
        : "Prix souhaité : À discuter / estimation demandée",
      surface ? `Surface : ${surface} m²` : null,
      chambres ? `Chambres : ${chambres}` : null,
      sallesDeBain ? `Salles de bain : ${sallesDeBain}` : null,
      `Titre de propriété : ${titreFoncier}`,
      selectedAtouts.length > 0 ? `Atouts : ${selectedAtouts.join(", ")}` : null,
      details ? `Détails & description : ${details}` : null,
    ];

    return lines.filter((line) => line !== null).join("\n");
  }, [
    nom,
    telephone,
    email,
    statutProprietaire,
    type,
    quartierFinal,
    adresse,
    prix,
    prixNegociable,
    surface,
    chambres,
    sallesDeBain,
    titreFoncier,
    selectedAtouts,
    details,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const targetUrl = buildWhatsAppUrl(formattedMessage);
    if (typeof window !== "undefined") {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const resetForm = () => {
    setNom("");
    setTelephone("");
    setEmail("");
    setStatutProprietaire(STATUTS_PROPRIETAIRE[0]);
    setQuartier(QUARTIERS[0]);
    setAutreQuartier("");
    setType(PROPERTY_TYPES[0]);
    setAdresse("");
    setPrix("");
    setPrixNegociable(true);
    setSurface("");
    setChambres("");
    setSallesDeBain("");
    setTitreFoncier(TITRES_FONCIERS[0]);
    setSelectedAtouts([]);
    setDetails("");
    setSubmitted(false);
  };

  return (
    <SiteLayout stickyWhatsApp={false}>
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-navy px-4 py-12 text-ivory md:py-16">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Espace Propriétaires & Vendeurs
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Vendre votre bien avec <span className="text-gold">Kabu Palace</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ivory/80 md:text-lg">
            Confiez la vente de votre villa, appartement, parcelle ou immeuble à notre équipe
            d'experts à Kinshasa. Remplissez le formulaire ci-dessous pour transmettre les détails
            de votre bien directement sur WhatsApp au {WHATSAPP_DISPLAY}.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ivory/70 md:gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-gold" /> Estimation discrète & gratuite
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" /> Réseau d'acheteurs vérifiés
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" /> Accompagnement juridique sécurisé
            </span>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        {submitted && (
          <div className="mb-8 rounded-2xl border border-whatsapp/40 bg-whatsapp/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Détails du bien prêts pour WhatsApp !
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Une fenêtre WhatsApp a été ouverte pour envoyer votre fiche complète à notre
                    équipe au <strong>{WHATSAPP_DISPLAY}</strong>. Si la fenêtre ne s'est pas
                    ouverte, utilisez le bouton ci-dessous.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={buildWhatsAppUrl(formattedMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 text-sm font-bold text-whatsapp-foreground transition hover:brightness-105"
                >
                  <ExternalLink className="h-4 w-4" /> Ouvrir WhatsApp
                </a>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-whatsapp" /> Copié !
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-4 w-4" /> Copier le texte
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Message preview block */}
            <div className="mt-4 rounded-xl bg-card p-4 border border-border/80">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Aperçu du message transmis :
              </p>
              <pre className="whitespace-pre-wrap font-sans text-xs text-foreground/90 leading-relaxed max-h-48 overflow-y-auto">
                {formattedMessage}
              </pre>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground underline transition"
              >
                <RotateCcw className="h-3 w-3" /> Soumettre un autre bien
              </button>
            </div>
          </div>
        )}

        <form
          id={formId}
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-10"
        >
          {/* Step 1: Owner Information */}
          <div>
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-navy text-gold text-xs font-bold">
                1
              </div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy">
                <User className="h-5 w-5 text-gold" /> Coordonnées du propriétaire
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Ces informations permettent à notre agent de vous identifier et de vous recontacter
              sur WhatsApp.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nom complet *" htmlFor="nom">
                <input
                  id="nom"
                  name="nom"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className={fieldClass}
                  placeholder="Ex. Christian Kalonji"
                />
              </Field>

              <Field label="Numéro WhatsApp ou Téléphone *" htmlFor="telephone">
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className={fieldClass}
                  placeholder="Ex. 082 000 0000 ou +243..."
                />
              </Field>

              <Field label="Adresse e-mail (optionnelle)" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  placeholder="votre-email@exemple.com"
                />
              </Field>

              <Field label="Vous êtes *" htmlFor="statutProprietaire">
                <select
                  id="statutProprietaire"
                  value={statutProprietaire}
                  onChange={(e) => setStatutProprietaire(e.target.value)}
                  className={fieldClass}
                >
                  {STATUTS_PROPRIETAIRE.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Step 2: Property Characteristics */}
          <div>
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-navy text-gold text-xs font-bold">
                2
              </div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy">
                <Home className="h-5 w-5 text-gold" /> Caractéristiques du bien
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Décrivez précisément votre propriété pour une estimation juste du prix au mètre carré.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FilterSelect
                label="Type de bien *"
                value={type}
                onChange={setType}
                options={PROPERTY_TYPES}
              />

              <div>
                <FilterSelect
                  label="Quartier à Kinshasa *"
                  value={quartier}
                  onChange={setQuartier}
                  options={[...QUARTIERS, "Autre"]}
                />
                {quartier === "Autre" && (
                  <input
                    type="text"
                    required
                    placeholder="Précisez la commune ou le quartier"
                    value={autreQuartier}
                    onChange={(e) => setAutreQuartier(e.target.value)}
                    className={`${fieldClass} mt-2`}
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <Field label="Adresse exacte / Avenue / Repère" htmlFor="adresse">
                  <input
                    id="adresse"
                    name="adresse"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    className={fieldClass}
                    placeholder="Ex. Av. de la Justice, réf. en face de..."
                  />
                </Field>
              </div>

              <Field label="Prix souhaité ($ USD)" htmlFor="prix">
                <div className="relative">
                  <input
                    id="prix"
                    name="prix"
                    type="number"
                    min={0}
                    step={5000}
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    className={fieldClass}
                    placeholder="Ex. 450000 (laisser vide si estimation souhaitée)"
                  />
                </div>
                <label className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prixNegociable}
                    onChange={(e) => setPrixNegociable(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-navy focus:ring-gold"
                  />
                  <span>Prix négociable</span>
                </label>
              </Field>

              <Field label="Surface habitable / parcelle (m²)" htmlFor="surface">
                <input
                  id="surface"
                  name="surface"
                  type="number"
                  min={0}
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  className={fieldClass}
                  placeholder="Ex. 350 ou 1200"
                />
              </Field>

              <Field label="Nombre de chambres" htmlFor="chambres">
                <input
                  id="chambres"
                  name="chambres"
                  type="number"
                  min={0}
                  value={chambres}
                  onChange={(e) => setChambres(e.target.value)}
                  className={fieldClass}
                  placeholder="Ex. 4 (pour villa/appartement)"
                />
              </Field>

              <Field label="Nombre de salles de bain" htmlFor="sallesDeBain">
                <input
                  id="sallesDeBain"
                  name="sallesDeBain"
                  type="number"
                  min={0}
                  value={sallesDeBain}
                  onChange={(e) => setSallesDeBain(e.target.value)}
                  className={fieldClass}
                  placeholder="Ex. 3"
                />
              </Field>
            </div>
          </div>

          {/* Step 3: Legal Status & Highlights */}
          <div>
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-navy text-gold text-xs font-bold">
                3
              </div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy">
                <Building2 className="h-5 w-5 text-gold" /> Titre de propriété & atouts
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              <Field label="Statut du document foncier *" htmlFor="titreFoncier">
                <select
                  id="titreFoncier"
                  value={titreFoncier}
                  onChange={(e) => setTitreFoncier(e.target.value)}
                  className={fieldClass}
                >
                  {TITRES_FONCIERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Atouts et équipements du bien
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ATOUTS_OPTIONS.map((atout) => {
                    const isSelected = selectedAtouts.includes(atout);
                    return (
                      <button
                        key={atout}
                        type="button"
                        onClick={() => toggleAtout(atout)}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium text-left transition ${
                          isSelected
                            ? "border-navy bg-navy text-gold"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border ${
                            isSelected
                              ? "border-gold bg-gold text-gold-foreground"
                              : "border-border"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </span>
                        <span className="truncate">{atout}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field label="Description détaillée & notes particulières" htmlFor="details">
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={`${fieldClass} min-h-28 py-3`}
                  placeholder="État du bien, disponibilité pour les visites, particularités (vue, travaux récents, groupe électrogène de secours, forage 100m, etc.)."
                />
              </Field>
            </div>
          </div>

          {/* Form Action */}
          <div className="pt-2 border-t border-border/80">
            <WhatsAppButton
              as="button"
              type="submit"
              message={formattedMessage}
              className="w-full h-14 text-base shadow-card"
            >
              Envoyer les détails du bien sur WhatsApp
            </WhatsAppButton>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Ce formulaire ouvre WhatsApp avec l'ensemble des caractéristiques préremplies à
              destination de l'équipe Kabu Palace au{" "}
              <strong className="text-foreground">{WHATSAPP_DISPLAY}</strong>.
            </p>
          </div>
        </form>

        {/* 4 Steps selling process guide */}
        <div className="mt-16 rounded-2xl bg-card p-6 md:p-8 border border-border/80 shadow-card">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Notre méthode</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-navy md:text-3xl">
            Comment se déroule la vente avec Kabu Palace ?
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
              <span className="text-2xl font-bold font-display text-gold">01</span>
              <h3 className="mt-2 text-sm font-bold text-navy">Fiche & premier échange</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Vous envoyez les détails via ce formulaire. Un agent spécialisé vous recontacte sur
                WhatsApp sous 24h.
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
              <span className="text-2xl font-bold font-display text-gold">02</span>
              <h3 className="mt-2 text-sm font-bold text-navy">Visite & estimation</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Visite technique sur place, vérification des titres fonciers et évaluation de la
                juste valeur marchande.
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
              <span className="text-2xl font-bold font-display text-gold">03</span>
              <h3 className="mt-2 text-sm font-bold text-navy">Commercialisation ciblée</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Photos professionnelles et présentation discrète auprès de notre réseau d'acheteurs
                qualifiés.
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
              <span className="text-2xl font-bold font-display text-gold">04</span>
              <h3 className="mt-2 text-sm font-bold text-navy">Signature sécurisée</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Négociation, rédaction du compromis et accompagnement notarié jusqu'au virement des
                fonds.
              </p>
            </div>
          </div>
        </div>

        {/* Contact direct card */}
        <div className="mt-10 rounded-xl bg-muted/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border">
          <div>
            <h4 className="text-base font-bold text-navy">
              Vous préférez un échange téléphonique direct ?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Nos conseillers sont disponibles du lundi au samedi pour vous accueillir dans nos
              bureaux à la Gombe.
            </p>
          </div>
          <div className="flex gap-2">
            <WhatsAppButton
              message={`Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je suis propriétaire et je souhaite échanger de vive voix sur un bien à vendre.`}
              variant="gold"
              className="whitespace-nowrap"
            >
              Échanger avec un conseiller
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

const fieldClass =
  "h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none transition focus:ring-2 focus:ring-ring";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
