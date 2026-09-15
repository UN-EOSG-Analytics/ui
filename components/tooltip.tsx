"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  /** Maximum width; short content stays compact and long content wraps. */
  width?: number;
  disabled?: boolean;
  interactive?: boolean;
}

/** Shared explanation tooltip with the portal's Radix positioning and appearance. */
export function Tooltip({
  children,
  content,
  width = 250,
  disabled = false,
  interactive = false,
}: TooltipProps) {
  if (disabled) return children;
  if (interactive)
    return (
      <InteractiveTooltip content={content} width={width}>
        {children}
      </InteractiveTooltip>
    );
  return (
    <TooltipPrimitive.Provider delayDuration={200} skipDelayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            align="center"
            sideOffset={4}
            collisionPadding={16}
            className={cn(
              typography.caption,
              "z-[100] rounded-md border border-border bg-un-white px-3 py-1.5 text-un-black shadow-lg animate-in fade-in-0 zoom-in-95",
            )}
            style={{
              width: "max-content",
              maxWidth: `min(${width}px, calc(100vw - 2rem))`,
            }}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/** Non-modal hover disclosure for source links, with Tab access from the trigger. */
function InteractiveTooltip({
  children,
  content,
  width,
}: Pick<TooltipProps, "children" | "content"> & { width: number }) {
  const [open, setOpen] = React.useState(false);
  const trigger = React.useRef<HTMLElement | null>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = React.useId();
  const cancelClose = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  React.useEffect(() => cancelClose, [cancelClose]);
  const closeLater = () => {
    cancelClose();
    timer.current = setTimeout(() => {
      if (!panel.current?.contains(document.activeElement)) setOpen(false);
    }, 250);
  };
  const child = children as React.ReactElement<
    React.HTMLAttributes<HTMLElement>
  >;
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Anchor asChild>
        {React.cloneElement(child, {
          id: child.props.id ?? id,
          "aria-haspopup": "dialog",
          "aria-expanded": open,
          onMouseEnter: (event) => {
            child.props.onMouseEnter?.(event);
            trigger.current = event.currentTarget;
            cancelClose();
            setOpen(true);
          },
          onMouseLeave: (event) => {
            child.props.onMouseLeave?.(event);
            closeLater();
          },
          onFocus: (event) => {
            child.props.onFocus?.(event);
            trigger.current = event.currentTarget;
            cancelClose();
            setOpen(true);
          },
          onBlur: (event) => {
            child.props.onBlur?.(event);
            closeLater();
          },
          onKeyDown: (event) => {
            child.props.onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "Escape") {
              cancelClose();
              setOpen(false);
            }
            if (open && event.key === "Tab" && !event.shiftKey) {
              const link = panel.current?.querySelector<HTMLElement>(
                'a[href], button:not([disabled]), [tabindex="0"]',
              );
              if (link) {
                event.preventDefault();
                link.focus();
              }
            }
          },
        })}
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={panel}
          aria-labelledby={child.props.id ?? id}
          side="top"
          align="center"
          sideOffset={4}
          collisionPadding={16}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onMouseEnter={cancelClose}
          onMouseLeave={closeLater}
          onFocusCapture={cancelClose}
          onBlurCapture={closeLater}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === "Escape") {
              event.preventDefault();
              trigger.current?.focus();
              setOpen(false);
            } else if (
              event.key === "Tab" &&
              event.shiftKey &&
              document.activeElement ===
                panel.current?.querySelector(
                  'a[href], button:not([disabled]), [tabindex="0"]',
                )
            ) {
              event.preventDefault();
              trigger.current?.focus();
            }
          }}
          className={cn(
            typography.caption,
            "z-[100] overflow-auto rounded-md border border-border bg-un-white px-3 py-2 text-un-black shadow-lg",
          )}
          style={{
            width: "max-content",
            maxWidth: `min(${width}px, calc(100vw - 2rem))`,
            maxHeight: "var(--radix-popover-content-available-height)",
          }}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
