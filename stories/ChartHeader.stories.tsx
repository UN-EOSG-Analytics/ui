import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartHeader } from "../components/chart-header";
import { FundingSourceLabel } from "../components/funding-source-label";
import { SearchInput } from "../components/search-input";

const meta = {
  title: "open.un.org/Chart header",
  component: ChartHeader,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ChartHeader>;
export default meta;
type Story = StoryObj;
function Example() {
  const [year, setYear] = React.useState("2025");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(true);
  return (
    <ChartHeader
      yearControl={
        <label className="flex items-center gap-2">
          Year{" "}
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            <option>2024</option>
            <option>2025</option>
          </select>
        </label>
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
