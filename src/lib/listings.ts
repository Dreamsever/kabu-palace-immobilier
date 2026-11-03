export type Listing = {
  id: number;
  title: string;
  quartier: string;
  type: string;
  mode: "Acheter" | "Louer";
  price: number;
  beds: number;
  baths: number;
  area: number;
  img: string;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const LISTINGS: Listing[] = [
  { id: 1, title: "Villa contemporaine avec piscine", quartier: "Gombe", type: "Villa", mode: "Acheter", price: 850000, beds: 5, baths: 4, area: 620, img: u("photo-1613490493576-7fde63acd811") },
  { id: 2, title: "Penthouse vue sur le fleuve", quartier: "Gombe", type: "Appartement", mode: "Louer", price: 4500, beds: 3, baths: 3, area: 240, img: u("photo-1600607687939-ce8a6c25118c") },
  { id: 3, title: "Résidence familiale sécurisée", quartier: "Ngaliema", type: "Villa", mode: "Acheter", price: 520000, beds: 6, baths: 5, area: 780, img: u("photo-1600596542815-ffad4c1539a9") },
  { id: 4, title: "Appartement meublé standing", quartier: "Limete", type: "Appartement", mode: "Louer", price: 2200, beds: 2, baths: 2, area: 130, img: u("photo-1600210492486-724fe5c67fb0") },
  { id: 5, title: "Plateau de bureaux premium", quartier: "Gombe", type: "Bureau", mode: "Louer", price: 6800, beds: 0, baths: 2, area: 400, img: u("photo-1497366216548-37526070297c") },
  { id: 6, title: "Terrain constructible 1 200 m²", quartier: "Mont-Ngafula", type: "Terrain", mode: "Acheter", price: 180000, beds: 0, baths: 0, area: 1200, img: u("photo-1500382017468-9049fed747ef") },
];

export const QUARTIERS = ["Gombe", "Ngaliema", "Limete", "Mont-Ngafula"] as const;
export const PROPERTY_TYPES = ["Villa", "Appartement", "Bureau", "Terrain"] as const;

export const SALE_PRICE_FILTERS = [
  { label: "Tous les prix", max: Infinity },
  { label: "≤ 250 000 $", max: 250000 },
  { label: "≤ 600 000 $", max: 600000 },
  { label: "≤ 1 000 000 $", max: 1000000 },
] as const;

export const fmtPrice = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f/g, " ");
