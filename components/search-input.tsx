import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * Full-text search input.
 *
 * Extracted from mandates' `SearchInput`, which already had the three variants
 * the estate actually uses. The icon and the clear affordance are part of the
 * component rather than re-assembled at each call site — the audit found search
 * boxes rebuilt in eight places across two products.
 *
 * `type="search"` and an `aria-label` are not optional: a search field with a
 * placeholder but no label is invisible to screen readers once it has content.
 */
export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /**
   * · `bordered`      — standard boxed field (default)
   * · `border-bottom` — sidebar/underline treatment
   * · `minimal`       — transparent, for dense toolbars
   */
  variant?: "bordered" | "border-bottom" | "minimal";
  /** Show a clear button once there is content. */
  showClear?: boolean;
  onClear?: () => void;
  /** Required — this is the accessible name. */
  "aria-label": string;
}

const VARIANT = {
  bordered: "border border-input rounded-md bg-background",
  "border-bottom":
    "border-0 border-b border-border bg-transparent rounded-none focus-visible:border-un-blue",
  minimal: "border-0 bg-transparent rounded-md",
} as const;

export function SearchInput({
  variant = "bordered",
  showClear = false,
  onClear,
  className,
  value,
  ...props
}: SearchInputProps) {
  const hasValue = value != null && String(value).length > 0;

  return (
    <div className="relative flex items-center">
      <Search
        aria-hidden
        className="pointer-events-none absolute start-2.5 size-4 text-muted-foreground"
      />
      <input
        type="search"
        value={value}
        className={cn(
          "h-9 w-full ps-8 pe-8 text-sm text-foreground transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none",
          // The UA's own clear affordance would sit next to ours.
          "[&::-webkit-search-cancel-button]:appearance-none",
          VARIANT[variant],
          className,
        )}
        {...props}
      />
      {showClear && hasValue && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute end-2 rounded-sm text-muted-foreground transition-opacity hover:text-foreground focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
