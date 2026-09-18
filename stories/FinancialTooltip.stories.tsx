import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinancialTooltip } from "../components/financial-tooltip";
const meta = {
  title: "open.un.org/Charts/Financial tooltip",
  component: FinancialTooltip,
  parameters: { layout: "centered" },
} satisfies Meta<typeof FinancialTooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Hierarchy: Story = {
  args: {
    title: "Example entity with its full name",
    parents: [
      { label: "Part I", color: "var(--color-un-green)" },
      { label: "Section 1" },
    ],
    context: "Illustrative values",
    total: { label: "Spending", value: "$10M" },
    rows: [
      {
        label: "Regular budget",
        value: "$6M",
        color: "var(--color-open-funding-assessed)",
        share: 0.6,
      },
      {
        label: "Other assessed",
        value: "$3M",
        color: "var(--color-un-blue)",
        share: 0.3,
      },
      {
        label: "Extrabudgetary",
        value: "$1M",
        color: "var(--color-un-blue-tint)",
        share: 0.1,
      },
    ],
    actionHint: "Click to explore details",
  },
};
export const SingleAmount: Story = {
  args: {
    title: "Example country",
    context: "Illustrative value",
    total: { label: "Spending", value: "$2.5M" },
    actionHint: "Click to explore details",
  },
};
export const Adjustment: Story = {
  args: {
    ...Hierarchy.args,
    rows: [
      {
        label: "Contributions",
        value: "$10.2M",
        share: 1,
        color: "var(--color-un-blue)",
      },
      { label: "Negative adjustment", value: "-$200K" },
    ],
    notes: "Negative adjustments are shown as signed amounts.",
  },
};
