"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Tooltip } from "./tooltip";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

export interface FinancialBreakdownRowProps {
  label: string;
  badge?: ReactNode;
  value: ReactNode;
  bar: ReactNode;
  tooltip: ReactNode;
  depth?: number;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}

/** Compact hierarchy row; callers retain financial calculations and tree state. */
export function FinancialBreakdownRow({
  label,
  badge,
  value,
  bar,
  tooltip,
  depth = 0,
  expanded,
  onToggle,
  children,
}: FinancialBreakdownRowProps) {
  const Row = onToggle ? "button" : "div";
  return (
    <li>
      <div style={{ paddingInlineStart: `${depth * 0.75}rem` }}>
        <Tooltip width={380} content={tooltip}>
          <Row
            type={onToggle ? "button" : undefined}
            tabIndex={onToggle ? undefined : 0}
            aria-expanded={onToggle ? expanded : undefined}
            onClick={onToggle}
            className={cn(
              typography.label,
              "group grid min-h-8 w-full min-w-0 grid-cols-[1.5rem_minmax(0,1fr)_4rem_5.5rem] items-center gap-x-2 rounded-sm px-1 py-0.5 text-start hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-un-blue sm:grid-cols-[1.5rem_minmax(0,1fr)_5rem_6rem] sm:gap-x-3",
            )}
          >
            {onToggle ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-muted group-hover:text-foreground">
                <ChevronRight
                  aria-hidden="true"
                  className={cn(
                    "size-4 transition-transform",
                    expanded && "rotate-90",
                  )}
                />
              </span>
            ) : (
              <span className="size-6" aria-hidden="true" />
            )}
            <span className="flex min-w-0 items-center gap-1.5 leading-tight text-foreground">
              {badge}
              <span className="truncate">{label}</span>
            </span>
            {bar}
            <span
              className={cn(
                typography.numeric,
                "justify-self-end whitespace-nowrap text-foreground",
              )}
            >
              {value}
            </span>
          </Row>
        </Tooltip>
      </div>
      {expanded && children}
    </li>
  );
}
