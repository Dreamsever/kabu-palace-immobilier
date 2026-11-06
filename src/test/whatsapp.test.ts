import { describe, expect, it } from "vitest";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
  WHATSAPP_DISPLAY,
  WHATSAPP_E164,
} from "@/lib/whatsapp";

describe("WhatsApp helpers", () => {
  it("keeps the Kinshasa number in prefilled messages", () => {
    expect(buildWhatsAppMessage("Bonjour")).toContain(WHATSAPP_DISPLAY);
  });

  it("targets wa.me with the international digits for 082 406 8231", () => {
    const url = buildWhatsAppUrl("Bonjour Kabu Palace");
    expect(url.startsWith(`https://wa.me/${WHATSAPP_E164}?text=`)).toBe(true);
    expect(decodeURIComponent(url)).toContain("082 406 8231");
  });

  it("provides a default message with the phone number if empty or omitted", () => {
    const msg = buildWhatsAppMessage();
    expect(msg).toContain(WHATSAPP_DISPLAY);
    expect(msg).toContain("Kabu Palace");

    const url = buildWhatsAppUrl();
    expect(url.startsWith(`https://wa.me/${WHATSAPP_E164}?text=`)).toBe(true);
    expect(decodeURIComponent(url)).toContain(WHATSAPP_DISPLAY);
  });

  it("does not duplicate the phone number if already present in text", () => {
    const custom = `Bonjour Kabu Palace (${WHATSAPP_DISPLAY}), je suis intéressé.`;
    const result = buildWhatsAppMessage(custom);
    const matches = result.match(/082 406 8231/g);
    expect(matches?.length).toBe(1);
  });
});
