import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  GroupedTreemap,
  type GroupedTreemapRow,
} from "../components/grouped-treemap";
import { Button } from "../components/button";

const currency = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const rows: GroupedTreemapRow[] = [
  {
    key: "government",
    label: "Government contributors",
    color: "var(--color-faded-jade)",
    subgroups: [
      {
        key: "member-states",
        label: "Member States",
        labelVisibility: "auto",
        leaves: [
          {
            key: "a",
            label: "Contributor A",
            value: 86,
            onActivate: () => {},
            accessibleDescription: "Activates the contributor detail view.",
          },
          {
            key: "b",
            label: "Contributor B",
            value: 54,
            onActivate: () => {},
            segments: [
              { key: "assessed", label: "Assessed", value: 34, color: "var(--color-open-funding-assessed)" },
              { key: "voluntary", label: "Voluntary", value: 20, color: "var(--color-open-funding-voluntary-earmarked)" },
            ],
          },
          {
            key: "c",
            label: "Contributor C",
            value: 28,
            color: "var(--color-un-blue-tint)",
            textColor: "var(--color-un-blue-shade)",
          },
        ],
      },
    ],
  },
  {
    key: "non-government",
    label: "Non-government contributors",
    color: "var(--color-smoky)",
    subgroups: [
      {
        key: "foundations",
        label: "Foundations and trusts",
        labelVisibility: "tooltip-only",
        leaves: [
          { key: "d", label: "Foundation D", value: 33, onActivate: () => {} },
          { key: "e", label: "Foundation E", value: 18 },
        ],
      },
      {
        key: "other",
        label: "Other partners",
        labelVisibility: "visible",
        leaves: [
          { key: "f", label: "Partner F", value: 14 },
          { key: "g", label: "Partner G", value: 7 },
        ],
      },
    ],
  },
];

const meta = {
  title: "UI Elements/GroupedTreemap",
  component: GroupedTreemap,
  args: { rows, totalLabel: "Total" },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The shared geometry and interaction foundation for row-based treemaps, using the Secretariat Overview as its literal visual and geometric source. Products supply taxonomy, colours, values and navigation. Rows are labelled; intermediate subgroups can remain spatially meaningful without a visible label; leaves expose the complete breadcrumb through hover, focus and assistive text. When summaries are omitted, the shell derives one Total from the currently visible positive leaves.",
      },
    },
  },
} satisfies Meta<typeof GroupedTreemap>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample({ multipleTotals = false }: { multipleTotals?: boolean }) {
  const [query, setQuery] = React.useState("");
  const [grouping, setGrouping] = React.useState<"type" | "region">("type");
  return (
    <GroupedTreemap
      rows={rows}
      plotClassName="h-[560px] sm:h-[680px] lg:h-[780px]"
      search={{
        value: query,
        onChange: setQuery,
        label: "Search contributors",
        placeholder: "Search contributors",
      }}
      searchAccessory={(
        <div role="group" aria-label="Group contributors" className="inline-flex rounded-md border border-border bg-background p-0.5">
          <Button
            type="button"
            size="xs"
            variant={grouping === "type" ? "default" : "ghost"}
            aria-pressed={grouping === "type"}
            onClick={() => setGrouping("type")}
          >
            Type
          </Button>
          <Button
            type="button"
            size="xs"
            variant={grouping === "region" ? "default" : "ghost"}
            aria-pressed={grouping === "region"}
            onClick={() => setGrouping("region")}
          >
            Region
          </Button>
        </div>
      )}
      summaries={multipleTotals
        ? [
            { key: "assessed", label: "Assessed", value: currency.format(120_000_000) },
            { key: "voluntary", label: "Voluntary", value: currency.format(120_000_000) },
          ]
        : undefined}
      totalLabel="Total"
      formatValue={(value) => currency.format(value * 1_000_000)}
      formatAccessibleValue={(value) => `${value} million US dollars`}
      showLeafValues
      sourceHeading="Sources"
      sources={[
        {
          key: "financial-statistics",
          label: "UN System Financial Statistics",
          href: "https://unsceb.org/financial-statistics",
          openInNewTab: true,
          newTabLabel: "opens in a new tab",
        },
        { key: "reporting-entities", label: "Reporting entities", description: "2024 submissions" },
      ]}
      emptyContent={<div className="grid h-full place-items-center text-sm text-muted-foreground">No contributors match this search.</div>}
    />
  );
}

export const OneTotal: Story = {
  args: { rows },
  render: () => <InteractiveExample />,
};

export const MultipleTotals: Story = {
  args: { rows },
  render: () => <InteractiveExample multipleTotals />,
};

const secretariatRows: GroupedTreemapRow[] = [
  {
    key: "peace-security",
    label: "Maintenance of international peace and security",
    color: "var(--color-faded-jade)",
    subgroups: [
      {
        key: "peacekeeping",
        label: "Peacekeeping operations",
        labelVisibility: "tooltip-only",
        leaves: [
          { key: "MINUSCA", label: "MINUSCA", value: 68, onActivate: () => {} },
          { key: "MONUSCO", label: "MONUSCO", value: 54, onActivate: () => {} },
          { key: "UNMISS", label: "UNMISS", value: 43, onActivate: () => {} },
        ],
      },
      {
        key: "special-political-missions",
        label: "Special political missions",
        labelVisibility: "tooltip-only",
        leaves: [
          { key: "UNAMA", label: "UNAMA", value: 31, onActivate: () => {} },
          { key: "UNSOM", label: "UNSOM", value: 18, onActivate: () => {} },
        ],
      },
      {
        key: "other",
        label: "Other peace and security entities",
        labelVisibility: "tooltip-only",
        leaves: [
          { key: "DPO", label: "DPO", value: 38, onActivate: () => {} },
          { key: "DPPA", label: "DPPA", value: 27, onActivate: () => {} },
        ],
      },
    ],
  },
  {
    key: "development",
    label: "International cooperation for development",
    color: "var(--color-camouflage-green)",
    leaves: [
      { key: "DESA", label: "DESA", value: 39, onActivate: () => {} },
      { key: "UNCTAD", label: "UNCTAD", value: 24, onActivate: () => {} },
      { key: "STA", label: "Staff Assessment", value: 11, onActivate: () => {} },
    ],
  },
];

/** Literal Secretariat Overview grammar, including hidden subgroup outlines and automatic Total. */
export const CanonicalSecretariatOverview: Story = {
  args: { rows: secretariatRows },
  render: () => (
    <GroupedTreemap
      rows={secretariatRows}
      totalLabel="Total"
      formatValue={(value) => currency.format(value * 1_000_000)}
    />
  ),
};

/** Input order keeps semantic sequences stable even when a later row is larger. */
export const SemanticRowOrder: Story = {
  args: { rows },
  render: () => (
    <GroupedTreemap
      rows={[rows[1], rows[0]]}
      height={480}
      layout={{ rowOrder: "input" }}
      summaries={[{ key: "total", label: "Total", value: currency.format(240_000_000) }]}
      totalLabel="Total"
      formatValue={(value) => currency.format(value * 1_000_000)}
    />
  ),
};
