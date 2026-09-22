import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface DocumentSymbolProps {
  children: React.ReactNode;
  href?: string;
  /** The current document: an identifier without navigation. */
  subdued?: boolean;
  className?: string;
  title?: string;
  "aria-label"?: string;
}

/** Canonical Mandates treatment: a light rectangular identifier, never a facet pill. */
export function DocumentSymbol({
  children,
  href,
  subdued,
  className,
  ...rest
}: DocumentSymbolProps) {
  const classes = cn(
    typography.label,
    "inline-block rounded px-2 py-0.5",
    subdued ? "bg-secondary text-foreground" : "bg-accent text-accent-foreground",
    href &&
      "transition-colors hover:bg-un-blue-tint focus-visible:ring-2 focus-visible:ring-un-blue focus-visible:ring-offset-1 focus-visible:outline-none",
    className,
  );
  return href ? (
    <a href={href} dir="ltr" className={classes} {...rest}>
      {children}
    </a>
  ) : (
    <span dir="ltr" className={classes} {...rest}>
      {children}
    </span>
  );
}
