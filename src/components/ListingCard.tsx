import { Link } from "@tanstack/react-router";
import { ArrowRight, Bath, BedDouble, Calendar, MapPin, Maximize } from "lucide-react";
import { fmtPrice, type Listing } from "@/lib/listings";

export function ListingCard({ listing }: { listing: Listing }) {
  const detailPath = "/acheter/$id";
  const params = { id: String(listing.id) };

  return (
    <article className="group overflow-hidden rounded-2xl bg-card shadow-card border border-border/80 transition duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={detailPath} params={params} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.img}
          alt={listing.title}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy/90 backdrop-blur px-3 py-1 text-xs font-bold text-gold shadow-sm">
          {listing.mode === "Acheter" ? "À vendre" : "À louer"}
        </span>
        {listing.availability && (
          <span className="absolute right-3 top-3 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
            {listing.availability.split("—")[0].trim()}
          </span>
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-display text-2xl font-bold text-navy">
            {fmtPrice(listing.price)} $
            <span className="text-sm font-sans font-medium text-muted-foreground">
              {listing.mode === "Louer" ? " / mois" : ""}
            </span>
          </p>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {listing.type}
          </span>
        </div>

        <h3 className="mt-2 font-sans text-base font-semibold text-foreground line-clamp-1 group-hover:text-gold transition">
          <Link to={detailPath} params={params}>
            {listing.title}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-gold" />
          <span className="truncate">{listing.quartier}, Kinshasa</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-4 border-t border-border/80 pt-3 text-xs text-muted-foreground">
          {listing.beds > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <BedDouble className="h-4 w-4 text-navy/70" />
              {listing.beds} ch.
            </span>
          )}
          {listing.baths > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <Bath className="h-4 w-4 text-navy/70" />
              {listing.baths} sdb.
            </span>
          )}
          <span className="flex items-center gap-1 font-medium">
            <Maximize className="h-4 w-4 text-navy/70" />
            {fmtPrice(listing.area)} m²
          </span>
          {listing.yearBuilt && (
            <span className="flex items-center gap-1 font-medium text-muted-foreground/80">
              <Calendar className="h-3.5 w-3.5" />
              {listing.yearBuilt}
            </span>
          )}
        </div>

        {/* Bouton Acheter qui renvoie vers la page détaillée /acheter/id_de_l_annonce */}
        <Link
          to={detailPath}
          params={params}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-gradient font-bold text-gold-foreground shadow-sm transition hover:brightness-105 active:scale-[0.98]"
        >
          <span>{listing.mode === "Acheter" ? "Acheter" : "Consulter le bien"}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
