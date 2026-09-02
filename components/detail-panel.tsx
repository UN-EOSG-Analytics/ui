import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

/**
 * DETAIL PANEL — the record view that opens when a row is clicked.
 *
 * The estate's most reused workflow: mandates, open, system-chart and
 * un80-actions all have one, and it is where the hierarchy and typography
 * arguments actually happen.
 *
 * It owns the SHELL STRUCTURE and the CONTENT HIERARCHY. Routing stays with
 * the product — mandates' intercepting route and its `router.back()` dismissal
 * are specific to that app and correct there.
 *
 * The shell is here because three of the four bugs found in mandates' panel
 * are structural, not stylistic, and a component can prevent them by
 * construction:
 *
 *   · The title was `sr-only`, so the header bar rendered `justify-end` with
 *     nothing but two buttons, and the visible title sat in the scroll area —
 *     where it scrolls away. `DetailPanel` puts the title in the header and
 *     keeps it there.
 *   · The body needs one explicit scroll container. Nesting it wrong makes the
 *     page scroll instead of the panel, and the header goes with it.
 *   · Controls sat flush against the panel edge, so a 2px focus ring with a
 *     2px offset had nowhere to go and clipped. The header reserves room.
 *
 * ---------------------------------------------------------------------------
 * THE PROBLEM THIS FIXES, measured on mandates' panel:
 *
 *   h1   text-xl md:text-2xl  bold       20 → 24px
 *   h2   text-base            semibold   16px
 *   h3   text-sm              semibold   14px   ← same size as body text
 *   body text-sm                         14px
 *
 * Three heading levels, but only two perceptible steps — h3 differs from the
 * paragraph beneath it by weight and colour alone. Add four ad-hoc greys
 * (gray-900 / 600 / 500 / 400) and 10px text in three child components, and
 * the panel reads as flat and cramped rather than structured.
 *
 * THE HIERARCHY — three levels, each a real step:
 *
 *   eyebrow   12px  uppercase, tracked, muted   what kind of record this is
 *   title     20px  semibold                    the record's name
 *   section   16px  semibold                    a group within it
 *   body      14px  regular                     the content
 *   caption   12px  muted                       hints, counts, provenance
 *
 * A panel title is 20px, not 24px: a panel is not a page, and the page behind
 * it already owns the largest type on screen. 12px is the floor — child
 * components using 10px move to `caption`.
 *
 * SECTION HEADINGS ARE FULL QUESTIONS, and that is settled editorial content
 * — "Who cites this mandate in the budget?" is the heading, not a label. So
 * the hierarchy cannot come from shortening them. It comes from:
 *
 *   · SPACE. Generous separation above each section is what turns a long
 *     question into a boundary rather than another paragraph. This is the main
 *     lever when the words are fixed.
 *   · A HAIRLINE above each section, so the break is visible before it is read.
 *   · The hint sitting INLINE against the heading, at caption size and muted.
 *     Pushed to the far edge it reads as unrelated text.
 *   · The title leaving the scroll area entirely, so it stops competing with
 *     four bold questions.
 *
 * un80-actions reads more clearly for a related reason — it holds a 12→18px
 * band and leans on weight rather than size. Not copied: 20px keeps the title
 * distinct from a section heading at a glance.
 * ---------------------------------------------------------------------------
 */

/** The panel's own header: kind, name, and an actions slot. */
export function DetailHeader({
  title,
  actions,
  children,
  className,
}: {
  /**
   * Only for a panel used WITHOUT the `DetailPanel` shell — a full page, say.
   * Inside the shell the name already lives in the sticky header, and
   * repeating it costs a screen's worth of the reader's attention for nothing.
   */
  title?: React.ReactNode;
  /** Buttons that act on the record. */
  actions?: React.ReactNode;
  /** Identifying metadata — symbol, type, organ, year. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-7", className)}>
      {(title || actions) && (
        <div className="mb-3 flex items-start justify-between gap-4">
          {/* 20px, not 24: a panel is not a page. */}
          {title && <h2 className={cn(typography.sectionTitle, "leading-tight")}>{title}</h2>}
          {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
        </div>
      )}
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

/**
 * A group within the panel. The heading is 16px against 14px body — a real
 * step, so the eye finds the structure without reading.
 */
export function DetailSection({
  heading,
  hint,
  children,
  className,
}: {
  heading: string;
  /** Secondary note beside the heading. Never the same weight as it. */
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // The headings are settled editorial content — full questions, and they
    // stay that way. So the break between sections has to come from SPACE, not
    // from shortening them: generous top padding plus a hairline, which does
    // the separating a shorter label would otherwise have done. No rule above
    // the first section; it already has the header above it.
    <section
      className={cn(
        "border-t border-border pt-8 first:border-t-0 first:pt-0",
        className,
      )}
    >
      {/* Baseline-aligned and adjacent, not justified apart: a hint pushed to
          the far edge of a wide panel stops reading as part of its heading. */}
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <h3 className={typography.subTitle}>{heading}</h3>
        {hint && <span className={typography.caption}>{hint}</span>}
      </div>
      <div className={typography.body}>{children}</div>
    </section>
  );
}

/**
 * A label/value pair. The label is an eyebrow, not a heading — it names the
 * field rather than introducing a section, so it must not compete with
 * `DetailSection`. That distinction is what a third *heading* level got wrong.
 */
export function DetailField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className={cn(typography.eyebrow, "mb-0.5 text-muted-foreground")}>{label}</dt>
      <dd className={typography.body}>{children}</dd>
    </div>
  );
}

/** A responsive grid of fields. */
export function DetailFields({
  columns = 2,
  children,
  className,
}: {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </dl>
  );
}

/**
 * The panel shell: a fixed header that keeps the record's name in view, and a
 * body that is the only thing which scrolls.
 *
 * Drop it inside whatever dialog/sheet primitive the product already uses —
 * this does not replace routing or dismissal.
 */
export function DetailPanel({
  title,
  eyebrow,
  controls,
  children,
  className,
}: {
  /** The record's name. VISIBLE, and it stays visible while the body scrolls. */
  title: React.ReactNode;
  eyebrow?: string;
  /** Close, expand — anything acting on the panel itself. */
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // h-full + flex-col is what makes the BODY scroll rather than the page.
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <header className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-2.5">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className={cn(typography.eyebrow, "text-muted-foreground")}>{eyebrow}</p>
          )}
          {/* Truncates rather than wrapping: the header is a fixed anchor, so
              a long title must not change its height as you scroll. */}
          <h2 className={cn(typography.subTitle, "truncate")}>{title}</h2>
        </div>
        {/* pe-1 leaves room for a focus ring. Flush against the edge, a 2px
            ring with a 2px offset is clipped by the panel boundary. */}
        {controls && <div className="flex shrink-0 items-center gap-1 pe-1">{controls}</div>}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
    </div>
  );
}
