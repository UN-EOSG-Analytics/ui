import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { YearSlider } from "../components/year-slider";
import { ChartHeader } from "../components/chart-header";
import { FundingSourceLabel } from "../components/funding-source-label";
import { SearchInput } from "../components/search-input";

const meta = {
  title: "open.un.org/Charts/Chart header",
  component: ChartHeader,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ChartHeader>;
export default meta;
type Story = StoryObj;
function Example() {
  const [year, setYear] = React.useState(2025);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(true);
  return (
    <ChartHeader
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
          onToggle={() => setSelected((current) => !current)}
        />
      }
      search={
        <SearchInput
          variant="border-bottom"
          className="w-full sm:w-48"
          showClear
          onClear={() => setQuery("")}
          aria-label="Search sample items"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search..."
        />
      }
      summaries={[{ key: "total", label: "Sample total", value: "$12.5M" }]}
    />
  );
}
export const SharedLayout: Story = { render: () => <Example /> };
