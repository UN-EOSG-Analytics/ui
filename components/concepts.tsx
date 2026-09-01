import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";
import { Chip, type ChipDensity } from "./chip";

/**
 * CONCEPT COMPONENTS
 * ==================
 * The layer above the primitives.
 *
 *   tokens  →  primitives  →  CONCEPTS  →  product pages
 *   colour     Chip           EntityRef     mandates
 *   type       Button         DocumentSymbol  housekeeping
 *   spacing    Table          BudgetFigure    system-chart
 *              Modal          CountBadge      open
 *
 * A primitive knows how a pill is drawn. A concept knows what an *entity*
 * looks like — and that is where consistency actually lives for these
 * products, because the domain concepts recur far more than the widgets do.
 *
 * The audit found "entity" rendered in all four data products, and mandates'
 * chip system already had a latent concept axis: its `ChipKind` type is
 * literally `'entity' | 'topic' | 'organ' | 'docType' | 'budget' | 'plain'`.
 * These components make that axis real.
 *
 * Why this is the layer that makes agentic work faster: asked to "show the
 * entity", an agent reaches for `<EntityRef>` instead of re-deciding acronym
 * vs full name, chip vs text, and which grey. The decision was made once.
 */

/* ---------------------------------------------------------------------------
 * ENTITY — a UN entity: UNDP, OCHA, DPPA.
 *
 * Always an acronym + long-name pair. Every product stores both and then
 * disagrees about which to show where; the rule here is that the acronym is
 * the identifier and the long name is the gloss. `title` carries the long name
 * so it is available on hover even in the compact forms.
 * ------------------------------------------------------------------------- */

export interface EntityRefProps {
  /** Short form — "UNDP". The identifier. */
  acronym: string;
  /** Long form — "United Nations Development Programme". The gloss. */
  name?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** `chip` for lists and facets, `inline` for running text, `block` for headers. */
  variant?: "chip" | "inline" | "block";
  density?: ChipDensity;
  selected?: boolean;
  className?: string;
}

export function EntityRef({
  acronym,
  name,
  href,
  onClick,
  variant = "chip",
  density = "dense",
  selected,
  className,
}: EntityRefProps) {
  if (variant === "block") {
    // The header treatment: acronym large, long name beneath as the gloss.
    return (
      <div className={className}>
        <div className={typography.sectionTitle}>{acronym}</div>
        {name && <div className={typography.meta}>{name}</div>}
      </div>
    );
  }

  if (variant === "inline") {
    // In running text an entity is not a pill — pills break the line. It is
    // the acronym, marked as an abbreviation so the long form is exposed.
    return (
      <abbr
        title={name}
        className={cn("font-medium text-un-blue-text no-underline", className)}
      >
        {acronym}
      </abbr>
    );
  }

  return (
    <Chip
      density={density}
      tone={selected ? "selected" : "neutral"}
      href={href}
      onClick={onClick}
      title={name}
      aria-label={name ? `${acronym} — ${name}` : acronym}
      className={className}
    >
      {acronym}
    </Chip>
  );
}

/* ---------------------------------------------------------------------------
 * DOCUMENT SYMBOL — "A/RES/79/1".
 *
 * Deliberately NOT a Chip. A symbol is not a facet you filter by, it is the
 * document's identifier, and it reads as a code rather than a label: square
 * corners, a blue ground, monospaced. Keeping it visually distinct from the
 * pill vocabulary is the point — scanning a list, you can tell "this IS the
 * document" from "this is something ABOUT the document" without reading either.
 *
 * Carried from mandates, where it replaced four different renderings of the
 * same symbol (blue block, mono chip, bare mono in blue, bare mono in grey).
 * ------------------------------------------------------------------------- */

export interface DocumentSymbolProps {
  children: React.ReactNode;
  href?: string;
  /** The document you are already on — present, but not somewhere to go. */
  subdued?: boolean;
  className?: string;
  title?: string;
}

export function DocumentSymbol({
  children,
  href,
  subdued,
  className,
  ...rest
}: DocumentSymbolProps) {
  const classes = cn(
    "inline-block rounded-sm px-2 py-0.5 font-mono text-xs font-medium",
    subdued
      ? "bg-secondary text-muted-foreground"
      : "bg-un-blue-tint-50 text-un-blue-text",
    href &&
      "transition-colors hover:bg-un-blue-tint focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none",
    className,
  );
  return href ? (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  ) : (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * BUDGET FIGURE — money.
 *
 * `open` alone reimplements `Intl.NumberFormat` in six places. Currency
 * formatting is a concept, not a call-site decision: the same figure should
 * not be "$1,234,567" in a table and "$1.2M" in a tooltip by accident.
 *
 * Always tabular figures — budget numbers stack in columns.
 * ------------------------------------------------------------------------- */

export interface BudgetFigureProps {
  amount: number;
  currency?: string;
  /** Abbreviate to $1.2M. Use in tight spaces; never in a total. */
  compact?: boolean;
  className?: string;
}

export function formatBudget(amount: number, currency = "USD", compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(amount);
}

export function BudgetFigure({
  amount,
  currency = "USD",
  compact,
  className,
}: BudgetFigureProps) {
  return (
    <span
      className={cn("tabular-nums", className)}
      // The exact figure stays available when the display is abbreviated.
      title={compact ? formatBudget(amount, currency, false) : undefined}
    >
      {formatBudget(amount, currency, compact)}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * COUNT — "142 mandates".
 *
 * A count is a number plus the thing being counted, and the noun has to
 * pluralise. Every product does this ad hoc; getting it wrong ("1 mandates")
 * is the most visible small bug there is.
 * ------------------------------------------------------------------------- */

export interface CountProps {
  value: number;
  /** Singular noun — "mandate". The plural is formed by the caller's locale. */
  singular: string;
  plural?: string;
  className?: string;
}

export function Count({ value, singular, plural, className }: CountProps) {
  const noun = value === 1 ? singular : (plural ?? `${singular}s`);
  return (
    <span className={cn("tabular-nums", className)}>
      {value.toLocaleString()} {noun}
    </span>
  );
}
