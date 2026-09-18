import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface ChartHeaderProps {
  yearControl?: React.ReactNode;
  controls?: React.ReactNode;
  search?: React.ReactNode;
  summaries?: readonly {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
  }[];
}
/** Shared reading order: controls, year, search, then right-aligned totals. */
export function ChartHeader({
  yearControl,
  controls,
  search,
  summaries = [],
}: ChartHeaderProps) {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {controls}
        {yearControl}
        {search}
      </div>
      {summaries.length > 0 && (
        <dl className="ms-auto flex flex-wrap items-end justify-end gap-x-6 gap-y-2">
          {summaries.map((summary) => (
            <div key={summary.key} className="min-w-0 text-end">
              <dt className={typography.meta}>{summary.label}</dt>
              <dd className={cn(typography.chartTotal, "tabular-nums")}>
                {summary.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
