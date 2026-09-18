import type { ReactNode } from "react";
import { MousePointerClick } from "lucide-react";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

export interface FinancialTooltipRow {
  label: string;
  value: ReactNode;
  color?: string;
  /** Share of the displayed total, from zero to one. Omit for negative values. */
  share?: number;
}
export interface FinancialTooltipProps {
  title?: string;
  parents?: readonly { label: string; color?: string }[];
  context?: ReactNode;
  total?: { label: string; value: ReactNode };
  rows?: readonly FinancialTooltipRow[];
  notes?: ReactNode;
  actionHint?: string;
}

/** Content only: chart libraries retain pointer positioning and focus handling. */
export function FinancialTooltip({
  title,
  parents = [],
  context,
  total,
  rows = [],
  notes,
  actionHint,
}: FinancialTooltipProps) {
  const bars = rows.some((row) => row.share !== undefined);
  return (
    <div className="w-full min-w-0 max-w-sm space-y-2 text-start text-un-black">
      {parents.length > 0 && (
        <div
          className={cn(
            typography.label,
            "font-normal",
            "flex flex-col items-start gap-1",
          )}
        >
          {parents.map((parent, index) => (
            <span
              key={`${index}-${parent.label}`}
              className="inline-flex min-w-0 items-center gap-1.5"
            >
              <span className="whitespace-normal break-words">
                {parent.label}
              </span>
              {parent.color && (
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: parent.color }}
                />
              )}
            </span>
          ))}
        </div>
      )}
      {(title || context) && (
        <div>
          {title && (
            <p
              className={cn(
                typography.body,
                "font-semibold whitespace-normal break-words",
              )}
            >
              {title}
            </p>
          )}
          {context && (
            <div className={cn(typography.label, "font-normal", "mt-1")}>
              {context}
            </div>
          )}
        </div>
      )}
      {total && (
        <div
          className={cn(
            typography.body,
            "flex items-baseline justify-between gap-4 font-normal",
          )}
        >
          <span>{total.label}</span>
          <span className="shrink-0 tabular-nums">{total.value}</span>
        </div>
      )}
      {rows.length > 0 && (
        <div
          className={cn(
            typography.label,
            "font-normal",
            "grid items-center gap-x-3 gap-y-1.5",
            bars
              ? "grid-cols-[minmax(0,1fr)_3rem_auto]"
              : "grid-cols-[minmax(0,1fr)_auto]",
          )}
        >
          {rows.map((row, index) => (
            <div key={`${index}-${row.label}`} className="contents">
              <span className="flex min-w-0 items-center gap-1.5">
                {!bars && row.color && (
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                )}
                <span className="whitespace-normal break-words">
                  {row.label}
                </span>
              </span>
              {bars && (
                <span aria-hidden="true" className="h-1.5 w-full">
                  {row.share !== undefined &&
                    Number.isFinite(row.share) &&
                    row.share >= 0 && (
                      <span
                        className="block h-full rounded-sm"
                        style={{
                          width: `${Math.min(1, row.share) * 100}%`,
                          backgroundColor: row.color ?? "var(--color-un-blue)",
                        }}
                      />
                    )}
                </span>
              )}
              <span className="text-end tabular-nums whitespace-nowrap">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
      {notes && (
        <div
          className={cn(
            typography.label,
            "font-normal",
            "space-y-1 whitespace-normal",
          )}
        >
          {notes}
        </div>
      )}
      {actionHint && (
        <p
          className={cn(
            typography.label,
            "font-normal",
            "flex items-center gap-1.5 pt-1",
          )}
        >
          <MousePointerClick
            aria-hidden="true"
            className="size-3.5 shrink-0 text-un-blue"
          />
          {actionHint}
        </p>
      )}
    </div>
  );
}
