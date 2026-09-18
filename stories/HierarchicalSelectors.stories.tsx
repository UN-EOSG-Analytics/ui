import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HierarchicalSingleSelect } from "../components/hierarchical-single-select";
import { HierarchicalMultiSelect } from "../components/hierarchical-multi-select";
import { typography } from "../lib/typography";

const meta = {
  title: "open.un.org/Selection dropdowns",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const groups = [
  {
    id: "agencies",
    label: "Agencies",
    bgColor: "bg-un-blue",
    children: ["Agency A", "Agency B"],
  },
  {
    id: "funds",
    label: "Funds",
    bgColor: "bg-un-green",
    children: ["Fund A", "Fund B"],
  },
];
const priorities = [
  "Peace and security",
  "Sustainable development",
  "Human rights",
];
const colors = [
  "var(--color-un-blue)",
  "var(--color-un-green)",
  "var(--color-un-purple)",
];
const colorFor = (id: string) =>
  id === "funds" || id.startsWith("Fund")
    ? "var(--color-un-green)"
    : "var(--color-un-blue)";

function SingleExample() {
  const [selected, setSelected] = React.useState("agencies");
  return (
    <HierarchicalSingleSelect
      groups={groups.map((group) => ({ ...group, color: colorFor(group.id) }))}
      selected={selected}
      onChange={setSelected}
    />
  );
}
function MultipleExample() {
  const [selected, setSelected] = React.useState(
    new Set(["Agency A", "Fund B"]),
  );
  return (
    <HierarchicalMultiSelect
      groups={groups}
      selected={selected}
      onChange={setSelected}
      getItemColor={colorFor}
    />
  );
}
function SummaryExample() {
  const [selected, setSelected] = React.useState(new Set(priorities));
  return (
    <div className="space-y-3">
      <p className={typography.caption}>
        A compact summary replaces individual pills. Open the dropdown to search
        and change the selection.
      </p>
      <HierarchicalMultiSelect
        groups={priorities.map((name) => ({
          id: name,
          label: name,
          bgColor: "",
          children: [],
        }))}
        selected={selected}
        onChange={setSelected}
        getItemColor={(id) => colors[priorities.indexOf(id)]}
        selectionSummary={
          selected.size === priorities.length
            ? "All priority areas"
            : `${selected.size} priority areas selected`
        }
      />
    </div>
  );
}
export const SingleSelection: Story = { render: () => <SingleExample /> };
export const MultipleSelection: Story = { render: () => <MultipleExample /> };
export const CollapsedSelection: Story = { render: () => <SummaryExample /> };
