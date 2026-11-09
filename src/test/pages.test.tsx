import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

async function renderRoute(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const history = createMemoryHistory({ initialEntries: [path] });
  const router = createRouter({
    routeTree,
    history,
    context: { queryClient },
  });

  await router.load();

  return render(<RouterProvider router={router} />);
}

describe("Acheter page (/acheter)", () => {
  it("renders page with filters and an 'Acheter' button on each listing card linking to /acheter/:id", async () => {
    await renderRoute("/acheter");

    expect(await screen.findByRole("heading", { level: 1, name: /Acheter/i })).toBeInTheDocument();

    const communeSelect = screen.getByLabelText(/Commune à Kinshasa/i);
    expect(communeSelect).toBeInTheDocument();

    const priceSelect = screen.getByLabelText(/Budget \(Prix\)/i);
    expect(priceSelect).toBeInTheDocument();

    // Check listings are displayed and each has an "Acheter" button inside its card
    const articles = await screen.findAllByRole("article", {}, { timeout: 4000 });
    expect(articles.length).toBeGreaterThan(0);

    const firstArticle = articles[0];
    expect(firstArticle).toBeDefined();
    const firstCardAcheterBtn = within(firstArticle!).getByRole("link", { name: /^Acheter/i });
    expect(firstCardAcheterBtn).toBeInTheDocument();
    expect(firstCardAcheterBtn.getAttribute("href")).toMatch(/\/acheter\/.+/);
  });

  it("filters listings when quartier is selected", async () => {
    await renderRoute("/acheter");

    // Wait for listings to be loaded first
    await screen.findAllByRole("article", {}, { timeout: 4000 });

    const communeSelect = await screen.findByLabelText(/Commune à Kinshasa/i);
    fireEvent.change(communeSelect, { target: { value: "Ngaliema" } });

    await waitFor(() => {
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeGreaterThan(0);
      articles.forEach((article) => {
        expect(article).toHaveTextContent("Ngaliema");
      });
    });
  });
});

describe("Listing detail page (/acheter/$id)", () => {
  it("renders detailed property information including location, availability, history, and photos", async () => {
    await renderRoute("/acheter/1");

    // Title
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /Villa contemporaine avec piscine & grand jardin/i,
      }),
    ).toBeInTheDocument();

    // Location
    expect(screen.getByText(/Localisation & Environnement/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Avenue de la Justice/i).length).toBeGreaterThan(0);

    // Availability
    expect(screen.getByText(/Statut de disponibilité/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Libre de tout occupant/i).length).toBeGreaterThan(0);

    // History
    expect(screen.getByText(/Disponibilité & Historique du bien/i)).toBeInTheDocument();
    expect(screen.getByText(/Historique & Entretien du bâti/i)).toBeInTheDocument();

    // Photos
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(1);

    // WhatsApp action button containing 082 406 8231 and property reference
    const whatsappText = screen.getByText(/Acheter \/ Réserver sur WhatsApp/i);
    const whatsappLink = whatsappText.closest("a");
    expect(whatsappLink).not.toBeNull();
    const href = decodeURIComponent(whatsappLink?.getAttribute("href") || "");
    expect(href).toMatch(/KP-(1|75313570)/);
    expect(href).toContain(WHATSAPP_DISPLAY);
  });
});

describe("Vendre page (/vendre)", () => {
  it("renders form allowing owners to submit property details", async () => {
    await renderRoute("/vendre");

    expect(
      await screen.findByRole("heading", { level: 1, name: /Vendre votre bien/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Nom complet \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Numéro WhatsApp ou Téléphone \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type de bien \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quartier à Kinshasa \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prix souhaité/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Surface/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description détaillée/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: new RegExp(WHATSAPP_DISPLAY) });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute("type", "submit");
  });
});

describe("100% Commission+ page (/commission)", () => {
  it("renders the concept explanation and the opportunity form", async () => {
    await renderRoute("/commission");

    expect(
      await screen.findByRole("heading", { level: 1, name: /100% COMMISSION\+/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/30 % de la commission/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Recommandez, gagnez, recommencez/i)).toBeInTheDocument();

    // Check form fields
    expect(screen.getByPlaceholderText(/Jean-Paul Mukendi/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ENVOYER MON OPPORTUNITÉ/i })).toBeInTheDocument();
  });
});

describe("Contact page (/contact)", () => {
  it("renders all contact channels including WhatsApp, phone, email, and Facebook", async () => {
    await renderRoute("/contact");

    expect(
      await screen.findByRole("heading", { level: 1, name: /Contactez KABU PALACE SARL/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(new RegExp(WHATSAPP_DISPLAY)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/kabupalaceinfo@gmail\.com/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/facebook\.com\/kabupalace/i).length).toBeGreaterThan(0);
  });
});

describe("Admin page (/admin)", () => {
  it("renders the admin login portal with email and password inputs", async () => {
    await renderRoute("/admin");

    expect(
      await screen.findByRole("heading", { level: 1, name: /KABU PALACE (SARL|Immo)/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Portail d'Administration/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@kabupalace\.cd/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Accéder au tableau de bord/i })).toBeInTheDocument();
  });
});
