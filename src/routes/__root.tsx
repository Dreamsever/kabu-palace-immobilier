import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0F172A" },
      { title: "KABU PALACE SARL — Agence Immobilière de Prestige à Kinshasa" },
      {
        name: "description",
        content:
          "Agence immobilière de référence à Kinshasa (Gombe, Ngaliema, Limete, Kintambo, Lingwala, Barumbu, Lemba). Vente, location, partenariat 100% Commission+. Contact direct au 082 406 8231.",
      },
      {
        name: "keywords",
        content:
          "agence immobilière à Kinshasa, maison à vendre à Kinshasa, appartement à louer à Gombe, terrain à vendre à Ngaliema, villa de luxe à Kinshasa, investissement immobilier en RDC, Kabu Palace",
      },
      { property: "og:site_name", content: "KABU PALACE SARL" },
      { property: "og:title", content: "KABU PALACE SARL — Agence Immobilière & Marketing à Kinshasa" },
      {
        property: "og:description",
        content:
          "Maisons, villas et appartements d'exception à Kinshasa. Partenariat 100% Commission+ : gagnez 30% de commission sur vos recommandations.",
      },
      { property: "og:image", content: "/logo.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "KABU PALACE SARL — Immobilier à Kinshasa" },
      {
        name: "twitter:description",
        content:
          "Maisons et appartements de prestige à Kinshasa. Découvrez notre réseau 100% Commission+.",
      },
      { name: "twitter:image", content: "/logo.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/logo.jpg", type: "image/jpeg" },
      { rel: "apple-touch-icon", href: "/logo.jpg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "KABU PALACE SARL",
          alternateName: "Kabu Palace Immobilier",
          url: "https://kabupalace.cd",
          logo: "https://kabupalace.cd/logo.jpg",
          image: "https://kabupalace.cd/logo.jpg",
          telephone: "+243824068231",
          email: "kabupalaceinfo@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Boulevard du 30 Juin",
            addressLocality: "Gombe, Kinshasa",
            addressCountry: "CD",
          },
          sameAs: ["https://web.facebook.com/kabupalace"],
          priceRange: "$$",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Analytics />
    </QueryClientProvider>
  );
}
