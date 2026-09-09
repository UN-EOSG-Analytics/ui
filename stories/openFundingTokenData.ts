export const openFundingTokens = [
  {
    key: "assessed",
    label: "Assessed",
    token: "--color-open-funding-assessed",
    alias: "--color-un-blue-shade",
    className: "bg-open-funding-assessed",
    explanation:
      "Fixed contributions calculated by formula that Member States pay upon signing a treaty",
  },
  {
    key: "voluntary-unearmarked",
    label: "Voluntary un-earmarked",
    token: "--color-open-funding-voluntary-unearmarked",
    alias: "--color-un-blue-text",
    className: "bg-open-funding-voluntary-unearmarked",
    explanation: "Voluntary contributions without restrictions on use (core funding)",
  },
  {
    key: "voluntary-earmarked",
    label: "Voluntary earmarked",
    token: "--color-open-funding-voluntary-earmarked",
    alias: "--color-un-blue",
    className: "bg-open-funding-voluntary-earmarked",
    explanation:
      "Voluntary contributions tied to specific purposes or programmes (non-core)",
  },
  {
    key: "other",
    label: "Other",
    token: "--color-open-funding-other",
    alias: "--color-un-blue-tint",
    className: "bg-open-funding-other",
    explanation: "Other revenue",
  },
] as const;

export const secretariatFundingCrosswalk = [
  {
    label: "Regular budget",
    explanation: "Assessed contributions to the regular programme budget",
    mapsTo: "Assessed",
    className: "bg-open-funding-assessed",
    token: "--color-open-funding-assessed",
  },
  {
    label: "Other assessed",
    explanation: "Separately assessed budgets, chiefly peacekeeping and the tribunals",
    mapsTo: "Assessed",
    className: "bg-open-funding-assessed",
    token: "--color-open-funding-assessed",
  },
  {
    label: "Extrabudgetary",
    explanation: "Voluntary contributions and other extrabudgetary resources",
    mapsTo: "Voluntary earmarked",
    className: "bg-open-funding-voluntary-earmarked",
    token: "--color-open-funding-voluntary-earmarked",
  },
] as const;
