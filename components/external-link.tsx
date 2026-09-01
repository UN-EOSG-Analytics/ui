import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface ExternalLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  /**
   * Translated "opens in new tab" text, announced to assistive tech. Passed in
   * rather than read from a hook so the component stays framework-agnostic —
   * and because it must be translated.
   */
  newTabLabel?: string;
}

/**
 * Anchor that opens in a new tab and *says so* to screen readers via a
 * visually-hidden suffix. Visible text is unchanged.
 *
 * Appears in four products. Opening a new tab without announcing it is a
 * WCAG 3.2.5 (Change on Request) problem: the context changes with no warning.
 */
export function ExternalLink({
  children,
  newTabLabel = "opens in new tab",
  ...rest
}: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="sr-only"> ({newTabLabel})</span>
    </a>
  );
}
