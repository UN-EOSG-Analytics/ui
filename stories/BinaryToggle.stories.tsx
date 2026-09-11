import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BinaryToggle } from "../components/binary-toggle";
import { typography } from "../lib/typography";

const meta = {
  title: "open.un.org/Two-option toggle",
  component: BinaryToggle,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BinaryToggle>;
export default meta;
type Story = StoryObj;
function Examples() {
  const [value, setValue] = React.useState("funding");
  const props = {
    label: "Financial measure",
    options: [
      { value: "funding", label: "Funding" },
      { value: "spending", label: "Spending" },
    ] as const,
    value,
    onValueChange: setValue,
  };
  return (
    <div className="space-y-6">
      <section>
        <h2 className={typography.subTitle}>Switch</h2>
        <BinaryToggle {...props} />
      </section>
      <section>
        <h2 className={typography.subTitle}>Segmented control</h2>
        <BinaryToggle {...props} variant="segmented" />
      </section>
      <section>
        <h2 className={typography.subTitle}>Disabled</h2>
        <BinaryToggle {...props} variant="segmented" disabled />
      </section>
      <p className={typography.caption}>
        Both examples share the same selection. The segmented control supports
        arrow-key navigation.
      </p>
    </div>
  );
}
export const Comparison: Story = { render: () => <Examples /> };
