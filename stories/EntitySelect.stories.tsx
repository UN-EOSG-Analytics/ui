import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { EntitySelect } from "../components/entity-select";

const meta = {
  title: "Concepts/EntitySelect",
  component: EntitySelect,
  args: {
    value: "UNDP", onChange: () => {},
    entities: [
      { entity: "UNDP", entity_long: "United Nations Development Programme" },
      { entity: "UNICEF", entity_long: "United Nations Children's Fund" },
    ],
    labels: { input: "Organisational entity", placeholder: "Search by acronym or name", empty: "No entities found", custom: (value: string) => `Other: ${value}` },
  },
  render: function Example(args) {
    const [value, setValue] = useState(args.value);
    return <div className="max-w-sm space-y-4 pb-64"><EntitySelect {...args} value={value} onChange={setValue} /><p>Selected: {value || "—"}</p></div>;
  },
} satisfies Meta<typeof EntitySelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ListedEntitiesOnly: Story = { args: { allowCustom: false } };
export const Empty: Story = { args: { entities: [], allowCustom: false, value: "" } };
export const Disabled: Story = { args: { disabled: true } };
export const Arabic: Story = {
  args: { labels: { input: "الكيان التنظيمي", placeholder: "ابحث عن كيان", empty: "لا توجد نتائج", custom: (value) => `أخرى: ${value}` } },
  decorators: [(Story) => <div dir="rtl" lang="ar"><Story /></div>],
};
