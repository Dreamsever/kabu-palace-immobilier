import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contactez KABU PALACE SARL — Agence Immobilière à Kinshasa" },
      {
        name: "description",
        content:
          "Prenez contact avec KABU PALACE SARL à Kinshasa. Téléphone & WhatsApp : 082 406 8231, E-mail : kabupalaceinfo@gmail.com, Boulevard du 30 Juin, Gombe.",
      },
      { property: "og:title", content: "Contactez KABU PALACE SARL — Kinshasa" },
      {
        property: "og:description",
        content:
          "Tous les moyens de joindre nos experts immobiliers à Kinshasa : WhatsApp direct, téléphone, email et bureau à la Gombe.",
      },
      { property: "og:image", content: "/logo.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    title: "WhatsApp Direct",
    subtitle: "Le moyen le plus rapide (réponse < 15 min)",
    actionLabel: "Ouvrir WhatsApp",
    value: WHATSAPP_DISPLAY,
    href: `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
      `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je souhaite échanger avec un agent immobilier.`
    )}`,
    highlight: true,
  },
  {
    icon: Phone,
    title: "Appel Téléphonique",
    subtitle: "Du lundi au samedi",
    actionLabel: "Appeler",
    value: WHATSAPP_DISPLAY,
    href: `tel:+${WHATSAPP_E164}`,
    highlight: false,
  },
  {
    icon: Mail,
    title: "Courrier Électronique",
    subtitle: "Pour toute demande institutionnelle ou dossier",
    actionLabel: "Écrire un email",
    value: "kabupalaceinfo@gmail.com",
    href: "mailto:kabupalaceinfo@gmail.com",
    highlight: false,
  },
  {
    icon: Facebook,
    title: "Page Facebook Officielle",
    subtitle: "Suivez nos nouveautés & actualités immobilières",
    actionLabel: "Consulter la page",
    value: "facebook.com/kabupalace",
    href: "https://web.facebook.com/kabupalace",
    highlight: false,
  },
];

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("Acheter un bien immobilier");
  const [message, setMessage] = useState("");
  const [sentWhatsApp, setSentWhatsApp] = useState(false);

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !telephone.trim()) {
      alert("Veuillez au moins renseigner votre nom et votre numéro de téléphone.");
      return;
    }

    const fullMsg = [
      `*NOUVEAU MESSAGE DE CONTACT — SITE KABU PALACE*`,
      ``,
      `👤 *Expéditeur :* ${nom.trim()}`,
      `📞 *Téléphone / WhatsApp :* ${telephone.trim()}`,
      email.trim() ? `✉️ *E-mail :* ${email.trim()}` : null,
      `📌 *Sujet :* ${sujet}`,
      ``,
      `💬 *Message :*`,
      message.trim() || `(Je souhaite échanger directement avec un conseiller.)`,
      ``,
      `Kabu Palace SARL — ${WHATSAPP_DISPLAY}`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const url = buildWhatsAppUrl(fullMsg, WHATSAPP_E164);
    setSentWhatsApp(true);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const mailtoLink = `mailto:kabupalaceinfo@gmail.com?subject=${encodeURIComponent(
    `[Kabu Palace] ${sujet} - ${nom}`
  )}&body=${encodeURIComponent(
    `Nom : ${nom}\nTéléphone : ${telephone}\nEmail : ${email}\n\nMessage :\n${message}`
  )}`;

  return (
    <SiteLayout>
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy py-16 px-4 md:py-20 text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              À votre écoute 7j/7
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold font-display md:text-5xl tracking-tight">
            Contactez KABU PALACE SARL
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ivory/85 md:text-lg leading-relaxed">
            Notre équipe est à votre disposition pour vous accompagner dans vos projets d'achat, de vente, de location ou de partenariat immobilier à Kinshasa.
          </p>
        </div>
      </section>

      {/* Cartes des canaux de contact */}
      <section className="mx-auto max-w-6xl px-4 -mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_METHODS.map((method) => {
            const Icon = method.icon;
            return (
              <a
                key={method.title}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`group flex flex-col justify-between rounded-2xl border p-6 shadow-card transition-all hover:shadow-xl hover:-translate-y-1 ${
                  method.highlight
                    ? "border-gold/60 bg-gradient-to-b from-card via-card to-gold/5 ring-1 ring-gold/40"
                    : "border-border bg-card hover:border-gold/40"
                }`}
              >
                <div>
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl transition ${
                      method.highlight
                        ? "bg-gold text-gold-foreground"
                        : "bg-muted text-foreground group-hover:bg-gold/20 group-hover:text-gold"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground font-display">
                    {method.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{method.subtitle}</p>
                  <p className="mt-3 text-sm font-semibold text-gold break-all">{method.value}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-gold transition">
                  <span>{method.actionLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Formulaire & Coordonnées physiques */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Formulaire interactif */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-2xl md:p-8">
            <h2 className="text-2xl font-bold font-display text-foreground">
              Envoyez-nous un message
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Remplissez ce formulaire pour être recontacté sous 15 minutes sur WhatsApp ou par e-mail.
            </p>

            {sentWhatsApp && (
              <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Votre message est en cours de transmission via WhatsApp.</span>
              </div>
            )}

            <form onSubmit={handleWhatsAppSend} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-foreground">
                    Nom complet <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
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
                    placeholder="082 406 8231"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground">E-mail</span>
                  <input
                    type="email"
                    placeholder="votre-email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-foreground">Objet de la demande</span>
                  <select
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="Acheter un bien immobilier">Acheter un bien immobilier</option>
                    <option value="Louer un appartement ou une villa">Louer un bien</option>
                    <option value="Confier la vente d'un bien">Vendre un bien</option>
                    <option value="Programme 100% Commission+">Partenariat 100% Commission+</option>
                    <option value="Demande d'information">Autre demande</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">Votre message</span>
                <textarea
                  rows={4}
                  placeholder="Décrivez votre besoin : secteur souhaité, budget, caractéristiques du bien..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-gold-gradient font-bold text-sm text-gold-foreground shadow-gold hover:opacity-95 transition"
                >
                  <Send className="h-4 w-4" /> Envoyer sur WhatsApp
                </button>
                <a
                  href={mailtoLink}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 font-semibold text-xs text-foreground hover:bg-muted transition"
                >
                  <Mail className="h-4 w-4 text-gold" /> Envoyer par E-mail
                </a>
              </div>
            </form>
          </div>

          {/* Informations détaillées & Horaires */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold" /> Siège & Adresse Physique
              </h3>
              <p className="mt-3 text-sm text-foreground font-medium">
                KABU PALACE SARL
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Boulevard du 30 Juin, Commune de la Gombe<br />
                Kinshasa, République Démocratique du Congo
              </p>

              <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong>RCCM :</strong> Kinshasa
                </p>
                <p>
                  <strong>E-mail :</strong>{" "}
                  <a href="mailto:kabupalaceinfo@gmail.com" className="text-gold hover:underline">
                    kabupalaceinfo@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Téléphone / WhatsApp :</strong>{" "}
                  <a href={`tel:+${WHATSAPP_E164}`} className="text-gold hover:underline">
                    {WHATSAPP_DISPLAY}
                  </a>
                </p>
                <p>
                  <strong>Facebook :</strong>{" "}
                  <a
                    href="https://web.facebook.com/kabupalace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    facebook.com/kabupalace
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" /> Horaires d'ouverture
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex justify-between border-b border-border/50 pb-1.5">
                  <span>Lundi – Vendredi</span>
                  <span className="font-semibold text-foreground">08h30 – 17h30</span>
                </li>
                <li className="flex justify-between border-b border-border/50 pb-1.5">
                  <span>Samedi</span>
                  <span className="font-semibold text-foreground">09h00 – 14h00</span>
                </li>
                <li className="flex justify-between">
                  <span>Dimanche & Jours fériés</span>
                  <span className="font-semibold text-gold">Permanence WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5 text-xs text-foreground flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">Accompagnement rigoureux & discrétion</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  Tous vos dossiers immobiliers sont traités avec la plus stricte confidentialité et une vérification juridique systématique des titres.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
