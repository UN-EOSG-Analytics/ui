"use client";
import { LegendLabel, type LegendLabelProps } from "./legend-label";
import { fundingSources, type FundingSource } from "../lib/funding-sources";

export interface FundingSourceLabelProps extends Omit<
  LegendLabelProps,
  "color" | "label"
> {
  source: FundingSource;
  label?: string;
}
export function FundingSourceLabel({
  source,
  label,
  explanation,
  ...props
}: FundingSourceLabelProps) {
  const definition = fundingSources[source];
  return (
    <LegendLabel
      {...props}
      color={definition.color}
      label={label ?? definition.label}
      explanation={explanation ?? definition.explanation}
    />
  );
}
