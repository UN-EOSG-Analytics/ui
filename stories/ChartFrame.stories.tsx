import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartFrame } from "../components/chart-frame";
import { ChartFooter } from "../components/chart-footer";
import { GroupedTreemap } from "../components/grouped-treemap";
import { YearSlider } from "../components/year-slider";
import { FundingSourceLabel } from "../components/funding-source-label";

const meta = {
  title: "open.un.org/Charts/Chart frame",
  component: ChartFrame,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ChartFrame>;
export default meta;
type Story = StoryObj;

function Example() {
  const [year, setYear] = React.useState(2025);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(true);
  // GroupedTreemap already composes ChartFrame, ChartHeader and the supplied footer.
  return (
    <GroupedTreemap
      rows={
        selected
          ? [
              {
                key: "sample",
                label: "Example organizations",
                color: "var(--color-un-blue)",
                leaves: [
                  {
                    key: "a",
                    label: "Organization A",
                    value: 5 + (year - 2021) * 2,
                  },
                  {
                    key: "b",
                    label: "Organization B",
                    value: 10 - (year - 2021),
                  },
                  {
                    key: "c",
                    label: "Organization C",
                    value: 3 + (year - 2021),
                  },
                ],
              },
            ]
          : []
      }
      yearControl={
        <YearSlider
          years={[2021, 2022, 2023, 2024, 2025]}
          selectedYear={year}
          onChange={setYear}
        />
      }
      controls={
        <FundingSourceLabel
          source="assessed"
          selected={selected}
          onToggle={() => setSelected((value) => !value)}
        />
      }
      search={{
        value: query,
        onChange: setQuery,
        label: "Search organizations",
        placeholder: "Search organizations...",
      }}
      totalLabel="Total"
      formatValue={(value) => `$${value}M`}
      plotClassName="h-80"
      footer={
        <ChartFooter
          hint="Click on an organization to explore details"
          sourceLabel="Source: illustrative data"
          sourceDetails="Dummy figures for reviewing chart controls and layout. Move the year slider to preview a data transition."
        />
      }
    />
  );
}
export const Composition: Story = { render: () => <Example /> };
