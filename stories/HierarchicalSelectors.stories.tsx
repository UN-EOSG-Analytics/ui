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

function FlatClusterExample() {
  const [selected, setSelected] = React.useState("all");
  return (
    <div className="space-y-3">
      <p className={typography.caption}>
        Open the pill, search the flat list, and select a cluster. Clear the
        dropdown search or select All clusters to reset. Tab reaches each
        option; Enter or Space selects it. Long labels retain their full
        accessible names.
      </p>
      <HierarchicalSingleSelect
        label="Programme cluster"
        groups={flatClusters}
        selected={selected}
        onChange={setSelected}
        searchPlaceholder="Search clusters"
        clearSearchLabel="Clear cluster search"
        noResultsLabel="No matching clusters."
      />
      <p className={typography.caption} aria-live="polite">
        {flatClusters.find((option) => option.id === selected)?.label}
      </p>
    </div>
  );
}

export const FlatProgrammeClusters: Story = {
  render: () => <FlatClusterExample />,
};

const flatClusters = [
  {
    id: "all",
    label: "All clusters",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-28",
    label: "Regional economic and social development programmes",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-6",
    label: "Poverty, inequality and social inclusion",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-2",
    label: "Macroeconomic analysis and development finance",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-8",
    label: "Climate action and resilience",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-1",
    label: "Official statistics and statistical capacity",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-26",
    label: "Space technology applications for development",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-14",
    label: "2030 Agenda implementation and coordination",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-13",
    label: "Development planning and public governance",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-29",
    label: "Investment and enterprise development",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-12",
    label: "Population and development",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-11",
    label: "Housing, land and sustainable settlements",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-4",
    label: "Innovation and productive transformation",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-3",
    label: "Trade policy, facilitation and regional integration",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-5",
    label: "Transport connectivity and logistics",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-20",
    label: "Human resources management and support",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-7",
    label: "Gender equality and women’s empowerment",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-10",
    label: "Sustainable energy",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-25",
    label: "Refugee protection",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-27",
    label: "Sustainable forest management",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-24",
    label: "Peacebuilding and rule-of-law institutional support",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-16",
    label: "Subregional development policy support",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-21",
    label: "Programme planning and financial administration",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-9",
    label: "Environmental law and governance",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-15",
    label: "Least developed countries’ structural transformation",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-22",
    label: "Office administration and support services",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-23",
    label: "Secretariat technology operations and solutions",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-19",
    label: "Environmental data and evidence for policy",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-17",
    label: "Public communications content and audience engagement",
    children: [],
  },
  {
    id: "ahwg-ppb2027-cluster-18",
    label: "United Nations knowledge and information access",
    children: [],
  },
];
