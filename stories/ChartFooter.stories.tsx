import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartFooter } from "../components/chart-footer";
const meta = {
  title: "open.un.org/Chart footer",
  component: ChartFooter,
  parameters: { layout: "padded" },
  args: {
    sourceLabel: "Source: example dataset",
    sourceDetails:
      "Example methodology: describe the source, reporting period, coverage and limitations here.",
  },
} satisfies Meta<typeof ChartFooter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SourceAndDownload: Story = {};
