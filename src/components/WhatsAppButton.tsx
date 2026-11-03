import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
    </svg>
  );
}

type WhatsAppButtonProps = {
  /** Texte prérempli du message WhatsApp (le numéro 082 406 8231 y est ajouté s'il est absent). */
  message: string;
  children?: ReactNode;
  className?: string;
  variant?: "solid" | "gold" | "floating";
};

const variants = {
  solid:
    "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 font-bold text-whatsapp-foreground active:scale-[0.98]",
  gold:
    "inline-flex items-center justify-center rounded-full bg-gold-gradient px-5 py-2 text-sm font-bold text-gold-foreground",
  floating:
    "fixed inset-x-3 bottom-3 z-50 flex h-14 items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-whatsapp-foreground shadow-card md:hidden",
};

export function WhatsAppButton({
  message,
  children = "Contacter sur WhatsApp",
  className,
  variant = "solid",
}: WhatsAppButtonProps) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
      className={cn(variants[variant], className)}
    >
      {variant !== "gold" && <WhatsAppIcon className={variant === "floating" ? "h-6 w-6" : "h-5 w-5"} />}
      {children}
    </a>
  );
}
