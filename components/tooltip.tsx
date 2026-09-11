"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  /** Maximum width; short content stays compact and long content wraps. */
  width?: number;
  disabled?: boolean;
}

/** Shared explanation tooltip with the portal's Radix positioning and appearance. */
export function Tooltip({
  children,
  content,
  width = 250,
  disabled = false,
}: TooltipProps) {
  if (disabled) return children;
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
