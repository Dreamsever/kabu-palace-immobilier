/** Numéro affiché et inclus dans les messages préremplis. */
export const WHATSAPP_DISPLAY = "082 406 8231";

/** Format international wa.me (RDC : 0 82… → +243 82…). */
export const WHATSAPP_E164 = "243824068231";

/** Message par défaut utilisé si aucun message spécifique n'est fourni. */
export const DEFAULT_WHATSAPP_MESSAGE =
  "Bonjour Kabu Palace, je souhaite obtenir des informations sur vos biens immobiliers.";

/**
 * Construit un message WhatsApp garanti d'inclure le numéro Kabu Palace (082 406 8231).
 */
export function buildWhatsAppMessage(text?: string): string {
  const base = text?.trim() || DEFAULT_WHATSAPP_MESSAGE;
  if (base.includes(WHATSAPP_DISPLAY)) {
    return base;
  }
  return `${base}\n\nKabu Palace — ${WHATSAPP_DISPLAY}`;
}

/**
 * Génère le lien wa.me avec le message encodé incluant le numéro 082 406 8231.
 */
export function buildWhatsAppUrl(text?: string, phone: string = WHATSAPP_E164): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage(text))}`;
}
