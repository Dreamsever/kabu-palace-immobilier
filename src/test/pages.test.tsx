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

    const quartierSelect = screen.getByLabelText(/Quartier à Kinshasa/i);
    expect(quartierSelect).toBeInTheDocument();

    const priceSelect = screen.getByLabelText(/Budget \(Prix\)/i);
    expect(priceSelect).toBeInTheDocument();

    // Check listings are displayed and each has an "Acheter" button inside its card
    const articles = screen.getAllByRole("article");
    expect(articles.length).toBeGreaterThan(0);

    const firstArticle = articles[0];
    expect(firstArticle).toBeDefined();
    const firstCardAcheterBtn = within(firstArticle!).getByRole("link", { name: /^Acheter/i });
    expect(firstCardAcheterBtn).toBeInTheDocument();
    expect(firstCardAcheterBtn.getAttribute("href")).toMatch(/\/acheter\/\d+/);
  });

  it("filters listings when quartier is selected", async () => {
    await renderRoute("/acheter");

    const quartierSelect = await screen.findByLabelText(/Quartier à Kinshasa/i);
    fireEvent.change(quartierSelect, { target: { value: "Ngaliema" } });

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

    // WhatsApp action button containing 082 406 8231 and reference KP-1
    const whatsappText = screen.getByText(/Acheter \/ Réserver sur WhatsApp/i);
    const whatsappLink = whatsappText.closest("a");
    expect(whatsappLink).not.toBeNull();
    const href = decodeURIComponent(whatsappLink?.getAttribute("href") || "");
    expect(href).toContain("KP-1");
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
