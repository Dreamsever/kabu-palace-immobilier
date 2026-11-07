import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Menu, Phone, Sparkles, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { COMMUNES } from "@/lib/listings";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

const NAV = [
  { to: "/", label: "Accueil", hash: false },
  { to: "/acheter", label: "Acheter", hash: false },
  { to: "/vendre", label: "Vendre", hash: false },
  { to: "/commission", label: "100% Commission+", hash: false },
  { to: "/contact", label: "Contact", hash: false },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="flex h-10 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
        <img src="/logo.jpg" alt="Kabu Palace" className="h-7 w-auto object-contain" />
      </div>
      <span className="leading-none">
        <span className="block font-display text-xl font-bold text-ivory">Kabu Palace</span>
        <span className="block text-[10px] tracking-[0.25em] text-gold">SARL · KINSHASA</span>
      </span>
    </Link>
  );
}

function NavLink({
  item,
  className,
  onClick,
}: {
  item: (typeof NAV)[number];
  className: string;
  onClick?: () => void;
}) {
  if (item.hash) {
    return (
      <a href={item.to} onClick={onClick} className={className}>
        {item.label}
      </a>
    );
  }
  return (
    <Link to={item.to} onClick={onClick} className={className}>
      {item.label}
    </Link>
  );
}

export function SiteLayout({
  children,
  stickyWhatsApp = true,
}: {
  children: ReactNode;
  stickyWhatsApp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const contactMessage = `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je souhaite échanger avec un agent.`;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden gap-7 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                className="text-sm font-medium text-ivory/80 transition hover:text-gold"
              />
            ))}
          </nav>
          <WhatsAppButton message={contactMessage} variant="gold" className="hidden md:inline-flex">
            Nous contacter
          </WhatsAppButton>
          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="grid h-11 w-11 place-items-center rounded-lg text-ivory md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-gold/20 bg-navy px-4 pb-4 md:hidden">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onClick={() => setOpen(false)}
                className="block border-b border-ivory/10 py-4 text-base font-medium text-ivory"
              />
            ))}
          </nav>
        )}
      </header>

      {children}

      <footer id="contact" className="bg-navy text-ivory/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm">
              Votre partenaire de confiance pour l'immobilier haut de gamme en RDC.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/acheter" className="hover:text-gold transition">
                  Vente de biens
                </Link>
              </li>
              <li>
                <Link to="/acheter" className="hover:text-gold transition">
                  Location & gestion
                </Link>
              </li>
              <li>
                <Link to="/commission" className="text-gold font-medium hover:underline transition">
                  100% Commission+
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Communes</h4>
            <ul className="space-y-2 text-sm">
              {COMMUNES.map((c) => (
                <li key={c}>
                  <Link to="/acheter" className="hover:text-gold transition">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gold" />
                Boulevard du 30 Juin, Gombe, Kinshasa
              </li>
              <li>
                <a href={`tel:+${WHATSAPP_E164}`} className="flex gap-2 hover:text-gold transition">
                  <Phone className="h-4 w-4 text-gold" />
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a href="mailto:kabupalaceinfo@gmail.com" className="flex gap-2 hover:text-gold transition">
                  <Mail className="h-4 w-4 text-gold" />
                  kabupalaceinfo@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="https://web.facebook.com/kabupalace"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Kabu Palace"
                className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold transition hover:bg-gold hover:text-gold-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-ivory/10 px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/50">
          <span>© {new Date().getFullYear()} Kabu Palace SARL · RCCM Kinshasa · Tous droits réservés</span>
          <Link to="/admin" className="hover:text-gold transition font-medium">
            Administration
          </Link>
        </div>
      </footer>

      {stickyWhatsApp && (
        <WhatsAppButton message={contactMessage} variant="floating">
          Discuter avec un agent
        </WhatsAppButton>
      )}
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[] | string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
