import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

/**
 * A headline figure with its label — the stat tile.
 *
 * Extracted from mandates' `HeaderStats`. Stat tiles recur across the
 * data-heavy products (mandates, open, housekeeping) and each had rebuilt
 * them; this is the treatment that survived review.
 *
 * The composition is deliberate: label in UN Blue at body size, value large,
 * bold and **tabular** so a column of tiles lines up. Colour carries the tile,
 * not the number — the number is foreground, because it is the content.
 *
 * Renders a `<button>` when given `onClick`, a `<div>` otherwise, so nothing
 * looks interactive that isn't.
 */
export interface StatTileProps {
  /** Already-translated label. */
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  /** Locale for number grouping. Defaults to the runtime's. */
  locale?: string;
  className?: string;
}

export function StatTile({
  label,
  value,
  icon: Icon,
  onClick,
  locale,
  className,
}: StatTileProps) {
  const shown =
    typeof value === "number" ? value.toLocaleString(locale) : value;

  const content = (
    <>
      {Icon && <Icon className="size-4 shrink-0 text-un-blue-text" />}
      <span className={cn(typography.body, "leading-tight text-un-blue-text")}>
        {label}
      </span>
      <span className="ms-auto text-2xl leading-none font-bold tabular-nums text-foreground">
        {shown}
      </span>
    </>
  );

  const base = cn(
    "flex w-full items-center gap-2 rounded-lg bg-un-blue/10 px-3 py-1.5 text-start",
    className,
  );

  if (!onClick) return <div className={base}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        base,
        "transition-colors hover:bg-un-blue/20",
        "focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none",
      )}
    >
      {content}
    </button>
  );
}
