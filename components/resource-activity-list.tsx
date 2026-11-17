"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ResourceFundingBar,
  type ResourceMetrics,
  type ResourceLabels,
} from "./resource-funding-bar";
import { Tooltip } from "./tooltip";
import { formatBudget } from "../lib/format-budget";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { formatDataTitle } from "../lib/data-title";

export interface ResourceActivity extends ResourceMetrics {
  row_key: string;
  agency: string;
  code?: string;
  name: string;
  description?: string | null;
  outcome?: string | null;
  start?: string | null;
  end?: string | null;
}

/** Agency participation cards use the same funding scale and disclosures. */
export function ResourceActivityList({
  activities,
  resourceLabels,
  showAllLabel,
  initialLimit = 5,
}: {
  activities: readonly ResourceActivity[];
  resourceLabels: ResourceLabels;
  showAllLabel: string;
  initialLimit?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? activities : activities.slice(0, initialLimit);
  const maximum = Math.max(
    1,
    ...displayed.flatMap((row) => [row.required, row.available, row.spent]),
  );
  return (
    <div className="space-y-2">
      {displayed.map((activity) => (
        <details
          key={activity.row_key}
          className="group rounded border border-border"
        >
          <summary className="cursor-pointer list-none p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-un-blue">
            <span className="flex items-start justify-between gap-2">
              <span className="min-w-0 flex-1">
                <span
                  className={cn(typography.caption, "flex items-center gap-2")}
                >
                  <span className="font-medium text-foreground">
                    {activity.agency}
                  </span>
                  {activity.code && <span>· {activity.code}</span>}
                  <ChevronDown
                    aria-hidden
                    className="ms-auto size-3 transition-transform group-open:rotate-180"
                  />
                </span>
                <span
                  className={cn(
                    typography.body,
                    "mt-0.5 block line-clamp-2 group-open:line-clamp-none",
                  )}
                >
                  {formatDataTitle(activity.name)}
                </span>
              </span>
              <span
                className={cn(
                  typography.caption,
                  "shrink-0 text-end tabular-nums",
                )}
              >
                {formatBudget(activity.available)}
              </span>
            </span>
            <Tooltip
              content={
                <ResourceFundingBar
                  {...activity}
                  labels={resourceLabels}
                  compact
                />
              }
              width={320}
            >
              <span className="mt-2 block">
                <span
                  className="block"
                  style={{
                    width: `${(Math.max(0, activity.required, activity.available, activity.spent) / maximum) * 100}%`,
                  }}
                >
                  <ResourceFundingBar
                    {...activity}
                    labels={resourceLabels}
                    showLabels={false}
                  />
                </span>
              </span>
            </Tooltip>
          </summary>
          <div
            className={cn(
              typography.body,
              "space-y-2 border-t border-border bg-muted p-2",
            )}
          >
            {activity.start && (
              <p className={typography.caption}>
                {activity.start} – {activity.end}
              </p>
            )}
            {activity.outcome && <p>{formatDataTitle(activity.outcome)}</p>}
            {activity.description && (
              <p className="whitespace-pre-line">{activity.description}</p>
            )}
            <ResourceFundingBar {...activity} labels={resourceLabels} />
          </div>
        </details>
      ))}
      {!showAll && activities.length > initialLimit && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className={cn(
            typography.caption,
            "underline hover:text-foreground focus-visible:outline-2 focus-visible:outline-un-blue",
          )}
        >
          {showAllLabel}
        </button>
      )}
    </div>
  );
}
