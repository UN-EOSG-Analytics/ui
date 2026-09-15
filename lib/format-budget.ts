/** Compact USD display shared by chart labels, axes, tooltips and panels. */
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function formatBudget(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  if (amount === 0) return "$0";
  // Avoid dollar-level precision even for small amounts; preserve the sign.
  if (Math.abs(amount) < 1000) return amount < 0 ? "−(<$1K)" : "<$1K";
  return currency.format(amount);
}

/** Percentage-point input. Keep tiny non-zero rates distinguishable from zero. */
export function formatAssessmentRate(rate: number): string {
  if (!Number.isFinite(rate)) return "—";
  if (rate > 0 && rate < 0.1) return "<0.1%";
  return `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(rate)}%`;
}
