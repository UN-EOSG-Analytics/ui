"use client";
import * as React from "react";
import * as Primitive from "@radix-ui/react-popover";
import { cn } from "../lib/utils";

export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export function PopoverContent({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        sideOffset={4}
        className={cn(
          "z-50 max-h-[var(--radix-popover-content-available-height)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border border-border bg-un-white text-foreground shadow-md outline-none",
          className,
        )}
        {...props}
      />
    </Primitive.Portal>
  );
}
