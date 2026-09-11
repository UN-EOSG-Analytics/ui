"use client";

import * as React from "react";
import { Tooltip } from "./tooltip";
import { cn } from "../lib/utils";
import { pillStyles } from "../lib/pill-styles";
import { typography } from "../lib/typography";

export interface LegendLabelProps {
  color: string;
  /** Optional patterned swatch, such as a striped CSS gradient. */
  swatchBackground?: string;
  label: string;
  explanation?: React.ReactNode;
  /** Pills for chart legends/filters; inline labels for sidebar rows. */
  variant?: "pill" | "inline";
  /** Supply with onToggle for a controlled chart filter. */
  selected?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  /** Maximum tooltip width in pixels; short explanations shrink to fit. */
  tooltipWidth?: number;
}

export function LegendLabel({
  color,
  swatchBackground,
  label,
  explanation,
  variant = "pill",
  selected = true,
  onToggle,
  disabled = false,
  tooltipWidth = 250,
}: LegendLabelProps) {
  const classes = cn(
    typography.caption,
    "inline-flex items-center text-start text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-un-blue",
    variant === "pill" ? pillStyles : "gap-2 py-1",
    variant === "pill" && selected && "bg-secondary",
    onToggle && !selected && "text-muted-foreground",
    onToggle ? "cursor-pointer" : explanation ? "cursor-help" : undefined,
    disabled && "cursor-not-allowed",
    disabled && !selected && "opacity-50",
  );
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 rounded-full",
          variant === "pill" ? "size-2.5" : "size-2",
          onToggle && !selected && "opacity-35",
        )}
        style={{ backgroundColor: color, backgroundImage: swatchBackground }}
      />
      <span
        className={cn(
          variant === "inline" &&
            explanation &&
            "underline decoration-dotted underline-offset-4",
        )}
      >
        {label}
      </span>
    </>
  );
  const trigger = onToggle ? (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onToggle();
      }}
    >
      {content}
    </button>
  ) : (
    <span
      tabIndex={!disabled && explanation ? 0 : undefined}
      className={classes}
    >
      {content}
    </span>
  );
  return explanation ? (
    <Tooltip content={explanation} width={tooltipWidth}>
      {trigger}
    </Tooltip>
  ) : (
    trigger
  );
}
