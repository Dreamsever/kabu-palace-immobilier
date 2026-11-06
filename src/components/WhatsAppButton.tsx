import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
    </svg>
  );
}

export type WhatsAppButtonProps = {
  /**
   * Texte prérempli du message WhatsApp.
   * Si non renseigné, un message par défaut est utilisé.
   * Le numéro 082 406 8231 y est systématiquement inclus.
   */
  message?: string;
  children?: ReactNode;
  className?: string;
  variant?: "solid" | "gold" | "outline" | "floating" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  showIcon?: boolean;
  showNumber?: boolean;
  as?: "a" | "button";
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  target?: string;
  rel?: string;
  title?: string;
  "aria-label"?: string;
};

const variants = {
  solid:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp font-bold text-whatsapp-foreground shadow-sm transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  gold: "inline-flex items-center justify-center gap-2 rounded-lg bg-gold-gradient font-bold text-gold-foreground shadow-sm transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-lg border-2 border-whatsapp bg-transparent font-bold text-whatsapp transition hover:bg-whatsapp hover:text-whatsapp-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  floating:
    "fixed inset-x-3 bottom-3 z-50 flex items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-whatsapp-foreground shadow-card md:inset-x-auto md:bottom-6 md:right-6 md:px-6 active:scale-[0.98]",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-transparent font-semibold text-whatsapp hover:bg-whatsapp/10 active:scale-[0.98]",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-11 w-11 p-0",
};

export function WhatsAppButton({
  message,
  children = "Contacter sur WhatsApp",
  className,
  variant = "solid",
  size = variant === "floating" ? "lg" : "md",
  showIcon = true,
  showNumber = false,
  as = "a",
  type = "button",
  disabled,
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
  title,
  "aria-label": ariaLabel,
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(message);
  const resolvedAriaLabel = ariaLabel ?? `Contacter sur WhatsApp au ${WHATSAPP_DISPLAY}`;
  const iconSizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  const content = (
    <>
      {showIcon && <WhatsAppIcon className={iconSizeClass} />}
      <span>{children}</span>
      {showNumber && <span className="text-xs opacity-90">({WHATSAPP_DISPLAY})</span>}
    </>
  );

  const combinedClass = cn(
    variants[variant],
    variant !== "floating" && sizes[size],
    disabled && "pointer-events-none opacity-60",
    className,
  );

  if (as === "button") {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        title={title}
        aria-label={resolvedAriaLabel}
        className={combinedClass}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={url}
      target={target}
      rel={rel}
      onClick={onClick}
      title={title}
      aria-label={resolvedAriaLabel}
      className={combinedClass}
    >
      {content}
    </a>
  );
}
