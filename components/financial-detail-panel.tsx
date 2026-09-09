import * as React from "react";
import { DetailHeader, DetailPanel, DetailSection } from "./detail-panel";
import { ExternalLink } from "./external-link";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface FinancialDetailPanelTotal {
  label: string;
  value: React.ReactNode;
  details?: React.ReactNode;
}

export interface FinancialDetailPanelYearOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type FinancialDetailPanelYear =
  | {
      kind: "select";
      label: string;
      value: string;
      options: readonly FinancialDetailPanelYearOption[];
      onChange: (value: string) => void;
      disabled?: boolean;
      pending?: boolean;
      pendingLabel?: string;
    }
  | {
      kind: "static";
      label: string;
      value: React.ReactNode;
    };

export interface FinancialDetailPanelFundingItem {
  id: string;
  label: string;
  value: React.ReactNode;
  /** Caller-owned semantic marker; the panel does not know funding taxonomies. */
  marker: React.ReactNode;
  share?: React.ReactNode;
  details?: React.ReactNode;
}

export interface FinancialDetailPanelFundingBreakdown {
  heading: string;
  hint?: React.ReactNode;
  items: readonly FinancialDetailPanelFundingItem[];
  note?: React.ReactNode;
  state?: FinancialDetailPanelRegionState;
  /** Localized visible/screen-reader status for this region. */
  status: string;
}

export type FinancialDetailPanelRegionState = "ready" | "loading" | "empty" | "error" | "incomplete";

export interface FinancialDetailPanelTrend {
  heading: string;
  hint?: React.ReactNode;
  state?: FinancialDetailPanelRegionState;
  status: string;
  content?: React.ReactNode;
}

export interface FinancialDetailPanelSource {
  id: string;
  label: React.ReactNode;
  href: string;
  description?: React.ReactNode;
}

export interface FinancialDetailPanelSources {
  heading: string;
  items: readonly FinancialDetailPanelSource[];
  newTabLabel: string;
  state?: FinancialDetailPanelRegionState;
  /** Localized visible/screen-reader status for this region. */
  status: string;
}

export interface FinancialDetailPanelNotice {
  tone: "empty" | "error" | "incomplete";
  title?: React.ReactNode;
  description: React.ReactNode;
}

export interface FinancialDetailPanelProps {
  title: React.ReactNode;
  /** Reference this ID from the product-owned dialog's aria-labelledby. */
  titleId: string;
  eyebrow?: string;
  controls?: React.ReactNode;
  metadata?: React.ReactNode;
  total: FinancialDetailPanelTotal;
  year: FinancialDetailPanelYear;
  fundingBreakdown?: FinancialDetailPanelFundingBreakdown;
  trend?: FinancialDetailPanelTrend;
  sources?: FinancialDetailPanelSources;
  /** Domain-specific sections such as hierarchy, SDGs, or mandate details. */
  children?: React.ReactNode;
  busy?: boolean;
  /** Polite update while old content remains visible during a year change. */
  statusMessage?: string;
  notice?: FinancialDetailPanelNotice;
  className?: string;
}

function YearControl({ year }: { year: FinancialDetailPanelYear }) {
  if (year.kind === "static") {
    return (
      <div className="sm:text-end">
        <div className={cn(typography.eyebrow, "mb-0.5 text-muted-foreground")}>{year.label}</div>
        <div className={cn(typography.numeric, "font-semibold text-foreground")}>{year.value}</div>
      </div>
    );
  }

  return (
    <label className="block min-w-32">
      <span className={cn(typography.eyebrow, "mb-1 block text-muted-foreground sm:text-end")}>
        {year.label}
      </span>
      <select
        value={year.value}
        disabled={year.disabled || year.pending}
        aria-busy={year.pending || undefined}
        onChange={(event) => year.onChange(event.target.value)}
        className={cn(
          typography.body,
          "h-11 w-full rounded-md border border-border bg-background px-3 text-foreground",
          "focus-visible:ring-2 focus-visible:ring-un-blue/50 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:cursor-wait disabled:opacity-60",
        )}
      >
        {year.pending && year.pendingLabel && (
          <option value={year.value}>{year.pendingLabel}</option>
        )}
        {!year.pending && year.options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Summary({ total, year }: {
  total: FinancialDetailPanelTotal;
  year: FinancialDetailPanelYear;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className={cn(typography.eyebrow, "mb-0.5 text-muted-foreground")}>{total.label}</div>
        <div className={cn(typography.sectionTitle, "tabular-nums")}>{total.value}</div>
        {total.details && <div className={cn(typography.caption, "mt-1")}>{total.details}</div>}
      </div>
      <div className="sm:ms-auto sm:shrink-0">
        <YearControl year={year} />
      </div>
    </div>
  );
}

function FundingBreakdown({ breakdown }: { breakdown: FinancialDetailPanelFundingBreakdown }) {
  const state = breakdown.state ?? "ready";
  return (
    <DetailSection heading={breakdown.heading} hint={breakdown.hint}>
      <div aria-busy={state === "loading" || undefined}>
        {breakdown.items.length > 0 ? (
          <ul className="space-y-3">
          {breakdown.items.map((item) => (
            <li key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-1">
              <span aria-hidden="true" className="mt-1.5 flex size-3 shrink-0 items-center justify-center">
                {item.marker}
              </span>
              <span className="min-w-0 font-medium text-foreground">{item.label}</span>
              <span className={cn(typography.numeric, "text-end font-medium text-foreground")}>
                {item.value}
              </span>
              {(item.share || item.details) && (
                <span className={cn(typography.caption, "col-start-2 col-end-4 flex flex-wrap gap-x-2 gap-y-0.5")}>
                  {item.share && <span>{item.share}</span>}
                  {item.details && <span>{item.details}</span>}
                </span>
              )}
            </li>
          ))}
          </ul>
        ) : null}
      </div>
      <p
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          state === "ready" ? "sr-only" : typography.meta,
          state !== "ready" && breakdown.items.length > 0 && "mt-3",
          state === "error" && "text-destructive",
        )}
      >
        {breakdown.status}
      </p>
      {breakdown.note && (
        <p className={cn(typography.caption, "mt-4 border-t border-border pt-3")}>
          {breakdown.note}
        </p>
      )}
    </DetailSection>
  );
}

function Trend({ trend }: { trend: FinancialDetailPanelTrend }) {
  const state = trend.state ?? "ready";
  return (
    <DetailSection heading={trend.heading} hint={trend.hint}>
      <div aria-busy={state === "loading" || undefined}>
        {trend.content}
      </div>
      <p
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          state === "ready" ? "sr-only" : typography.meta,
          state !== "ready" && trend.content && "mt-3",
          state === "error" && "text-destructive",
        )}
      >
        {trend.status}
      </p>
    </DetailSection>
  );
}

function Sources({ sources }: { sources: FinancialDetailPanelSources }) {
  const state = sources.state ?? "ready";
  return (
    <DetailSection heading={sources.heading}>
      <div aria-busy={state === "loading" || undefined}>
        {sources.items.length > 0 ? (
          <ul className="space-y-3">
          {sources.items.map((source) => (
            <li key={source.id}>
              <ExternalLink
                href={source.href}
                newTabLabel={sources.newTabLabel}
                className="font-medium text-un-blue-text underline decoration-un-blue/40 underline-offset-2 hover:decoration-un-blue focus-visible:ring-2 focus-visible:ring-un-blue/50 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {source.label}
              </ExternalLink>
              {source.description && (
                <div className={cn(typography.caption, "mt-1")}>{source.description}</div>
              )}
            </li>
          ))}
          </ul>
        ) : null}
      </div>
      <p
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          state === "ready" ? "sr-only" : typography.meta,
          state !== "ready" && sources.items.length > 0 && "mt-3",
          state === "error" && "text-destructive",
        )}
      >
        {sources.status}
      </p>
    </DetailSection>
  );
}

function Notice({ notice }: { notice: FinancialDetailPanelNotice }) {
  return (
    <div
      role={notice.tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-4 py-3",
        notice.tone === "error" && "border-destructive/30 bg-destructive/5",
        notice.tone === "incomplete" && "border-un-yellow-shade/40 bg-un-yellow/10",
        notice.tone === "empty" && "border-border bg-muted/50",
      )}
    >
      {notice.title && <p className="text-sm font-semibold text-foreground">{notice.title}</p>}
      <div className={cn(typography.meta, notice.title && "mt-1")}>{notice.description}</div>
    </div>
  );
}

/**
 * open.un.org-oriented presentation for financial record panels. Products own
 * data, taxonomy, routing, overlay behavior, and panel controls; this
 * composition only standardizes the visible financial regions.
 */
export function FinancialDetailPanel({
  title,
  titleId,
  eyebrow,
  controls,
  metadata,
  total,
  year,
  fundingBreakdown,
  trend,
  sources,
  children,
  busy = false,
  statusMessage,
  notice,
  className,
}: FinancialDetailPanelProps) {
  return (
    <DetailPanel
      title={title}
      titleId={titleId}
      eyebrow={eyebrow}
      controls={controls}
      className={cn("w-full sm:w-lg sm:max-w-full", className)}
    >
      <div aria-busy={busy || undefined}>
        {statusMessage && (
          <p className="sr-only" aria-live="polite" aria-atomic="true">{statusMessage}</p>
        )}
        {metadata && <DetailHeader className="mb-5">{metadata}</DetailHeader>}
        <Summary total={total} year={year} />
        {notice && <div className="mt-6"><Notice notice={notice} /></div>}
        {fundingBreakdown && <FundingBreakdown breakdown={fundingBreakdown} />}
        {trend && <Trend trend={trend} />}
        {children}
        {sources && <Sources sources={sources} />}
      </div>
    </DetailPanel>
  );
}
