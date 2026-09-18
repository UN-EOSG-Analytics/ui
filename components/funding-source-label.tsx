"use client";
import { LegendLabel, type LegendLabelProps } from "./legend-label";
import {
  fundingSources,
  type FundingSource,
  type FundingSourcePalette,
} from "../lib/funding-sources";

export interface FundingSourceLabelProps extends Omit<
  LegendLabelProps,
  "color" | "label"
> {
  source: FundingSource;
  /** Gray is for filters spanning several chart group colours. */
  palette?: FundingSourcePalette;
  label?: string;
}
export function FundingSourceLabel({
  source,
  palette = "blue",
  label,
  explanation,
  ...props
}: FundingSourceLabelProps) {
  const definition = fundingSources[source];
  return (
    <LegendLabel
      {...props}
      color={palette === "gray" ? definition.grayColor : definition.color}
      label={label ?? definition.label}
      explanation={explanation ?? definition.explanation}
    />
  );
}
