"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";
import { Tooltip } from "./tooltip";

export interface SegmentedControlProps {
  label: string;
  options: readonly {
    value: string;
    label: string;
    disabled?: boolean;
    description?: string;
  }[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  borderless?: boolean;
}

/** Shared single-choice presentation for two or more options. */
export function SegmentedControl({
  label,
  options,
  value,
  onValueChange,
  disabled = false,
  borderless = false,
}: SegmentedControlProps) {
  const name = React.useId();
  return (
    <fieldset
      disabled={disabled}
      className={cn(
        "m-0 inline-flex min-w-0 flex-wrap rounded-md bg-secondary p-0.5",
        !borderless && "border border-border",
      )}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const choice = (
          <label className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => onValueChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                typography.caption,
                "block rounded-sm px-3 py-1 text-muted-foreground peer-checked:bg-un-white peer-checked:text-foreground peer-checked:shadow-sm peer-checked:font-medium peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-un-blue peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              )}
            >
              {option.label}
            </span>
          </label>
        );
        return option.description ? (
          <Tooltip key={option.value} content={option.description}>
            {choice}
          </Tooltip>
        ) : (
          <React.Fragment key={option.value}>{choice}</React.Fragment>
        );
      })}
    </fieldset>
  );
}
