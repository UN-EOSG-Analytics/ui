import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  FundingSourceLabel,
  type FundingSourceLabelProps,
} from "../components/funding-source-label";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import {
  openFundingTokens,
  secretariatFundingCrosswalk,
} from "../lib/funding-sources";

const meta = {
  title: "open.un.org/Funding source labels",
  component: FundingSourceLabel,
  parameters: { layout: "padded" },
} satisfies Meta<typeof FundingSourceLabel>;
export default meta;
type Story = StoryObj;

const system = openFundingTokens.map(({ key }) => ({ source: key }));
const secretariat = secretariatFundingCrosswalk.map(({ key }) => ({
  source: key,
}));

function Examples({
  items,
}: {
  items: Array<
    Pick<FundingSourceLabelProps, "source" | "label" | "explanation">
  >;
}) {
  const [selected, setSelected] = React.useState<string[]>(
    items.map((item) => item.source),
  );
  return (
    <div className="space-y-10 px-4 pt-24 pb-6">
      <section>
        <h2 className={cn(typography.sectionTitle, "mb-3")}>
          Legend and filters
        </h2>
        <div
          role="group"
          aria-label="Funding sources"
          className="flex flex-wrap gap-2"
        >
          {items.map((item) => (
            <FundingSourceLabel
              key={item.source}
              {...item}
              selected={selected.includes(item.source)}
              onToggle={() =>
                setSelected((current) =>
                  current.includes(item.source)
                    ? current.filter((key) => key !== item.source)
                    : [...current, item.source],
                )
              }
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className={cn(typography.sectionTitle, "mb-3")}>Sidebar labels</h2>
        <div className="max-w-sm space-y-2">
          {items.map((item, index) => (
            <div
              key={item.source}
              className="flex items-center justify-between gap-4"
            >
              <FundingSourceLabel {...item} variant="inline" />
              <span className={cn(typography.caption, "tabular-nums")}>
                ${(index + 1) * 12}M
              </span>
            </div>
          ))}
        </div>
      </section>
      <p className={cn(typography.caption, "text-muted-foreground")}>
        Sample amounts only. Hover or focus any funding label for explanations.
        Inline labels have a dotted underline. Press Escape to dismiss. Legend
        pills toggle independently.
      </p>
    </div>
  );
}
export const UNSystem: Story = { render: () => <Examples items={system} /> };
export const UNSecretariat: Story = {
  render: () => <Examples items={secretariat} />,
};

export const WiderTooltips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-6">
      <FundingSourceLabel source="voluntary-earmarked" tooltipWidth={440} />
      <FundingSourceLabel
        source="extrabudgetary"
        variant="inline"
        tooltipWidth={440}
      />
    </div>
  ),
};
