"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  layoutGroupedTreemap,
  type GroupedTreemapLayoutOptions,
  type TreemapRect,
} from "../lib/grouped-treemap-layout";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { SearchInput } from "./search-input";

export {
  layoutBalancedTreemap,
  layoutGroupedTreemap,
  type GroupedTreemapLayoutOptions,
  type GroupedTreemapLeafLayout,
  type GroupedTreemapRowLayout,
  type GroupedTreemapSubgroupLayout,
  type TreemapLayoutLeaf,
  type TreemapLayoutRow,
  type TreemapLayoutSubgroup,
  type TreemapRect,
} from "../lib/grouped-treemap-layout";

export type TreemapSubgroupLabelVisibility = "visible" | "auto" | "tooltip-only";

export interface GroupedTreemapSegment<TSegment = unknown> {
  key: string;
  label: string;
  value: number;
  color: string;
  data?: TSegment;
}

export interface GroupedTreemapLeaf<TLeaf = unknown, TSegment = unknown> {
  key: string;
  label: string;
  value: number;
  color?: string;
  /** CSS text colour for pale or otherwise exceptional fills; defaults to white. */
  textColor?: string;
  /** Localized context appended only to the assistive leaf description. */
  accessibleDescription?: string;
  data?: TLeaf;
  segments?: readonly GroupedTreemapSegment<TSegment>[];
  onActivate?: (leaf: GroupedTreemapLeaf<TLeaf, TSegment>) => void;
}

export interface GroupedTreemapSubgroup<TSubgroup = unknown, TLeaf = unknown, TSegment = unknown> {
  key: string;
  label: string;
  data?: TSubgroup;
  labelVisibility?: TreemapSubgroupLabelVisibility;
  leaves: readonly GroupedTreemapLeaf<TLeaf, TSegment>[];
}

export interface GroupedTreemapRow<TRow = unknown, TSubgroup = unknown, TLeaf = unknown, TSegment = unknown> {
  key: string;
  label: string;
  data?: TRow;
  color?: string;
  subgroups?: readonly GroupedTreemapSubgroup<TSubgroup, TLeaf, TSegment>[];
  /** Direct leaves are normalized into an implicit, tooltip-only subgroup. */
  leaves?: readonly GroupedTreemapLeaf<TLeaf, TSegment>[];
}

export interface GroupedTreemapSummary {
  key: string;
  label: string;
  value: React.ReactNode;
}

interface GroupedTreemapSourceBase {
  key: string;
  label: React.ReactNode;
  href?: string;
  description?: React.ReactNode;
}

export type GroupedTreemapSource = GroupedTreemapSourceBase & (
  | {
      openInNewTab: true;
      href: string;
      /** Localized text such as “opens in a new tab”. */
      newTabLabel: React.ReactNode;
    }
  | {
      openInNewTab?: false;
      newTabLabel?: never;
    }
);

export interface GroupedTreemapSearch {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  predicate?: (leafLabel: string, subgroupLabel: string, rowLabel: string, query: string) => boolean;
}

export interface GroupedTreemapTooltipContext<TRow, TSubgroup, TLeaf, TSegment> {
  row: GroupedTreemapRow<TRow, TSubgroup, TLeaf, TSegment>;
  subgroup: GroupedTreemapSubgroup<TSubgroup, TLeaf, TSegment>;
  leaf: GroupedTreemapLeaf<TLeaf, TSegment>;
  breadcrumb: readonly string[];
}

export interface GroupedTreemapProps<TRow = unknown, TSubgroup = unknown, TLeaf = unknown, TSegment = unknown> {
  rows: readonly GroupedTreemapRow<TRow, TSubgroup, TLeaf, TSegment>[];
  /** Fixed pixels, any CSS height, or responsive height through `plotClassName`. */
  height?: number | string;
  className?: string;
  plotClassName?: string;
  plotStyle?: React.CSSProperties;
  search?: GroupedTreemapSearch;
  /** Optional compact control rendered beside search in the plot toolbar. */
  searchAccessory?: React.ReactNode;
  summaries?: readonly GroupedTreemapSummary[];
  /** Label for the automatically derived total used when summaries are absent. */
  totalLabel: React.ReactNode;
  /** Optional citation footer. Supply `sourceHeading` as localized copy. */
  sources?: readonly GroupedTreemapSource[];
  sourceHeading?: React.ReactNode;
  formatValue?: (value: number) => React.ReactNode;
  formatAccessibleValue?: (value: number) => string;
  /** Add a second value line to sufficiently large leaves. Canonical default is name-only. */
  showLeafValues?: boolean;
  renderTooltip?: (context: GroupedTreemapTooltipContext<TRow, TSubgroup, TLeaf, TSegment>) => React.ReactNode;
  emptyContent?: React.ReactNode;
  layout?: GroupedTreemapLayoutOptions;
  leafLabelMinWidth?: number;
  leafLabelMinHeight?: number;
  leafValueMinWidth?: number;
  leafValueMinHeight?: number;
}

interface NormalizedSubgroup<TSubgroup, TLeaf, TSegment>
  extends GroupedTreemapSubgroup<TSubgroup, TLeaf, TSegment> {
  implicit?: boolean;
}

const IMPLICIT_SUBGROUP_SUFFIX = "__direct-leaves";

function layoutLeafKey(rowKey: string, subgroupKey: string, leafKey: string) {
  return `${rowKey}\u001f${subgroupKey}\u001f${leafKey}`;
}

function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = (width: number, height: number) => {
      setSize((current) => current.width === width && current.height === height
        ? current
        : { width, height });
    };
    const rect = element.getBoundingClientRect();
    update(rect.width, rect.height);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

function rectStyle(rect: TreemapRect): React.CSSProperties {
  return {
    position: "absolute",
    insetInlineStart: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
  };
}

function normalizeRows<TRow, TSubgroup, TLeaf, TSegment>(
  rows: readonly GroupedTreemapRow<TRow, TSubgroup, TLeaf, TSegment>[],
  search?: GroupedTreemapSearch,
) {
  const query = search?.value.trim().toLocaleLowerCase() ?? "";
  const matches = search?.predicate ?? ((leaf: string, subgroup: string, row: string, needle: string) =>
    `${leaf} ${subgroup} ${row}`.toLocaleLowerCase().includes(needle));

  return rows.map((row) => {
    const direct: NormalizedSubgroup<TSubgroup, TLeaf, TSegment>[] = row.leaves?.length
      ? [{
          key: `${row.key}${IMPLICIT_SUBGROUP_SUFFIX}`,
          label: row.label,
          labelVisibility: "tooltip-only",
          leaves: row.leaves,
          implicit: true,
        }]
      : [];
    const subgroups: NormalizedSubgroup<TSubgroup, TLeaf, TSegment>[] = [
      ...(row.subgroups ?? []),
      ...direct,
    ].map((subgroup) => ({
      ...subgroup,
      leaves: subgroup.leaves.filter((leaf) =>
        !query || matches(leaf.label, subgroup.label, row.label, query)),
    })).filter((subgroup) => subgroup.leaves.some((leaf) => Number.isFinite(leaf.value) && leaf.value > 0));
    return { ...row, subgroups };
  }).filter((row) => row.subgroups.length > 0);
}

function Tooltip({ children, target }: { children: React.ReactNode; target: DOMRect }) {
  if (typeof document === "undefined") return null;
  const left = Math.min(
    Math.max(12, target.left + target.width / 2),
    Math.max(12, document.documentElement.clientWidth - 12),
  );
  const above = target.top > 112;
  return createPortal(
    <div
      role="tooltip"
      className={cn(
        typography.caption,
        "pointer-events-none fixed z-50 max-w-72 rounded-md bg-foreground px-3 py-2 text-background shadow-lg",
      )}
      style={{
        left,
        top: above ? target.top - 8 : target.bottom + 8,
        transform: above ? "translate(-50%, -100%)" : "translateX(-50%)",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

function DefaultTooltip<TRow, TSubgroup, TLeaf, TSegment>({
  context,
  formatValue,
}: {
  context: GroupedTreemapTooltipContext<TRow, TSubgroup, TLeaf, TSegment>;
  formatValue: (value: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="font-medium">{context.breadcrumb.join(" › ")}</div>
      <div>{context.leaf.label}: {formatValue(context.leaf.value)}</div>
      {context.leaf.segments?.filter((segment) => Number.isFinite(segment.value) && segment.value > 0).map((segment) => (
        <div key={segment.key} className="flex justify-between gap-4">
          <span>{segment.label}</span>
          <span className="tabular-nums">{formatValue(segment.value)}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Product-agnostic row → subgroup → leaf treemap. Products own taxonomy,
 * filtering semantics, colours and navigation; this component owns geometry,
 * responsive measurement, labelling, tooltips and keyboard interaction.
 */
export function GroupedTreemap<TRow = unknown, TSubgroup = unknown, TLeaf = unknown, TSegment = unknown>({
  rows,
  height = 720,
  className,
  plotClassName,
  plotStyle,
  search,
  searchAccessory,
  summaries,
  totalLabel,
  sources,
  sourceHeading,
  formatValue = (value) => value.toLocaleString(),
  formatAccessibleValue = (value) => value.toLocaleString(),
  showLeafValues = false,
  renderTooltip,
  emptyContent = null,
  layout,
  leafLabelMinWidth,
  leafLabelMinHeight,
  leafValueMinWidth,
  leafValueMinHeight,
}: GroupedTreemapProps<TRow, TSubgroup, TLeaf, TSegment>) {
  const componentId = React.useId();
  const [containerRef, size] = useElementSize<HTMLDivElement>();
  const [activeTooltip, setActiveTooltip] = React.useState<{
    key: string;
    target: DOMRect;
    content: React.ReactNode;
  } | null>(null);
  const normalized = React.useMemo(() => normalizeRows(rows, search), [rows, search]);
  const visibleTotal = React.useMemo(() => normalized.reduce((rowSum, row) =>
    rowSum + row.subgroups.reduce((subgroupSum, subgroup) =>
      subgroupSum + subgroup.leaves.reduce((leafSum, leaf) =>
        leafSum + (Number.isFinite(leaf.value) && leaf.value > 0 ? leaf.value : 0), 0), 0), 0), [normalized]);
  const displayedSummaries = summaries?.length
    ? summaries
    : [{ key: "grouped-treemap-total", label: totalLabel, value: formatValue(visibleTotal) }];
  const lookup = React.useMemo(() => new Map(normalized.flatMap((row) =>
    row.subgroups.flatMap((subgroup) => subgroup.leaves.map((leaf) => [
      layoutLeafKey(row.key, subgroup.key, leaf.key),
      { row, subgroup, leaf },
    ] as const)))), [normalized]);
  const geometry = React.useMemo(() => layoutGroupedTreemap(
    normalized.map((row) => ({
      key: row.key,
      subgroups: row.subgroups.map((subgroup) => ({
        key: subgroup.key,
        leaves: subgroup.leaves.map((leaf) => ({
          key: layoutLeafKey(row.key, subgroup.key, leaf.key),
          value: leaf.value,
        })),
      })),
    })),
    { x: 0, y: 0, width: size.width, height: size.height },
    layout,
  ), [layout, normalized, size.height, size.width]);

  const showTooltip = React.useCallback((
    event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement> | React.PointerEvent<HTMLElement>,
    key: string,
    context: GroupedTreemapTooltipContext<TRow, TSubgroup, TLeaf, TSegment>,
  ) => {
    setActiveTooltip({
      key,
      target: event.currentTarget.getBoundingClientRect(),
      content: renderTooltip
        ? renderTooltip(context)
        : <DefaultTooltip context={context} formatValue={formatValue} />,
    });
  }, [formatValue, renderTooltip]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        {search || searchAccessory ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
          {search ? (
            <SearchInput
              variant="border-bottom"
              aria-label={search.label}
              placeholder={search.placeholder}
              value={search.value}
              onChange={(event) => search.onChange(event.currentTarget.value)}
              showClear
              onClear={() => search.onChange("")}
              className="w-full sm:w-64"
            />
          ) : null}
          {searchAccessory}
          </div>
        ) : null}
          {displayedSummaries.length ? (
            <dl className="flex flex-wrap items-end gap-x-6 gap-y-2 sm:ms-auto sm:justify-end">
              {displayedSummaries.map((summary) => (
                <div key={summary.key} className="min-w-0">
                  <dt className={typography.caption}>{summary.label}</dt>
                  <dd className={cn(typography.subTitle, "tabular-nums")}>{summary.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
      </div>

      <div
        ref={containerRef}
        className={cn(
          "relative h-[var(--grouped-treemap-height)] w-full overflow-hidden bg-gray-100",
          plotClassName,
        )}
        style={{
          "--grouped-treemap-height": typeof height === "number" ? `${height}px` : height,
          ...plotStyle,
        } as React.CSSProperties}
      >
        {geometry.length === 0 && size.width > 0 ? emptyContent : geometry.map((rowLayout) => {
          const row = normalized.find((candidate) => candidate.key === rowLayout.key);
          if (!row) return null;
          return (
            <section
              key={row.key}
              aria-label={row.label}
              className="contents"
            >
              <div
                className="pointer-events-none absolute start-0 top-0 z-20 max-w-[60%] truncate bg-white/90 px-1.5 py-1 text-[10px] font-bold shadow-sm sm:text-xs"
                style={{
                  insetInlineStart: rowLayout.rect.x,
                  top: rowLayout.rect.y,
                  color: row.color ?? "var(--color-un-blue)",
                }}
              >
                {row.label}
              </div>
              {rowLayout.subgroups.map((subgroupLayout) => {
                const subgroup = row.subgroups.find((candidate) => candidate.key === subgroupLayout.key);
                if (!subgroup) return null;
                const subgroupLabelVisibility = subgroup.labelVisibility ?? "tooltip-only";
                const showSubgroupLabel = subgroupLabelVisibility === "visible"
                  || (subgroupLabelVisibility === "auto" && subgroupLayout.rect.width >= 130 && subgroupLayout.rect.height >= 72);
                return (
                  <div
                    key={subgroup.key}
                    className="contents"
                  >
                    {showSubgroupLabel && !subgroup.implicit && (
                      <div
                        className="pointer-events-none absolute start-0 top-0 z-20 max-w-[60%] truncate bg-white/90 px-1.5 py-1 text-[10px] font-bold shadow-sm sm:text-xs"
                        style={{
                          insetInlineStart: subgroupLayout.rect.x,
                          top: subgroupLayout.rect.y,
                          color: row.color ?? "var(--color-un-blue)",
                        }}
                      >
                        {subgroup.label}
                      </div>
                    )}
                    {subgroupLayout.leaves.map((leafLayout) => {
                      const item = lookup.get(leafLayout.key);
                      if (!item) return null;
                      const { leaf } = item;
                      const breadcrumb = subgroup.implicit
                        ? [row.label]
                        : [row.label, subgroup.label];
                      const context = { row, subgroup, leaf, breadcrumb };
                      const visibleSegments = leaf.segments?.filter((segment) =>
                        Number.isFinite(segment.value) && segment.value > 0) ?? [];
                      const segmentTotal = visibleSegments.reduce((sum, segment) => sum + segment.value, 0);
                      // Preserve an unclassified remainder as the leaf's base fill. If supplied
                      // segments exceed the leaf value, scale only that over-specified composition.
                      const segmentDenominator = Math.max(leaf.value, segmentTotal);
                      const accessibleSegments = visibleSegments
                        .map((segment) => `${segment.label}: ${formatAccessibleValue(segment.value)}`).join(", ");
                      const description = [
                        breadcrumb.join(" › "),
                        `${leaf.label}: ${formatAccessibleValue(leaf.value)}`,
                        accessibleSegments || null,
                        leaf.accessibleDescription?.trim() || null,
                      ].filter((part): part is string => Boolean(part)).map((part) =>
                        /[.!?…。！？؟۔]$/u.test(part) ? part : `${part}.`).join(" ");
                      const Element = leaf.onActivate ? "button" : "div";
                      const descriptionId = `${componentId}-${encodeURIComponent(row.key)}-${encodeURIComponent(subgroup.key)}-${encodeURIComponent(leaf.key)}`;
                      const canShowLabel = leafLayout.rect.width > (leafLabelMinWidth ?? size.width * 0.04)
                        && leafLayout.rect.height > (leafLabelMinHeight ?? size.height * 0.03);
                      const canShowValue = showLeafValues
                        && leafLayout.rect.width > (leafValueMinWidth ?? size.width * 0.08)
                        && leafLayout.rect.height > (leafValueMinHeight ?? size.height * 0.06);
                      return (
                        <Element
                          key={leafLayout.key}
                          type={leaf.onActivate ? "button" : undefined}
                          tabIndex={leaf.onActivate ? undefined : 0}
                          aria-label={leaf.label}
                          aria-describedby={descriptionId}
                          onClick={leaf.onActivate ? () => leaf.onActivate?.(leaf) : undefined}
                          onMouseEnter={(event) => showTooltip(event, leafLayout.key, context)}
                          onMouseLeave={() => setActiveTooltip((current) => current?.key === leafLayout.key ? null : current)}
                          onFocus={(event) => showTooltip(event, leafLayout.key, context)}
                          onBlur={() => setActiveTooltip((current) => current?.key === leafLayout.key ? null : current)}
                          onPointerUp={!leaf.onActivate ? (event) => {
                            if (event.pointerType === "touch") showTooltip(event, leafLayout.key, context);
                          } : undefined}
                          className={cn(
                            "group absolute isolate overflow-hidden p-0 text-start text-white",
                            "motion-safe:transition-[filter] motion-safe:duration-150",
                            "focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset focus-visible:outline-none",
                            leaf.onActivate && "hover:z-10 hover:brightness-90",
                          )}
                          style={{
                            ...rectStyle(leafLayout.rect),
                            backgroundColor: leaf.color ?? row.color ?? "var(--color-un-blue)",
                            color: leaf.textColor,
                          }}
                        >
                          {segmentDenominator > 0 && (
                            <span aria-hidden className="absolute inset-0 flex">
                              {visibleSegments.map((segment) => (
                                <span
                                  key={segment.key}
                                  className="shrink-0"
                                  style={{ width: `${segment.value / segmentDenominator * 100}%`, backgroundColor: segment.color }}
                                />
                              ))}
                            </span>
                          )}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.8)]"
                          />
                          {canShowLabel && (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none relative z-[2] flex h-full items-end overflow-hidden p-1.5 text-[10px] leading-tight drop-shadow-sm sm:p-2 sm:text-xs"
                            >
                              <span className="block min-w-0">
                                <span className="block truncate font-semibold">{leaf.label}</span>
                                {canShowValue ? (
                                  <span className="block truncate tabular-nums">{formatValue(leaf.value)}</span>
                                ) : null}
                              </span>
                            </span>
                          )}
                          <span id={descriptionId} className="sr-only">{description}</span>
                        </Element>
                      );
                    })}
                    {!subgroup.implicit ? (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute z-[5] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.95)]"
                        style={rectStyle(subgroupLayout.rect)}
                      />
                    ) : null}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
      {sources?.length ? (
        <footer className={cn(typography.caption, "flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-border pt-2")}>
          {sourceHeading ? <span className="font-medium text-foreground">{sourceHeading}</span> : null}
          {sources.map((source, index) => (
            <React.Fragment key={source.key}>
              {index > 0 ? <span aria-hidden>·</span> : null}
              <span className="inline-flex flex-wrap gap-x-1">
                {source.href ? (
                  <a
                    className="text-un-blue-text underline underline-offset-2 hover:text-un-blue-shade focus-visible:ring-2 focus-visible:ring-un-blue/50 focus-visible:outline-none"
                    href={source.href}
                    target={source.openInNewTab ? "_blank" : undefined}
                    rel={source.openInNewTab ? "noopener noreferrer" : undefined}
                  >
                    {source.label}
                    {source.openInNewTab ? <span className="sr-only"> ({source.newTabLabel})</span> : null}
                  </a>
                ) : <span>{source.label}</span>}
                {source.description ? <span>{source.description}</span> : null}
              </span>
            </React.Fragment>
          ))}
        </footer>
      ) : null}
      {activeTooltip && <Tooltip target={activeTooltip.target}>{activeTooltip.content}</Tooltip>}
    </div>
  );
}
