"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface LanguageOption {
  value: string;
  /** Native endonym, supplied by the host: English, Français, العربية… */
  label: string;
  /** Compact trigger text; defaults to the uppercase value. */
  shortLabel?: string;
}

export interface LanguagePickerProps {
  options: readonly LanguageOption[];
  value: string;
  onChange: (value: string) => void;
  /** Translated accessible name and dropdown heading. */
  label: string;
  pending?: boolean;
  compact?: boolean;
  /** Pass the host's UI direction; endonyms remain independently isolated. */
  dir?: "ltr" | "rtl";
  className?: string;
}

/** The existing Transcripts preference pill, with logical inline padding. */
export const headerPillClass =
  "box-border inline-flex h-8 items-center gap-1.5 rounded-md border-0 bg-transparent ps-2 pe-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const pickerFont = { fontFamily: "var(--font-sans, Roboto, sans-serif)" };

/** Router-independent extraction of Transcripts' language dropdown.
 * Radix supplies Arrow/Home/End navigation, typeahead, Escape and focus return.
 * The host owns the selected language and any asynchronous pending state.
 */
export function LanguagePicker({
  options, value, onChange, label, pending = false, compact = false, dir, className,
}: LanguagePickerProps) {
  const active = options.find(option => option.value === value);
  const selectedLabel = active?.label ?? value;
  const change = (next: string) => {
    if (!pending && next !== value) onChange(next);
  };
  return (
    <DropdownMenu.Root modal={false} dir={dir}>
      <DropdownMenu.Trigger asChild>
        <button type="button" disabled={pending || options.length === 0}
          aria-label={`${label}: ${selectedLabel}`} aria-busy={pending || undefined}
          style={pickerFont}
          className={cn(headerPillClass, "disabled:cursor-wait disabled:opacity-60", className)}>
          <bdi lang={value}>{compact ? active?.shortLabel ?? value.toUpperCase() : selectedLabel}</bdi>
          {!compact && <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 opacity-60" />}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={4} aria-label={label}
          style={pickerFont}
          className="box-border z-50 w-44 rounded-md border border-solid border-border bg-popover p-1 text-popover-foreground shadow-md [&_*]:box-border">
          <DropdownMenu.Label className={cn(typography.label, "px-2 pt-1.5 pb-1 text-muted-foreground")}>
            {label}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={value} onValueChange={change}>
            {options.map(option => <DropdownMenu.RadioItem key={option.value} value={option.value}
              textValue={option.label} disabled={pending} lang={option.value}
              className={cn(typography.body,
                "flex w-full cursor-default items-center justify-between rounded-md px-2 py-1.5 leading-5 text-start outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring data-[highlighted]:bg-muted disabled:opacity-60",
                option.value === value ? "font-semibold text-foreground" : "text-muted-foreground")}>
              <bdi>{option.label}</bdi>
              <DropdownMenu.ItemIndicator aria-hidden="true" className={cn(typography.label, "ms-2 text-un-blue-text")}>●</DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>)}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
