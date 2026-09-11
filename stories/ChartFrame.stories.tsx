import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartFrame } from "../components/chart-frame";
import { ChartHeader } from "../components/chart-header";
import { ChartFooter } from "../components/chart-footer";
import { typography } from "../lib/typography";

const meta = {
  title: "open.un.org/Chart frame",
  component: ChartFrame,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ChartFrame>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Composition: Story = {
  args: {
    header: (
      <ChartHeader
        controls={
          <span className={typography.caption}>Example chart controls</span>
        }
        summaries={[{ key: "total", label: "Total", value: "$12M" }]}
      />
    ),
    children: (
      <div className="flex h-64 items-center justify-center bg-secondary">
        <p className={typography.body}>
          Treemap, map, or another visualization
        </p>
      </div>
    ),
    footer: (
      <ChartFooter
        sourceLabel="Source: example dataset"
        sourceDetails="Source description and methodology appear here."
      />
    ),
  },
};
