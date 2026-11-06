import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/whatsapp";

describe("WhatsAppButton component", () => {
  it("renders with default label and targets wa.me with 082 406 8231 in message", () => {
    render(<WhatsAppButton />);

    const link = screen.getByRole("link", { name: new RegExp(WHATSAPP_DISPLAY) });
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Contacter sur WhatsApp");

    const href = link.getAttribute("href") ?? "";
    expect(href.startsWith(`https://wa.me/${WHATSAPP_E164}?text=`)).toBe(true);
    expect(decodeURIComponent(href)).toContain(WHATSAPP_DISPLAY);
  });

  it("includes 082 406 8231 in custom prefilled messages", () => {
    render(
      <WhatsAppButton message="Bonjour, je souhaite visiter la villa de Gombe">
        Visiter ce bien
      </WhatsAppButton>,
    );

    const link = screen.getByRole("link", { name: new RegExp(WHATSAPP_DISPLAY) });
    expect(link).toHaveTextContent("Visiter ce bien");

    const href = link.getAttribute("href") ?? "";
    const decoded = decodeURIComponent(href);
    expect(decoded).toContain("Bonjour, je souhaite visiter la villa de Gombe");
    expect(decoded).toContain(WHATSAPP_DISPLAY);
  });

  it("can render as a button for forms (as='button')", () => {
    render(
      <WhatsAppButton as="button" type="submit">
        Envoyer les détails
      </WhatsAppButton>,
    );

    const button = screen.getByRole("button", { name: new RegExp(WHATSAPP_DISPLAY) });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveTextContent("Envoyer les détails");
  });

  it("can display the phone number explicitly with showNumber prop", () => {
    render(<WhatsAppButton showNumber>Discuter</WhatsAppButton>);
    expect(screen.getByText(`(${WHATSAPP_DISPLAY})`)).toBeInTheDocument();
  });
});
