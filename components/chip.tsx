import * as React from "react";
import { cn } from "../lib/utils";

/**
 * THE CHIP SYSTEM
 * ===============
 * One primitive for every small rounded label. Extracted from mandates, where
 * it replaced 31 hand-rolled implementations: 5 border radii, 6 spellings of
 * the text size, 7 horizontal paddings, 11 border treatments, 17 fills, and 17
 * chips with no focus state at all.
 *
 * Two orthogonal axes. Pick one value from each; never hand-write classes.
 *
 *   1. DENSITY — a property of the CONTAINER, not the chip.
 *   2. TONE    — emphasis, not decoration.
 *
 * THE COLOUR BUDGET
 * -----------------
 * The brand guide puts UN Blue, black and white first and says accents are for
 * differentiating information in charts, not for UI. So the ground is neutral
 * and exactly one thing earns colour: `selected`, the state of an active
 * facet. If every kind had its own hue the page becomes confetti and UN Blue
 * stops reading as "interactive".
 *
 * THE RULES THAT FIX REAL BUGS
 * ----------------------------
 * · Selection is a FILL, never a ring. Rings are reserved for focus. Two
 *   components once used `ring-2` for *selected* while the base used it for
 *   *focused*, so a keyboard user could not tell them apart.
 * · Interactivity is expressed by ELEMENT, not styling. `href` renders an
 *   `<a>`, `onClick` a `<button>`, neither a `<span>` — and a static chip gets
 *   no hover, so nothing looks clickable that isn't.
 * · `items-baseline`, not `items-center`. Chips set inline in running text
 *   must sit on the baseline of the sentence around them.
 * · Counts are a SLOT (`ChipCount`), not another chip.
 */

/** Density is a property of the container. */
export type ChipDensity = "comfortable" | "dense" | "touch";
/** Emphasis, not decoration. See the colour budget. */
export type ChipTone = "neutral" | "selected" | "ghost";

const DENSITY: Record<ChipDensity, string> = {
  // Grows to a 36px touch target on small viewports, tightens at sm+.
  comfortable: "px-2.5 py-[9px] text-xs sm:py-0.5",
  // Opts all the way to 44px — for chips that are a section's main interaction.
  touch: "px-2.5 py-[13px] text-xs sm:py-0.5",
  // Unconditional: these live in table cells, where extra mobile padding would
  // change the height of every row.
  dense: "px-2 py-0.5 text-xs",
};

const TONE: Record<ChipTone, string> = {
  neutral: "border-border bg-secondary text-secondary-foreground",
  selected: "border-un-blue bg-un-blue font-medium text-white",
  ghost: "border-dashed border-border bg-transparent text-muted-foreground",
};

/** Hover only exists for chips that actually do something. */
const TONE_HOVER: Record<ChipTone, string> = {
  neutral: "hover:border-un-blue hover:bg-un-blue-tint-50",
  selected: "hover:bg-un-blue-shade",
  ghost: "hover:border-un-blue",
};

const BASE =
  "inline-flex items-baseline gap-1.5 rounded-full border transition-colors focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none";

export interface ChipProps {
  density?: ChipDensity;
  tone?: ChipTone;
  /** Renders an <a>. */
  href?: string;
  /** Renders a <button> — unless `href` is also given, in which case it stays
   *  a real link and the handler intercepts the click. */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Constrain and ellipsize — required inside fixed-width table cells. */
  truncate?: boolean;
  className?: string;
  children: React.ReactNode;
  title?: string;
  "aria-label"?: string;
}

export function Chip({
  density = "comfortable",
  tone = "neutral",
  href,
  onClick,
  truncate,
  className,
  children,
  ...rest
}: ChipProps) {
  const interactive = Boolean(href || onClick);
  const classes = cn(
    BASE,
    DENSITY[density],
    TONE[tone],
    // Tailwind v4's preflight leaves <button> on the UA arrow cursor, so an
    // interactive chip has to ask for the pointer or it reads as static text.
    interactive ? cn(TONE_HOVER[tone], "cursor-pointer") : "cursor-default",
    // NOT `truncate` here: text-overflow applies to a block container, and a
    // Chip is inline-flex — its text becomes an anonymous flex item and gets
    // clipped with NO ellipsis. The ellipsis lives on a block child instead.
    truncate && "min-w-0 max-w-full",
    className,
  );

  const body = truncate ? (
    <span className="min-w-0 truncate">{children}</span>
  ) : (
    children
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} {...rest}>
        {body}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes} {...rest}>
        {body}
      </button>
    );
  }
  return (
    <span className={classes} {...rest}>
      {body}
    </span>
  );
}

/**
 * The count inside a chip. One treatment, taking its colour from the parent
 * tone rather than being restated at every call site.
 */
export function ChipCount({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("tabular-nums opacity-60", className)}>{children}</span>
  );
}
