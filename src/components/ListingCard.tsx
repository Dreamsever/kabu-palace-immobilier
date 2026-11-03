import { Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { fmtPrice, type Listing } from "@/lib/listings";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function ListingCard({ listing }: { listing: Listing }) {
  const message = `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je suis intéressé(e) par : ${listing.title} (${listing.quartier}, réf. KP-${listing.id}).`;

  return (
    <article className="overflow-hidden rounded-2xl bg-card shadow-card">
      <div className="relative aspect-[4/3]">
        <img src={listing.img} alt={listing.title} loading="lazy" width={800} height={600} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-bold text-gold">
          {listing.mode === "Acheter" ? "À vendre" : "À louer"}
        </span>
      </div>
      <div className="p-4">
        <p className="font-display text-2xl font-bold text-navy">
          {fmtPrice(listing.price)} $
          <span className="text-sm font-sans font-medium text-muted-foreground">{listing.mode === "Louer" ? " / mois" : ""}</span>
        </p>
        <h3 className="mt-1 font-sans text-base font-semibold">{listing.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-gold" />
          {listing.quartier}, Kinshasa
        </p>
        <div className="mt-3 flex gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
          {listing.beds > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              {listing.beds}
            </span>
          )}
          {listing.baths > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {listing.baths}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {fmtPrice(listing.area)} m²
          </span>
        </div>
        <WhatsAppButton message={message} className="mt-4 w-full" />
      </div>
    </article>
  );
}
