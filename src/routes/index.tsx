import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Menu, X, MapPin, BedDouble, Bath, Maximize, Search, Phone, Mail, Crown, Facebook, Instagram } from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kabu Palace SARL — Immobilier de prestige à Kinshasa" },
      { name: "description", content: "Villas, appartements et bureaux haut de gamme à vendre et à louer à Gombe, Ngaliema, Limete. Contact direct WhatsApp." },
      { property: "og:title", content: "Kabu Palace SARL — Immobilier de prestige à Kinshasa" },
      { property: "og:description", content: "Biens d'exception à vendre et à louer à Kinshasa. Contact WhatsApp immédiat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATSAPP = "243810000000";

type Listing = {
  id: number; title: string; quartier: string; type: string; mode: "Acheter" | "Louer";
  price: number; beds: number; baths: number; area: number; img: string;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const LISTINGS: Listing[] = [
  { id: 1, title: "Villa contemporaine avec piscine", quartier: "Gombe", type: "Villa", mode: "Acheter", price: 850000, beds: 5, baths: 4, area: 620, img: u("photo-1613490493576-7fde63acd811") },
  { id: 2, title: "Penthouse vue sur le fleuve", quartier: "Gombe", type: "Appartement", mode: "Louer", price: 4500, beds: 3, baths: 3, area: 240, img: u("photo-1600607687939-ce8a6c25118c") },
  { id: 3, title: "Résidence familiale sécurisée", quartier: "Ngaliema", type: "Villa", mode: "Acheter", price: 520000, beds: 6, baths: 5, area: 780, img: u("photo-1600596542815-ffad4c1539a9") },
  { id: 4, title: "Appartement meublé standing", quartier: "Limete", type: "Appartement", mode: "Louer", price: 2200, beds: 2, baths: 2, area: 130, img: u("photo-1600210492486-724fe5c67fb0") },
  { id: 5, title: "Plateau de bureaux premium", quartier: "Gombe", type: "Bureau", mode: "Louer", price: 6800, beds: 0, baths: 2, area: 400, img: u("photo-1497366216548-37526070297c") },
  { id: 6, title: "Terrain constructible 1 200 m²", quartier: "Mont-Ngafula", type: "Terrain", mode: "Acheter", price: 180000, beds: 0, baths: 0, area: 1200, img: u("photo-1500382017468-9049fed747ef") },
];

const QUARTIERS = ["Tous", "Gombe", "Ngaliema", "Limete", "Mont-Ngafula"];
const TYPES = ["Tous", "Villa", "Appartement", "Bureau", "Terrain"];
const PRICES = [
  { label: "Tous les prix", max: Infinity },
  { label: "≤ 5 000 $", max: 5000 },
  { label: "≤ 250 000 $", max: 250000 },
  { label: "≤ 600 000 $", max: 600000 },
];
const NAV = ["Accueil", "Acheter", "Louer", "Services", "Contact"];

const fmt = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f/g, " ");

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
    </svg>
  );
}

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient text-gold-foreground">
        <Crown className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl font-bold text-ivory">Kabu Palace</span>
        <span className="block text-[10px] tracking-[0.25em] text-gold">SARL · KINSHASA</span>
      </span>
    </a>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"Acheter" | "Louer">("Acheter");
  const [quartier, setQuartier] = useState("Tous");
  const [type, setType] = useState("Tous");
  const [price, setPrice] = useState("Tous les prix");
  const [applied, setApplied] = useState<null | { mode: string; quartier: string; type: string; max: number }>(null);

  const results = useMemo(() => {
    if (!applied) return LISTINGS;
    return LISTINGS.filter((l) =>
      l.mode === applied.mode &&
      (applied.quartier === "Tous" || l.quartier === applied.quartier) &&
      (applied.type === "Tous" || l.type === applied.type) &&
      l.price <= applied.max);
  }, [applied]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ mode, quartier, type, max: PRICES.find((p) => p.label === price)!.max });
    document.getElementById("biens")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden gap-7 md:flex">
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} className="text-sm font-medium text-ivory/80 transition hover:text-gold">{n}</a>
            ))}
          </nav>
          <a href={`https://wa.me/${WHATSAPP}`} className="hidden rounded-full bg-gold-gradient px-5 py-2 text-sm font-bold text-gold-foreground md:inline-block">Nous contacter</a>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-lg text-ivory md:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-gold/20 bg-navy px-4 pb-4 md:hidden">
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setOpen(false)} className="block border-b border-ivory/10 py-4 text-base font-medium text-ivory">{n}</a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="accueil" className="relative">
        <img src={hero} alt="Villa de luxe Kabu Palace à Kinshasa" width={1024} height={1280} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-20 md:pb-16 md:pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Immobilier de prestige</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.05] text-ivory md:text-6xl">
            L'excellence immobilière <span className="text-gold">au cœur de Kinshasa</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-ivory/80">Villas, appartements et bureaux d'exception à Gombe, Ngaliema et au-delà.</p>

          {/* Search */}
          <form onSubmit={search} className="mt-8 rounded-2xl bg-card p-4 shadow-card md:p-5">
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              {(["Acheter", "Louer"] as const).map((m) => (
                <button type="button" key={m} onClick={() => setMode(m)}
                  className={`h-11 rounded-lg text-sm font-bold transition ${mode === m ? "bg-navy text-gold" : "text-muted-foreground"}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Select label="Quartier" value={quartier} onChange={setQuartier} options={QUARTIERS} />
              <Select label="Type" value={type} onChange={setType} options={TYPES} />
              <div className="col-span-2 md:col-span-1">
                <Select label="Prix max" value={price} onChange={setPrice} options={PRICES.map((p) => p.label)} />
              </div>
              <button type="submit" className="col-span-2 flex h-12 items-center justify-center gap-2 self-end rounded-lg bg-gold-gradient font-bold text-gold-foreground md:col-span-1">
                <Search className="h-5 w-5" /> Rechercher
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Listings */}
      <section id="biens" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Sélection exclusive</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">Nos biens d'exception</h2>
          </div>
          {applied && (
            <button onClick={() => setApplied(null)} className="shrink-0 text-sm font-semibold text-muted-foreground underline">Tout voir</button>
          )}
        </div>

        {results.length === 0 ? (
          <p className="rounded-xl bg-muted p-8 text-center text-muted-foreground">Aucun bien ne correspond. Contactez-nous sur WhatsApp, nous avons d'autres biens hors catalogue.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => {
              const msg = encodeURIComponent(`Bonjour Kabu Palace, je suis intéressé(e) par : ${l.title} (${l.quartier}, réf. KP-${l.id}).`);
              return (
                <article key={l.id} className="overflow-hidden rounded-2xl bg-card shadow-card">
                  <div className="relative aspect-[4/3]">
                    <img src={l.img} alt={l.title} loading="lazy" width={800} height={600} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-bold text-gold">
                      {l.mode === "Acheter" ? "À vendre" : "À louer"}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-display text-2xl font-bold text-navy">
                      {fmt(l.price)} $<span className="text-sm font-sans font-medium text-muted-foreground">{l.mode === "Louer" ? " / mois" : ""}</span>
                    </p>
                    <h3 className="mt-1 font-sans text-base font-semibold">{l.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-gold" />{l.quartier}, Kinshasa</p>
                    <div className="mt-3 flex gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
                      {l.beds > 0 && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{l.beds}</span>}
                      {l.baths > 0 && <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{l.baths}</span>}
                      <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{fmt(l.area)} m²</span>
                    </div>
                    <a href={`https://wa.me/${WHATSAPP}?text=${msg}`} target="_blank" rel="noopener noreferrer"
                      className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg bg-whatsapp font-bold text-whatsapp-foreground active:scale-[0.98]">
                      <WhatsAppIcon className="h-5 w-5" /> Contacter sur WhatsApp
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-navy text-ivory/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm">Votre partenaire de confiance pour l'immobilier haut de gamme en RDC.</p>
          </div>
          <div id="services">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Vente de biens</li><li>Location & gestion</li><li>Conseil en investissement</li><li>Expertise foncière</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Quartiers</h4>
            <ul className="space-y-2 text-sm">
              <li>Gombe</li><li>Ngaliema</li><li>Limete</li><li>Mont-Ngafula</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold" />Boulevard du 30 Juin, Gombe, Kinshasa</li>
              <li><a href="tel:+243810000000" className="flex gap-2"><Phone className="h-4 w-4 text-gold" />+243 81 000 0000</a></li>
              <li><a href="mailto:contact@kabupalace.cd" className="flex gap-2"><Mail className="h-4 w-4 text-gold" />contact@kabupalace.cd</a></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold"><Facebook className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-ivory/10 px-4 py-5 text-center text-xs text-ivory/50">
          © {new Date().getFullYear()} Kabu Palace SARL · RCCM Kinshasa · Tous droits réservés
        </div>
      </footer>

      {/* Sticky mobile WhatsApp bar */}
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
        className="fixed inset-x-3 bottom-3 z-50 flex h-14 items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-whatsapp-foreground shadow-card md:hidden">
        <WhatsAppIcon className="h-6 w-6" /> Discuter avec un agent
      </a>
    </div>
  );
}
