"use client";

import { useId, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  ResourceFundingBar,
  type ResourceMetrics,
  type ResourceLabels,
} from "./resource-funding-bar";
import { Tooltip } from "./tooltip";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

export interface ResultsFrameworkNode extends ResourceMetrics {
  id: string | number;
  code?: string;
  level?: number;
  name: string;
  description?: string;
  has_financial_data?: boolean;
  children?: ResultsFrameworkNode[];
}

interface FrameworkLabels extends ResourceLabels {
  levels: readonly string[];
}

function FrameworkBranch({
  node,
  level,
  maximum,
  labels,
}: {
  node: ResultsFrameworkNode;
  level: number;
  maximum: number;
  labels: FrameworkLabels;
}) {
  const [expanded, setExpanded] = useState(false);
  const childrenId = useId();
  const hasDetails = Boolean(node.children?.length || node.description);
  const hasFinance = node.has_financial_data !== false;
  const width =
    (Math.max(0, node.required, node.available, node.spent) / maximum) * 100;
  const childMaximum = Math.max(
    1,
    ...(node.children ?? []).flatMap((child) => [
      child.required,
      child.available,
      child.spent,
    ]),
  );
  const content = (
    <div className="max-w-sm space-y-3">
      <p className={typography.body}>{node.name}</p>
      {hasFinance && <ResourceFundingBar {...node} labels={labels} compact />}
    </div>
  );

  return (
    <div className={cn(level > 0 && "ms-3 border-s border-border ps-3")}>
      <Tooltip content={content} width={360}>
        <button
          type="button"
          aria-expanded={hasDetails ? expanded : undefined}
          aria-controls={hasDetails ? childrenId : undefined}
          onClick={() => {
            if (hasDetails) setExpanded(!expanded);
          }}
          className={cn(
            "mb-1 w-full rounded-lg bg-muted p-2 text-start focus-visible:outline-2 focus-visible:outline-un-blue",
            hasDetails && "cursor-pointer hover:bg-secondary",
          )}
        >
          <span className="flex items-center gap-2">
            <ChevronRight
              aria-hidden
              className={cn(
                "size-3 shrink-0 text-muted-foreground transition-transform",
                expanded && "rotate-90",
                !hasDetails && "invisible",
              )}
            />
            {node.code && (
              <span
                className={cn(
                  typography.label,
                  "flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-un-blue px-1 text-un-white",
                )}
              >
                {node.code}
              </span>
            )}
            <span className="min-w-0 flex-1">
              {hasFinance && (
                <span className="block" style={{ width: `${width}%` }}>
                  <ResourceFundingBar
                    {...node}
                    labels={labels}
                    showLabels={false}
                  />
                </span>
              )}
            </span>
          </span>
          <span
            className={cn(
              typography.caption,
              "ms-5 mt-1.5 block line-clamp-2 text-foreground",
            )}
          >
            <span className="sr-only">
              {labels.levels[node.level ?? level]}{" "}
            </span>
            {node.name}
          </span>
        </button>
      </Tooltip>
      {expanded && (
        <div id={childrenId}>
          {node.description && (
            <p className={cn(typography.body, "mb-3 whitespace-pre-line px-2")}>
              {node.description}
            </p>
          )}
          {node.children?.map((child) => (
            <FrameworkBranch
              key={child.id}
              node={child}
              level={level + 1}
              maximum={childMaximum}
              labels={labels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Expandable strategic priorities, outcomes and outputs with funding tooltips. */
export function ResultsFramework({
  framework,
  labels,
}: {
  framework: readonly ResultsFrameworkNode[];
  labels: FrameworkLabels;
}) {
  const maximum = Math.max(
    1,
    ...framework.flatMap((node) => [node.required, node.available, node.spent]),
  );
  return (
    <div className="space-y-1">
      {framework.map((node) => (
        <FrameworkBranch
          key={node.id}
          node={node}
          level={0}
          maximum={maximum}
          labels={labels}
        />
      ))}
    </div>
  );
}
