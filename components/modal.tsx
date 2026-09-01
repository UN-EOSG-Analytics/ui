"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

/**
 * Modal — a composition over the Radix dialog primitive.
 *
 * Two audit findings shaped this:
 *
 * 1. system-chart ships a bespoke 739-line modal with no `role="dialog"`, no
 *    focus trap and no accessible name. Radix supplies all of those, so the
 *    composition is built on it rather than on divs — and `title` is a
 *    REQUIRED prop, because an unnamed dialog is the failure that keeps
 *    recurring.
 *
 *    Verified in the DOM rather than assumed: the panel renders `role="dialog"`
 *    with `aria-labelledby` pointing at the title and `aria-describedby` at the
 *    description, focus moves inside and is trapped, and every sibling of the
 *    portal is marked `aria-hidden`. Note Radix does NOT emit `aria-modal` — it
 *    isolates by hiding siblings instead, which assistive tech supports more
 *    reliably.
 *
 * 2. mandates' older copy uses `max-w-lg` with no viewport inset, so the panel
 *    overflows on narrow screens. The width below is
 *    `calc(100% - 2rem)` first, widening at `sm` — the fix, made the default.
 *
 * The primitive stays vendored and upgradable per app; this composition is what
 * the design system distributes.
 */

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trigger element. Omit when controlling `open` yourself. */
  trigger?: React.ReactNode;
  /**
   * Accessible name — required. Rendered visibly unless `hideTitle`, in which
   * case it is still exposed to assistive tech.
   */
  title: string;
  description?: string;
  hideTitle?: boolean;
  /** Translated label for the close button. */
  closeLabel?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
} as const;

export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  hideTitle,
  closeLabel = "Close",
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            // The mobile inset mandates is missing: never wider than the
            // viewport minus a 1rem gutter each side.
            "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4",
            "rounded-lg border border-border bg-background p-6 shadow-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            sizeClass[size],
            className,
          )}
        >
          <div className="flex flex-col gap-1.5">
            {hideTitle ? (
              <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
            ) : (
              <DialogPrimitive.Title className={typography.sectionTitle}>
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className={typography.meta}>
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          {children}
          {footer && <div className="flex justify-end gap-2">{footer}</div>}
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="absolute end-4 top-4 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
