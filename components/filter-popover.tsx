"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";
import { SearchInput } from "./search-input";
import { Button } from "./button";

/**
 * Filter popover — a facet list with counts.
 *
 * Extracted from mandates' `PopoverFilterList`, which carries two decisions
 * worth keeping:
 *
 * · Search appears only once the list exceeds ~10 items. A search box over six
 *   options is noise.
 * · Counts get a proportional bar. The number alone makes you do the
 *   comparison; the bar does it for you.
 *
 * Selection state is a check plus a fill, never colour alone.
 */

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterPopoverProps {
  /** Facet name, e.g. "Organ". Translated by the caller. */
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  /** Below this many options the search box is hidden. */
  searchThreshold?: number;
  searchLabel?: string;
  clearLabel?: string;
  className?: string;
}

export function FilterPopover({
  label,
  options,
  selected,
  onChange,
  searchThreshold = 10,
  searchLabel = "Search options",
  clearLabel = "Clear",
  className,
}: FilterPopoverProps) {
  const [term, setTerm] = React.useState("");
  const showSearch = options.length > searchThreshold;
  const maxCount = Math.max(...options.map((o) => o.count), 1);

  const visible = term
    ? options.filter((o) => o.label.toLowerCase().includes(term.toLowerCase()))
    : options;

  const toggle = (value: string) =>
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            selected.length > 0 &&
              "border-un-blue bg-un-blue-tint-50 text-un-blue-text",
            className,
          )}
        >
          {label}
          {selected.length > 0 && (
            <span className="tabular-nums">({selected.length})</span>
          )}
          <ChevronDown className="opacity-60" />
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-72 rounded-md border border-border bg-popover p-2 shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          {showSearch && (
            <div className="mb-2">
              <SearchInput
                aria-label={searchLabel}
                placeholder={searchLabel}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                showClear
                onClear={() => setTerm("")}
                variant="bordered"
              />
            </div>
          )}

          <ul className="max-h-72 overflow-y-auto" role="listbox" aria-multiselectable>
            {visible.map((o) => {
              const isSelected = selected.includes(o.value);
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggle(o.value)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start transition-colors",
                      "hover:bg-accent focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none",
                      isSelected && "bg-un-blue-tint-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                        isSelected
                          ? "border-un-blue bg-un-blue text-white"
                          : "border-input",
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                    <span className={cn(typography.body, "min-w-0 flex-1 truncate")}>
                      {o.label}
                    </span>
                    {/* Count, with a proportional bar so magnitude reads at a
                        glance rather than needing arithmetic. */}
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span
                        aria-hidden
                        className="block h-1 rounded-full bg-un-blue/30"
                        style={{ width: `${Math.max((o.count / maxCount) * 28, 2)}px` }}
                      />
                      <span className={cn(typography.caption, "tabular-nums")}>
                        {o.count}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className={cn(typography.caption, "px-2 py-3")}>No matches.</li>
            )}
          </ul>

          {selected.length > 0 && (
            <div className="mt-2 border-t border-border pt-2">
              <Button variant="ghost" size="sm" onClick={() => onChange([])}>
                {clearLabel}
              </Button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
