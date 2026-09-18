"use client";
import * as React from "react";
import { ChevronDown, Download } from "lucide-react";
import { InteractionHint } from "./interaction-hint";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface ChartFooterProps {
  hint?: string;
  sourceLabel: string;
  sourceDetails?: React.ReactNode;
  downloadLabel?: string;
  onDownload?: () => void;
}
export function ChartFooter({
  hint = "Select an item to explore details",
  sourceLabel,
  sourceDetails,
  downloadLabel = "Download",
  onDownload,
}: ChartFooterProps) {
  const [expanded, setExpanded] = React.useState(false);
  const detailsId = React.useId();
  return (
    <footer className={cn(typography.meta, "mt-3")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InteractionHint text={hint} />
        <div className="ms-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={detailsId}
            disabled={!sourceDetails}
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-un-blue"
          >
            {sourceLabel}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                expanded && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            disabled={!onDownload}
            onClick={onDownload}
            title={!onDownload ? "Download is not yet available" : undefined}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="size-3.5" aria-hidden="true" />
            {downloadLabel}
          </button>
        </div>
      </div>
      <div
        id={detailsId}
        hidden={!expanded}
        className="mt-3 rounded-md border border-border bg-secondary p-4 leading-relaxed"
      >
        {sourceDetails}
      </div>
    </footer>
  );
}
