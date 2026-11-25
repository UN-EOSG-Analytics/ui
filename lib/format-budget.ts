/** Rounded display only: calculations and downloads retain the source amounts. */
const number = new Intl.NumberFormat("en-US", {
  useGrouping: false,
  maximumFractionDigits: 1,
});
const rateNumber = new Intl.NumberFormat("en-US", {
  useGrouping: false,
  maximumFractionDigits: 3,
});
const units = ["", "K", "M", "B", "T"] as const;
const currencySymbols = new Map<string, string>([
  ["USD", "$"],
  ["CHF", "CHF "],
]);

function currencySymbol(currency: string): string {
  const existing = currencySymbols.get(currency);
  if (existing) return existing;
  const label = new Intl.NumberFormat("en-US", { style: "currency", currency })
    .formatToParts(0)
    .find((part) => part.type === "currency")!.value;
  const symbol = /[A-Za-z]$/.test(label) ? label + " " : label;
  currencySymbols.set(currency, symbol);
  return symbol;
}

/** At most one decimal and three significant digits, promoting rounded units. */
function compactMagnitude(value: number): string {
  let unit = Math.min(
    units.length - 1,
    Math.max(0, Math.floor(Math.log10(value) / 3)),
  );
  let scaled = value / 1000 ** unit;
  const round = (amount: number) =>
    amount < 100 ? Math.round(amount * 10) / 10 : Math.round(amount);
  let rounded = unit === 0 ? Math.round(scaled) : round(scaled);
  if (rounded >= 1000 && unit < units.length - 1) {
    unit++;
    scaled = value / 1000 ** unit;
    rounded = round(scaled);
  }
  return number.format(rounded) + units[unit];
}

/** Compact money shared by labels, axes, tooltips, tables and source details. */
export function formatCurrency(amount: number, currency: string): string {
  if (!Number.isFinite(amount)) return "—";
  const symbol = currencySymbol(currency);
  if (amount === 0) return symbol + "0";
  if (Math.abs(amount) < 1000)
    return amount < 0 ? `−(<${symbol}1K)` : `<${symbol}1K`;
  return (amount < 0 ? "−" : "") + symbol + compactMagnitude(Math.abs(amount));
}

/** Single-argument callback: chart libraries may pass an index as argument two. */
export function formatBudget(amount: number): string {
  return formatCurrency(amount, "USD");
}

/** Avoid repeated bounded labels on axes whose automatic ticks fall below $1K. */
export function formatBudgetTick(amount: number): string {
  return amount !== 0 && Math.abs(amount) < 1000 ? "" : formatBudget(amount);
}

/** Small counts stay whole; large workforce counts use the monetary digit limit. */
export function formatCount(count: number): string {
  if (!Number.isFinite(count)) return "—";
  if (count === 0) return "0";
  return (count < 0 ? "−" : "") + compactMagnitude(Math.abs(count));
}

/**
 * Percentage-point input, not a fraction: 19.3 means 19.3%.
 * At least 10%: whole percentages. Smaller shares: at most one decimal.
 * Keep positive values below 0.1% and shares near 100% distinct from zero/completion.
 * Set bounded to false for changes, where rounding to 100% does not imply completion.
 */
export function formatPercent(
  value: number,
  {
    signed = false,
    bounded = true,
  }: { signed?: boolean; bounded?: boolean } = {},
): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0%";
  const magnitude = Math.abs(value);
  const rounded =
    magnitude >= 10 ? Math.round(magnitude) : Math.round(magnitude * 10) / 10;
  let label = magnitude < 0.1 ? "<0.1%" : number.format(rounded) + "%";
  if (bounded && rounded === 100 && magnitude !== 100)
    label = magnitude < 100 ? "<100%" : ">100%";
  if (value < 0)
    return label.startsWith("<") || label.startsWith(">")
      ? `−(${label})`
      : "−" + label;
  return (signed ? "+" : "") + label;
}

/** Official assessment rates retain their published precision, up to three decimals. */
export function formatAssessmentRate(rate: number): string {
  if (!Number.isFinite(rate)) return "—";
  if (rate === 0) return "0%";
  if (Math.abs(rate) < 0.001) return rate < 0 ? "−(<0.001%)" : "<0.001%";
  return (rate < 0 ? "−" : "") + rateNumber.format(Math.abs(rate)) + "%";
}
