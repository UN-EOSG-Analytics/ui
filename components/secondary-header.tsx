import {
  Fragment,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import type { HeaderTransparency } from "./site-header";

export interface SecondaryHeaderItem {
  href: string;
  /** Already-translated label. */
  label: string;
}

export interface SecondaryHeaderLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

export interface SecondaryHeaderProps {
  items: readonly SecondaryHeaderItem[];
  /** Accessible navigation label, translated by the caller. */
  label: string;
  activeHref?: string;
  transparency?: HeaderTransparency;
  className?: string;
  containerClassName?: string;
  /** Keeps client-side routing in framework-specific consumers. */
  renderLink?: (props: SecondaryHeaderLinkProps) => ReactNode;
}

const secondaryHeaderTransparencyClasses: Record<
  HeaderTransparency,
  string
> = {
  none: "bg-white",
  low: "bg-white/95 backdrop-blur-sm",
  high:
    "bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60",
};

/** Sticky page-section navigation extracted from the Transparency Portal. */
export function SecondaryHeader({
  items,
  label,
  activeHref,
  transparency = "low",
  className,
  containerClassName = "max-w-6xl px-6 md:px-12 lg:px-16",
  renderLink,
}: SecondaryHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-[65px] z-30 border-b border-gray-200 min-[1408px]:top-14",
        secondaryHeaderTransparencyClasses[transparency],
        className,
      )}
    >
      <nav
        aria-label={label}
        className={cn("mx-auto flex overflow-x-auto", containerClassName)}
      >
        {items.map((item) => {
          const active = activeHref === item.href;
          const linkProps: SecondaryHeaderLinkProps = {
            href: item.href,
            "aria-current": active ? "page" : undefined,
            className: cn(
              "shrink-0 border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors first:pl-0",
              active
                ? "border-un-blue font-semibold text-un-blue"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900",
            ),
            children: item.label,
          };

          return renderLink ? (
            <Fragment key={item.href}>{renderLink(linkProps)}</Fragment>
          ) : (
            <a key={item.href} {...linkProps} />
          );
        })}
      </nav>
    </div>
  );
}
