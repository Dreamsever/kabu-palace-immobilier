/** Numéro affiché et inclus dans les messages préremplis. */
export const WHATSAPP_DISPLAY = "082 406 8231";

/** Format international wa.me (RDC : 0 82… → +243 82…). */
export const WHATSAPP_E164 = "243824068231";

export function buildWhatsAppMessage(text: string) {
  const trimmed = text.trim();
  if (trimmed.includes(WHATSAPP_DISPLAY)) return trimmed;
  return `${trimmed}\n\nKabu Palace — ${WHATSAPP_DISPLAY}`;
}

export function buildWhatsAppUrl(text: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(buildWhatsAppMessage(text))}`;
}
