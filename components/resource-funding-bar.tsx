"use client";

import type { ReactNode } from "react";
import { formatBudget } from "../lib/format-budget";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

export interface ResourceMetrics {
  required: number;
  available: number;
  spent: number;
}

export interface ResourceLabels {
  required: string;
  available: string;
  spent: string;
}

/** Required, available and spent resources share one origin and scale. */
export function ResourceFundingBar({
  required,
  available,
  spent,
  labels,
  color = "var(--color-un-blue)",
  showLabels = true,
  compact = false,
  formatValue = formatBudget,
}: ResourceMetrics & {
  labels: ResourceLabels;
  color?: string;
  showLabels?: boolean;
  compact?: boolean;
  formatValue?: (value: number) => ReactNode;
}) {
  const maximum = Math.max(1, required, available, spent);
  const rows = [
    {
      key: "required",
      label: labels.required,
      value: required,
      color: "var(--color-neutral-border)",
    },
    {
      key: "available",
      label: labels.available,
      value: available,
      color: `color-mix(in srgb, ${color} 35%, transparent)`,
    },
    { key: "spent", label: labels.spent, value: spent, color },
  ].map((row) => ({
    ...row,
    percent: Math.max(0, (row.value / maximum) * 100),
  }));

  if (!showLabels)
    return (
      <div className="relative h-2 overflow-hidden rounded-sm bg-muted">
        {[...rows]
          .sort((a, b) => b.percent - a.percent)
          .map((row) => (
            <span
              key={row.key}
              data-resource={row.key}
              data-value={row.value}
              className="absolute inset-y-0 start-0 rounded-sm"
              style={{ width: `${row.percent}%`, backgroundColor: row.color }}
            />
          ))}
      </div>
    );

  return (
    <dl className={cn("space-y-2", compact && "w-64 max-w-full")}>
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-2">
          <dt className={cn(typography.caption, "w-24 shrink-0")}>
            {row.label}
          </dt>
          <dd className="flex min-w-0 flex-1 items-center gap-2">
            <span
              aria-hidden
              className="h-2 min-w-4 flex-1 overflow-hidden rounded-sm bg-muted"
            >
              <span
                className="block h-full rounded-sm"
                style={{ width: `${row.percent}%`, backgroundColor: row.color }}
              />
            </span>
            <span
              className={cn(
                typography.caption,
                "w-20 shrink-0 text-end tabular-nums",
              )}
            >
              {formatValue(row.value)}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
