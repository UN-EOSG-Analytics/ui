import * as React from "react";
import { cn } from "../lib/utils";

/**
 * PointMeter — an ordinal score shown as positional dots.
 *
 * Extracted from mandates' system registry, where it scores each organisation
 * on five points of evidence. It is the only scale in this system that carries
 * **magnitude** rather than category, and it is the one validated one.
 *
 * THE RULES, which are the whole value:
 *
 * · Colour is never alone. The ramp reinforces a count that is already visible
 *   in the dots themselves — filled, half, empty — so the meter still reads
 *   with no colour vision at all, or in print.
 * · The ramp is CVD-validated as a SET (protan/deutan/tritan ΔE ≥ 10 between
 *   adjacent steps, ≥ 3:1 on white). Change it only as a set, and only after
 *   re-validating.
 * · Position is stable. Dot 3 is always the same criterion, so a column of
 *   meters can be scanned vertically — which is why an unmet point renders as
 *   a grey dot rather than collapsing.
 * · The step is chosen from the TOTAL, so the whole meter shares one colour.
 *   Per-dot colour would imply each criterion has its own scale.
 */

/** true = met, "partial" = partially met, false = not met. */
export type PointValue = boolean | "partial";

const FILLED = ["bg-tier-1", "bg-tier-2", "bg-tier-3", "bg-tier-4"] as const;
const RING = ["border-tier-1", "border-tier-2", "border-tier-3", "border-tier-4"] as const;

/** A partial point counts as a half. */
export function scoreTotal(points: PointValue[]): number {
  return points.reduce<number>(
    (n, p) => n + (p === true ? 1 : p === "partial" ? 0.5 : 0),
    0,
  );
}

/** Which of the four ramp steps the whole meter uses. */
export function scoreStep(total: number): 1 | 2 | 3 | 4 {
  if (total >= 3.5) return 4;
  if (total >= 2.5) return 3;
  if (total >= 1.5) return 2;
  return 1;
}

export interface PointMeterProps {
  points: PointValue[];
  /** Labels, one per point — used for the accessible description. */
  labels?: string[];
  className?: string;
}

export function PointMeter({ points, labels, className }: PointMeterProps) {
  const total = scoreTotal(points);
  const step = scoreStep(total);
  const idx = step - 1;

  const met = labels
    ? points
        .map((p, i) => (p === true ? labels[i] : p === "partial" ? `${labels[i]} (partial)` : null))
        .filter(Boolean)
        .join(", ")
    : undefined;

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={
        met
          ? `${total} of ${points.length}: ${met}`
          : `${total} of ${points.length}`
      }
    >
      {points.map((value, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            value === true && FILLED[idx],
            value === "partial" && cn("border-[1.5px] bg-transparent", RING[idx]),
            value === false && "bg-gray-300",
          )}
        />
      ))}
    </span>
  );
}
