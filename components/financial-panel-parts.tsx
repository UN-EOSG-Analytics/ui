"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

/** Existing portal section hierarchy, kept separate from the fixed record header. */
export function FinancialPanelHeading({
  children,
  controls,
  subheading = false,
  className,
}: {
  children: React.ReactNode;
  controls?: React.ReactNode;
  subheading?: boolean;
  className?: string;
}) {
  const Tag = subheading ? "h4" : "h3";
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <Tag
        className={cn(
          subheading ? typography.subTitle : typography.sectionTitle,
          "normal-case",
        )}
      >
        {children}
      </Tag>
      {controls}
    </div>
  );
}

/** A headline metric uses the same type tier as a financial section heading. */
export function FinancialPanelTotalRow({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        typography.subTitle,
        "flex items-baseline justify-between gap-4",
      )}
    >
      <span className="min-w-0">{label}</span>
      <span className="shrink-0 text-end tabular-nums">{value}</span>
    </div>
  );
}

/** The caller supplies the scale; signed amounts remain visible even without a positive bar. */
export function FinancialPanelBreakdownRow({
  label,
  value,
  percent,
  color,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  percent?: number;
  color?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_5rem] items-center gap-3">
      <div className={cn(typography.caption, "min-w-0 text-foreground")}>
        {label}
      </div>
      <FinancialPanelBar percent={percent ?? 0} color={color} />
      <div
        className={cn(
          typography.caption,
          "text-end tabular-nums text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export interface FinancialPanelYearSelectorProps {
  years: readonly number[];
  selected: number;
  onChange: (year: number) => void;
  variant?: "underline" | "pill";
  label: string;
  pending?: boolean;
  pendingLabel?: string;
}
export function FinancialPanelYearSelector({
  years,
  selected,
  onChange,
  label,
  pending,
  pendingLabel,
  variant = "underline",
}: FinancialPanelYearSelectorProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex items-center gap-2">
      <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={label}
            className={cn(
              typography.meta,
              "inline-flex shrink-0 items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-un-blue/50",
              variant === "pill"
                ? "h-8 rounded-full bg-secondary px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                : "border-b border-gray-400 text-gray-600 hover:text-gray-900",
            )}
          >
            <span className="font-medium">{selected}</span>
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="z-[100] min-w-20 rounded-md border border-gray-300 bg-white p-1 shadow-md"
          >
            <div className="flex flex-col">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  aria-pressed={year === selected}
                  onClick={() => {
                    onChange(year);
                    setOpen(false);
                  }}
                  className={cn(
                    typography.body,
                    "rounded px-3 py-1.5 text-start",
                    year === selected
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {pending && (
        <span role="status" className={typography.caption}>
          {pendingLabel}
        </span>
      )}
    </div>
  );
}

/** Caller supplies financial scaling and formatting, including negative-amount policy. */
export function FinancialPanelBar({
  percent,
  color,
  segments,
}: {
  percent: number;
  color?: string;
  segments?: readonly { id: string; percent: number; color: string }[];
}) {
  return (
    <div className="flex flex-1 flex-col gap-px">
      <div
        className="flex h-2 overflow-hidden rounded-sm"
        style={{
          width: `${Math.max(0, Math.min(100, percent))}%`,
          backgroundColor: color,
        }}
      >
        {segments?.map((s) => (
          <div
            key={s.id}
            className="transition-all"
            style={{
              width: `${Math.max(0, s.percent)}%`,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function FinancialPanelRankedRow({
  label,
  title,
  value,
  onClick,
  badge,
  children,
  labelClassName,
}: {
  label: string;
  title?: string;
  value: React.ReactNode;
  onClick?: () => void;
  badge?: React.ReactNode;
  children: React.ReactNode;
  labelClassName?: string;
}) {
  const Row = badge && onClick ? "button" : "div";
  return (
    <Row
      onClick={badge ? onClick : undefined}
      className={cn(
        "flex w-full items-center gap-2",
        badge && onClick && "group rounded hover:bg-gray-50",
      )}
    >
      {onClick && !badge ? (
        <button
          type="button"
          onClick={onClick}
          title={title ?? label}
          className={cn(
            typography.label,
            "w-24 shrink-0 truncate text-start text-gray-700 hover:text-un-blue hover:underline",
            labelClassName,
          )}
        >
          {label}
        </button>
      ) : (
        <span
          title={title ?? label}
          className={cn(
            typography.label,
            "w-24 shrink-0 truncate text-start text-gray-700 group-hover:text-un-blue group-hover:underline",
            labelClassName,
          )}
        >
          {label}
        </span>
      )}
      {badge}
      {children}
      <div
        className={cn(
          typography.caption,
          "w-16 shrink-0 text-end text-gray-500",
        )}
      >
        {value}
      </div>
    </Row>
  );
}

export function FinancialPanelGoalBadge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className={cn(
        typography.micro,
        "flex size-5 shrink-0 items-center justify-center rounded font-bold text-white",
      )}
      style={{
        backgroundColor: color,
        fontSize: "calc(var(--text-micro) + 0.0625rem)",
        lineHeight: "var(--text-micro--line-height)",
      }}
    >
      {label}
    </span>
  );
}

export function FinancialPanelSection({
  heading,
  hint,
  children,
}: {
  heading: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      <FinancialPanelHeading subheading className="mb-2">
        {heading}
      </FinancialPanelHeading>
      {hint && <div className={cn(typography.caption, "mb-2")}>{hint}</div>}
      {children}
    </section>
  );
}
