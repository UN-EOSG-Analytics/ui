import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SegmentedControl } from "../components/segmented-control";

const meta = {
  title: "UI Elements/Segmented control",
  component: SegmentedControl,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SegmentedControl>;
export default meta;

function BudgetExample() {
  const [value, setValue] = React.useState("expenditure");
  return (
    <SegmentedControl
      label="Budget metric"
      borderless
      value={value}
      onValueChange={setValue}
      options={[
        {
          value: "proposed",
          label: "Proposed",
          description: "Proposed resources.",
        },
        {
          value: "approved",
          label: "Approved",
          description: "Unavailable for this example year.",
          disabled: true,
        },
        {
          value: "expenditure",
          label: "Expenditure",
          description: "Actual expenditure.",
        },
      ]}
    />
  );
}
export const BudgetMeasures: StoryObj = { render: () => <BudgetExample /> };
