export const openFundingTokens = [
  {
    key: "assessed",
    grayToken: "--color-open-funding-assessed-gray",
    grayClassName: "bg-open-funding-assessed-gray",
    label: "Assessed",
    token: "--color-open-funding-assessed",
    alias: "--color-un-blue-shade",
    className: "bg-open-funding-assessed",
    explanation:
      "Fixed contributions calculated by formula that Member States pay upon signing a treaty",
  },
  {
    key: "voluntary-unearmarked",
    grayToken: "--color-open-funding-voluntary-unearmarked-gray",
    grayClassName: "bg-open-funding-voluntary-unearmarked-gray",
    label: "Voluntary un-earmarked",
    token: "--color-open-funding-voluntary-unearmarked",
    alias: "--color-un-blue-text",
    className: "bg-open-funding-voluntary-unearmarked",
    explanation:
      "Voluntary contributions without restrictions on use (core funding)",
  },
  {
    key: "voluntary-earmarked",
    grayToken: "--color-open-funding-voluntary-earmarked-gray",
    grayClassName: "bg-open-funding-voluntary-earmarked-gray",
    label: "Voluntary earmarked",
    token: "--color-open-funding-voluntary-earmarked",
    alias: "--color-un-blue",
    className: "bg-open-funding-voluntary-earmarked",
    explanation:
      "Voluntary contributions tied to specific purposes or programmes (non-core)",
  },
  {
    key: "other",
    grayToken: "--color-open-funding-other-gray",
    grayClassName: "bg-open-funding-other-gray",
    label: "Other",
    token: "--color-open-funding-other",
    alias: "--color-un-blue-tint",
    className: "bg-open-funding-other",
    explanation: "Other revenue",
  },
] as const;

export const secretariatFundingCrosswalk = [
  {
    key: "regular_budget",
    grayToken: "--color-open-funding-regular-budget-gray",
    grayClassName: "bg-open-funding-regular-budget-gray",
    label: "Regular budget",
    explanation:
      "Funded by assessed contributions: mandatory payments from Member States, calculated using an agreed scale broadly based on their capacity to pay.",
    mapsTo: "Assessed",
    className: "bg-open-funding-assessed",
    token: "--color-open-funding-assessed",
  },
  {
    key: "other_assessed",
    grayToken: "--color-open-funding-other-assessed-gray",
    grayClassName: "bg-open-funding-other-assessed-gray",
    label: "Other assessed",
    explanation:
      "Mandatory Member State contributions to budgets outside the regular budget, including the peacekeeping budget and the International Residual Mechanism for Criminal Tribunals.",
    mapsTo: "Assessed",
    className: "bg-open-funding-assessed",
    token: "--color-open-funding-assessed",
  },
  {
    key: "extrabudgetary",
    grayToken: "--color-open-funding-extrabudgetary-gray",
    grayClassName: "bg-open-funding-extrabudgetary-gray",
    label: "Extrabudgetary",
    explanation:
      "Voluntary contributions and other resources outside assessed budgets, generally earmarked for specific purposes or programmes (non-core funding).",
    mapsTo: "Voluntary earmarked",
    className: "bg-open-funding-voluntary-earmarked",
    token: "--color-open-funding-voluntary-earmarked",
  },
] as const;

export type FundingSource =
  | (typeof openFundingTokens)[number]["key"]
  | (typeof secretariatFundingCrosswalk)[number]["key"];

export type FundingSourcePalette = "blue" | "gray";

/** Shared English copy; components also accept translated label/explanation overrides. */
export const fundingSources = Object.fromEntries(
  [...openFundingTokens, ...secretariatFundingCrosswalk].map((source) => [
    source.key,
    {
      label: source.label,
      explanation: source.explanation,
      color: `var(${source.token})`,
      grayColor: `var(${source.grayToken})`,
    },
  ]),
) as Record<
  FundingSource,
  { label: string; explanation: string; color: string; grayColor: string }
>;
