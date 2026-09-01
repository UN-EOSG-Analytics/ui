import * as React from "react";
import { cn } from "../lib/utils";

export interface NavItem {
  href: string;
  /** Already-translated label. Never hardcode copy inside this component. */
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SiteHeaderProps {
  /**
   * The two halves of the wordmark, kept separate on purpose.
   *
   * Both render at the same size; only the weight differs — bold brand, light
   * descriptor. They are separate props (not one string) because each locale
   * translates them independently, and because the brand half hides on narrow
   * viewports while the descriptor stays.
   *
   * Brand-first regardless of locale grammar: this is a logotype, not a
   * sentence. Pass already-translated strings — e.g. from next-intl
   * `t("header.wordmarkBrand")`.
   */
  brand: string;
  descriptor: string;
  /** Optional status pill, e.g. "Public Preview". Translated by the caller. */
  badge?: string;
  /** Where the lockup links to. */
  href?: string;
  /** Accessible name for the home link. Translated by the caller. */
  homeLabel?: string;
  navItems?: NavItem[];
  /**
   * The currently-active nav href. Passed in rather than read from
   * `usePathname()` so this works with any router — including locale-prefixed
   * routing, where the pathname does not match the href directly.
   */
  activeHref?: string;
  /**
   * `outboard` tucks the emblem into the page margin on wide viewports, so the
   * wordmark aligns with the main column. `inline` keeps it beside the
   * wordmark always. Production uses outboard above ~1400px.
   */
  emblemPlacement?: "inline" | "outboard";
  /**
   * Distance from the container's left edge back to the emblem, for the
   * outboard variant. Depends on the app's own page padding, so it is a
   * parameter: `lg:px-16` (64px) − the 7.26px lockup gap = 56.74px.
   */
  outboardOffset?: string;
  /** Right-hand slot: language pickers, auth links, theme toggle. */
  children?: React.ReactNode;
  className?: string;
  /** Container width/padding, matched to the app's <main> column. */
  containerClassName?: string;
}

/**
 * The UN emblem.
 *
 * Geometry comes from tokens, not literals. The source SVG is 152×127 —
 * 1.198:1 — so at the h-10 (40px) lockup both transcripts and mandates use, it
 * is 47.9px wide. That is why `w-[47.9px]` appears in both codebases; it is
 * derived, not arbitrary, and `--spacing-emblem-w` gives it a name.
 *
 * A plain <img> rather than next/image: it is a fixed-size SVG, so there is no
 * optimisation to gain, and it keeps the package usable outside Next.
 */
function Emblem({ className }: { className?: string }) {
  return (
    <img
      src="/images/un-emblem-colour.svg"
      alt=""
      width={152}
      height={127}
      draggable={false}
      className={cn("h-10 w-emblem-w shrink-0 select-none", className)}
    />
  );
}

/**
 * Shared site header — emblem + wordmark lockup, nav, and a right-hand slot.
 *
 * Extracted from `transcripts/components/site-header.tsx` and
 * `mandates/website/src/components/SiteHeader.tsx`, which had already
 * converged on the same lockup independently: same emblem size, same
 * bold/light wordmark split, same badge treatment. This is that component,
 * once, with the copy lifted out into props.
 */
export function SiteHeader({
  brand,
  descriptor,
  badge,
  href = "/",
  homeLabel,
  navItems = [],
  activeHref,
  emblemPlacement = "inline",
  outboardOffset = "56.74px",
  children,
  className,
  containerClassName = "max-w-4xl px-8 sm:px-12 lg:max-w-6xl lg:px-16",
}: SiteHeaderProps) {
  const outboard = emblemPlacement === "outboard";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/95 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/60",
        className,
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex items-center gap-4",
          containerClassName,
        )}
      >
        {/* Outboard emblem: sits in the page margin so the wordmark lines up
            with the main column. Hidden below the breakpoint, where the inline
            copy inside the lockup takes over. */}
        {outboard && (
          <a
            href={href}
            aria-label={homeLabel}
            className="absolute top-1/2 hidden h-10 w-emblem-w -translate-y-1/2 transition-opacity hover:opacity-75 min-[1408px]:block"
            style={{ insetInlineEnd: `calc(100% - ${outboardOffset})` }}
          >
            <Emblem />
          </a>
        )}

        <a
          href={href}
          aria-label={homeLabel}
          className="inline-flex items-center gap-emblem-gap transition-opacity hover:opacity-75"
        >
          <Emblem className={outboard ? "min-[1408px]:hidden" : undefined} />
          {/* Mobile stacks wordmark over badge so the title can shrink without
              competing with the right-hand slot for row width. */}
          <span className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-2.5">
            <span className="text-lg leading-none tracking-tight text-foreground md:text-wordmark">
              {/* Both halves are real text so the baseline lines up exactly;
                  same size, only the weight differs. */}
              <span className="hidden font-bold md:inline">{brand} </span>
              <span className="font-light">{descriptor}</span>
            </span>
            {badge && (
              <span className="rounded-md bg-un-blue/10 px-1.5 py-0.5 text-micro leading-none font-semibold whitespace-nowrap text-un-blue-text md:px-2 md:py-1 md:text-xs">
                {badge}
              </span>
            )}
          </span>
        </a>

        <div className="ms-auto flex items-center gap-3">
          {navItems.length > 0 && (
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map(({ href: itemHref, label, icon: Icon }) => {
                const active = activeHref === itemHref;
                return (
                  <a
                    key={itemHref}
                    href={itemHref}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-un-blue/10 text-un-blue-text"
                        : "text-muted-foreground hover:bg-un-blue/10 hover:text-un-blue-text",
                    )}
                  >
                    {Icon && <Icon className="size-4" />}
                    {label}
                  </a>
                );
              })}
            </nav>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
