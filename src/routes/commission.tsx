import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Award,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  ExternalLink,
  Globe2,
  GraduationCap,
  Handshake,
  HelpCircle,
  Info,
  Phone,
  Send,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { COMMUNES } from "@/lib/listings";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

export const Route = createFileRoute("/commission")({
  head: () => ({
    meta: [
      { title: "100% Commission+ — Recommandez, Gagnez, Recommencez | KABU PALACE SARL" },
      {
        name: "description",
        content:
          "Rejoignez le réseau de partenariat 100% Commission+ de Kabu Palace SARL. Proposez une affaire immobilière à Kinshasa et touchez 30 % de la commission. Formulaire rapide WhatsApp.",
      },
      {
        property: "og:title",
        content: "100% COMMISSION+ — Réseau de partenariat immobilier à Kinshasa",
      },
      {
        property: "og:description",
        content:
          "Proposez une affaire, gagnez 30 % de commission ! Sans diplôme ni expérience exigée. Formulaire court en 2 minutes.",
      },
      { property: "og:image", content: "/logo.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommissionPage,
});

const PROFILES = [
  "Étudiants",
  "Entrepreneurs",
  "Commerçants",
  "Avocats",
  "Fonctionnaires",
  "Artistes",
  "Agents immobiliers",
  "Toute personne disposant d'un carnet d'adresses",
];

const STEPS = [
  {
    num: "1",
    title: "Proposez votre opportunité",
    desc: "Remplissez le court formulaire ci-dessous en moins de 2 minutes avec les informations de votre contact.",
  },
  {
    num: "2",
    title: "Recommandez le client ou le bien",
    desc: "Propriétaire vendeur, acheteur avec budget, bailleur ou locataire à Kinshasa.",
  },
  {
    num: "3",
    title: "KABU PALACE s'occupe de tout",
    desc: "Notre équipe professionnelle prend le relais : visites, négociations, sécurisation juridique des titres.",
  },
  {
    num: "4",
    title: "Gagnez 30 % de la commission",
    desc: "Dès que la transaction aboutit, votre commission vous est versée sans délai selon les conditions du partenariat.",
  },
];

const ADVANTAGES = [
  {
    icon: GraduationCap,
    title: "Aucun diplôme exigé",
    desc: "Accessible à tous, quel que soit votre parcours académique.",
  },
  {
    icon: Shield,
    title: "Aucune expérience requise",
    desc: "Nos experts immobiliers gèrent la partie technique et légale.",
  },
  {
    icon: Globe2,
    title: "Travaillez d'où vous voulez",
    desc: "Depuis Kinshasa, les provinces de la RDC ou depuis la diaspora.",
  },
  {
    icon: Wallet,
    title: "30 % de commission garantie",
    desc: "Une rémunération proportionnelle aux transactions effectivement conclues.",
  },
];

export default function CommissionPage() {
  // Form State
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [typeAffaire, setTypeAffaire] = useState("Vente");
  const [typeBien, setTypeBien] = useState("Villa");
  const [localisation, setLocalisation] = useState("");
  const [prix, setPrix] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [contactClient, setContactClient] = useState("");
  const [description, setDescription] = useState("");
  const [accord, setAccord] = useState(false);

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formattedMessage, setFormattedMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!nom.trim()) {
      setErrorMessage("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!telephone.trim()) {
      setErrorMessage("Veuillez renseigner votre numéro de téléphone / WhatsApp.");
      return;
    }
    if (!localisation.trim()) {
      setErrorMessage("Veuillez préciser la commune et le quartier du bien.");
      return;
    }
    if (!nomClient.trim()) {
      setErrorMessage("Veuillez renseigner le nom du propriétaire ou du client.");
      return;
    }
    if (!accord) {
      setErrorMessage("Veuillez cocher la case d'autorisation de contact.");
      return;
    }

    const message = [
      `*PROPOSITION D'OPPORTUNITÉ — 100% COMMISSION+*`,
      `*KABU PALACE SARL*`,
      ``,
      `👤 *1. APPORTEUR D'AFFAIRES (PARTENAIRE) :*`,
      `• Nom complet : ${nom.trim()}`,
      `• Téléphone / WhatsApp : ${telephone.trim()}`,
      email.trim() ? `• E-mail : ${email.trim()}` : null,
      ``,
      `🏠 *2. OPPORTUNITÉ IMMOBILIÈRE :*`,
      `• Type d'affaire : ${typeAffaire}`,
      `• Type de bien : ${typeBien}`,
      `• Localisation (Commune & Quartier) : ${localisation.trim()}`,
      prix.trim() ? `• Prix demandé : ${prix.trim()}` : `• Prix demandé : Non précisé`,
      ``,
      `📋 *3. CONTACT DU PROPRIÉTAIRE / CLIENT :*`,
      `• Nom du propriétaire ou client : ${nomClient.trim()}`,
      contactClient.trim() ? `• Contact direct : ${contactClient.trim()}` : null,
      description.trim() ? `• Description / Précisions : ${description.trim()}` : null,
      ``,
      `✅ *4. VALIDATION :*`,
      `• J'autorise KABU PALACE SARL à me contacter concernant cette opportunité.`,
      `• Programme 100% Commission+ (Partenaire 30%).`,
      ``,
      `Envoyé depuis le site officiel Kabu Palace — ${WHATSAPP_DISPLAY}`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    setFormattedMessage(message);
    setSubmitted(true);

    const url = buildWhatsAppUrl(message, WHATSAPP_E164);
    window.open(url, "_blank", "noopener,noreferrer");
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

  return (
    <SiteLayout>
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy py-16 px-4 md:py-24 text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Programme Partenariat Officiel
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold font-display md:text-6xl tracking-tight">
            100% COMMISSION+
          </h1>
          <p className="mt-3 text-2xl font-display font-medium text-gold md:text-3xl">
            Recommandez, gagnez, recommencez !
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base text-ivory/85 md:text-lg leading-relaxed">
            Un réseau de partenariat immobilier qui permet à chacun de gagner de l'argent grâce à la recommandation de biens et de services immobiliers à Kinshasa.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <div className="flex items-center gap-2 rounded-xl bg-card/10 px-4 py-2 border border-ivory/15">
              <Coins className="h-5 w-5 text-gold" />
              <span>30 % de la commission reversée</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card/10 px-4 py-2 border border-ivory/15">
              <Clock className="h-5 w-5 text-gold" />
              <span>Formulaire en moins de 2 minutes</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card/10 px-4 py-2 border border-ivory/15">
              <Phone className="h-5 w-5 text-gold" />
              <span>Contact : 082 406 8231</span>
            </div>
          </div>
        </div>
      </section>

      {/* Le principe & Vision */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Le Concept
            </span>
            <h2 className="mt-2 text-3xl font-bold font-display md:text-4xl text-foreground">
              Le principe est simple
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Vous connaissez une personne qui souhaite <strong>vendre, acheter ou louer</strong> un bien immobilier ? Vous nous mettez en contact avec elle et notre équipe s'occupe de l'intégralité du suivi et de la négociation jusqu'à la signature finale.
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              En contrepartie, vous recevez <strong className="text-foreground">30 % de la commission</strong> qui vous est attribuée, selon les conditions de notre partenariat.
            </p>

            <div className="mt-6 rounded-2xl border-l-4 border-gold bg-gold/5 p-4 text-sm text-foreground">
              <p className="font-semibold text-gold">Notre vision :</p>
              <p className="mt-1 italic text-muted-foreground">
                « Faire de chaque personne une opportunité de développement dans le secteur immobilier. Votre réseau est votre opportunité. Votre recommandation a de la valeur. »
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" /> Qui peut participer ?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tout le monde peut devenir partenaire de <strong>100% Commission+</strong> :
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {PROFILES.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 rounded-lg bg-muted/70 px-3 py-2 text-xs font-medium text-foreground"
                >
                  <Check className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Étapes */}
      <section className="bg-muted/40 border-y border-border/60 py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Processus transparent
            </span>
            <h2 className="mt-2 text-3xl font-bold font-display md:text-4xl">
              Comment ça fonctionne ?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              4 étapes limpides pour monétiser vos relations en toute sérénité.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-gradient font-display text-lg font-bold text-gold-foreground">
                    {s.num}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Avantages */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="rounded-2xl border border-border/60 bg-card p-5">
                  <Icon className="h-6 w-6 text-gold mb-3" />
                  <h4 className="text-sm font-bold">{a.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulaire Officiel */}
      <section id="formulaire" className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Passez à l'action
          </span>
          <h2 className="mt-2 text-3xl font-bold font-display md:text-4xl">
            Proposez une affaire, gagnez une commission !
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            Un formulaire court, professionnel et facile à remplir. Moins de 2 minutes pour transmettre votre recommandation directement à notre équipe via WhatsApp.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300">
                  Votre opportunité a été générée pour WhatsApp !
                </h3>
                <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  Une fenêtre WhatsApp s'est ouverte pour transmettre votre dossier directement au{" "}
                  <strong>{WHATSAPP_DISPLAY}</strong>. Si l'application ne s'est pas lancée automatiquement, cliquez sur le bouton ci-dessous :
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={buildWhatsAppUrl(formattedMessage, WHATSAPP_E164)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Ouvrir WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : null}
                    {copied ? "Texte copié !" : "Copier le texte du message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-2xl md:p-8 space-y-8"
        >
          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          {/* 1. Vos informations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 font-bold text-xs text-gold">
                1
              </span>
              <h3 className="text-base font-bold text-foreground">Vos informations (Apporteur)</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-foreground">
                  Nom complet <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex : Jean-Paul Mukendi"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">
                  Téléphone / WhatsApp <span className="text-red-500">*</span>
                </span>
                <input
                  type="tel"
                  required
                  placeholder="Ex : 082 406 8231 ou +243 ..."
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  E-mail (facultatif)
                </span>
                <input
                  type="email"
                  placeholder="Ex : partenaire@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
            </div>
          </div>

          {/* 2. Votre opportunité */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 font-bold text-xs text-gold">
                2
              </span>
              <h3 className="text-base font-bold text-foreground">Votre opportunité</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-foreground">
                  Type d'affaire <span className="text-red-500">*</span>
                </span>
                <select
                  value={typeAffaire}
                  onChange={(e) => setTypeAffaire(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="Vente">Vente (Propriétaire souhaite vendre)</option>
                  <option value="Achat">Achat (Client souhaite acheter)</option>
                  <option value="Location">Location (Bien à louer ou locataire)</option>
                  <option value="Autre">Autre opportunité</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">
                  Type de bien <span className="text-red-500">*</span>
                </span>
                <select
                  value={typeBien}
                  onChange={(e) => setTypeBien(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="Villa">Villa</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Terrain">Terrain / Parcelle</option>
                  <option value="Immeuble">Immeuble</option>
                  <option value="Maison">Maison</option>
                  <option value="Autre">Autre bien</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">
                  Localisation (Commune & Quartier) <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex : Ngaliema, Macampagne ou Gombe"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
                <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
                  <span className="text-muted-foreground">Communes :</span>
                  {COMMUNES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setLocalisation(localisation ? `${c}, ${localisation}` : c)}
                      className="text-gold hover:underline"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">
                  Prix demandé (facultatif)
                </span>
                <input
                  type="text"
                  placeholder="Ex : 450 000 $ ou 3 500 $/mois"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
            </div>
          </div>

          {/* 3. Informations complémentaires */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 font-bold text-xs text-gold">
                3
              </span>
              <h3 className="text-base font-bold text-foreground">Informations complémentaires</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-foreground">
                  Nom du propriétaire ou du client <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex : M. Kalonji"
                  value={nomClient}
                  onChange={(e) => setNomClient(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">
                  Numéro de contact (facultatif)
                </span>
                <input
                  type="tel"
                  placeholder="Numéro du client si disponible"
                  value={contactClient}
                  onChange={(e) => setContactClient(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Brève description de l'opportunité
                </span>
                <textarea
                  rows={3}
                  placeholder="Donnez quelques détails utiles : superficie approximative, disponibilité des titres fonciers, motivation de vente, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
            </div>
          </div>

          {/* 4. Validation & Accord */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={accord}
                onChange={(e) => setAccord(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-gold focus:ring-gold"
              />
              <span className="text-xs text-foreground font-medium leading-relaxed">
                J'autorise KABU PALACE SARL à me contacter concernant cette opportunité et confirme l'exactitude des renseignements transmis. <span className="text-red-500">*</span>
              </span>
            </label>

            <button
              type="submit"
              className="w-full flex h-14 items-center justify-center gap-2 rounded-xl bg-gold-gradient font-bold text-base text-gold-foreground shadow-gold hover:opacity-95 transition"
            >
              <Send className="h-5 w-5" /> ENVOYER MON OPPORTUNITÉ VIA WHATSAPP
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Notre équipe vous contactera après réception et vérification des informations.
            </p>
          </div>
        </form>

        {/* Remarque légale de transparence (PDF 2) */}
        <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 p-5 text-xs text-muted-foreground leading-relaxed">
          <p className="flex items-start gap-2">
            <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span>
              <strong>Remarque :</strong> 100% Commission+ repose sur la recommandation et la mise en relation immobilière réelle. Ce n'est pas un système où l'on gagne simplement en recrutant de nouveaux membres. La rémunération dépend des transactions immobilières effectivement réalisées.
            </span>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
