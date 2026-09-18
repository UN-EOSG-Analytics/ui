"use client";

import { SegmentedControl } from "./segmented-control";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface BinaryToggleProps {
  label: string;
  options: readonly [
    { value: string; label: string },
    { value: string; label: string },
  ];
  value: string;
  onValueChange: (value: string) => void;
  variant?: "switch" | "segmented";
  disabled?: boolean;
}

/** Two mutually exclusive choices, with switch and segmented presentations. */
export function BinaryToggle({
  label,
  options,
  value,
  onValueChange,
  variant = "switch",
  disabled = false,
}: BinaryToggleProps) {
  const checked = value === options[1].value;
  if (variant === "segmented") {
    return (
      <SegmentedControl
        label={label}
        options={options}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    );
  }
  return (
    <div
      className={cn("inline-flex items-center gap-2", disabled && "opacity-50")}
    >
      <span
        className={cn(
          typography.meta,
          !checked && "font-medium text-foreground",
        )}
      >
        {options[0].label}
      </span>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onValueChange(options[checked ? 0 : 1].value)}
        className={cn(
          "inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-un-blue disabled:cursor-not-allowed",
          checked ? "bg-un-blue" : "bg-gray-200",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-un-white shadow-lg transition-transform",
            checked ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0",
          )}
        />
      </button>
      <span
        className={cn(
          typography.meta,
          checked && "font-medium text-foreground",
        )}
      >
        {options[1].label}
      </span>
    </div>
  );
}
