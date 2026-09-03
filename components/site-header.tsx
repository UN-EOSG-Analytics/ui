"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Menu } from "lucide-react";
import { cn } from "../lib/utils";
import { UN_EMBLEM_SRC, UnEmblem } from "./un-logos";

export type HeaderTransparency = "none" | "low" | "high";

const siteHeaderTransparencyClasses: Record<HeaderTransparency, string> = {
  none: "bg-background",
  low: "bg-background/95 backdrop-blur-sm",
  high:
    "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60",
};

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
  /** Accessible name for the built-in mobile-menu trigger. Translate it. */
  mobileMenuLabel?: string;
  /**
   * Disable when supplying custom mobile navigation through `children`.
   * Defaults to true whenever `navItems` are present.
   */
  showMobileMenu?: boolean;
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
  /** Background transparency. Defaults to the original treatment. */
  transparency?: HeaderTransparency;
  /**
   * Optional emblem override for exceptional hosts. The default is bundled,
   * so ordinary consumers do not need to serve a local emblem asset.
   */
  emblemSrc?: string;
}

/** Official UN emblem bundled as a package asset. */
export const DEFAULT_EMBLEM_SRC = UN_EMBLEM_SRC;

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
function Emblem({ className, src }: { className?: string; src?: string }) {
  return (
    <UnEmblem
      src={src}
      width={152}
      height={127}
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
  mobileMenuLabel = "Open navigation menu",
  showMobileMenu = true,
  emblemPlacement = "inline",
  outboardOffset = "56.74px",
  children,
  className,
  containerClassName = "max-w-4xl px-8 sm:px-12 lg:max-w-6xl lg:px-16",
  transparency = "high",
  emblemSrc = DEFAULT_EMBLEM_SRC,
}: SiteHeaderProps) {
  const outboard = emblemPlacement === "outboard";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border py-3",
        siteHeaderTransparencyClasses[transparency],
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
            <Emblem src={emblemSrc} />
          </a>
        )}

        <a
          href={href}
          aria-label={homeLabel}
          className="inline-flex items-center gap-emblem-gap transition-opacity hover:opacity-75"
        >
          <Emblem src={emblemSrc} className={outboard ? "min-[1408px]:hidden" : undefined} />
          {/* Mobile stacks wordmark over badge to preserve room beside the
              right-hand slot. */}
          <span className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-2.5">
            <span className="text-wordmark leading-none tracking-tight text-foreground">
              {/* Both halves are real text so the baseline lines up exactly;
                  same size, only the weight differs. */}
              <span className="hidden font-bold md:inline">{brand} </span>
              <span className="font-light">{descriptor}</span>
            </span>
            {badge && (
              <span className="rounded-md bg-un-blue/10 px-1.5 py-0.5 text-micro leading-none font-semibold whitespace-nowrap text-un-blue md:px-2 md:py-1 md:text-xs">
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
                      "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                      active
                        ? "bg-un-blue/10 font-medium text-un-blue"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {Icon && <Icon className="size-4" />}
                    {label}
                  </a>
                );
              })}
            </nav>
          )}
          {showMobileMenu && navItems.length > 0 && (
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  aria-label={mobileMenuLabel}
                  className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground/80 transition-colors hover:text-foreground focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none lg:hidden"
                >
                  <Menu aria-hidden className="size-6" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={4}
                  className="z-50 min-w-48 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                >
                  {navItems.map(({ href: itemHref, label, icon: Icon }) => {
                    const active = activeHref === itemHref;
                    return (
                      <DropdownMenu.Item
                        key={itemHref}
                        asChild={!active}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-foreground outline-none select-none focus:bg-accent focus:text-accent-foreground",
                          active &&
                            "bg-un-blue/10 font-medium text-un-blue-text focus:bg-un-blue/10 focus:text-un-blue-text",
                        )}
                      >
                        {active ? (
                          <span className="flex items-center gap-2">
                            {Icon && <Icon aria-hidden className="size-4" />}
                            {label}
                          </span>
                        ) : (
                          <a href={itemHref} className="flex items-center gap-2">
                            {Icon && <Icon aria-hidden className="size-4" />}
                            {label}
                          </a>
                        )}
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
