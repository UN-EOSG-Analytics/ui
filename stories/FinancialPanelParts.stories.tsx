import { FinancialBreakdownRow } from "../components/financial-breakdown-row";
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  FinancialPanelHeading,
  FinancialPanelYearSelector,
  FinancialPanelRankedRow,
  FinancialPanelBar,
  FinancialPanelGoalBadge,
} from "../components/financial-panel-parts";
import { FinancialDetailPanel } from "../components/financial-detail-panel";
import { typography } from "../lib/typography";

const meta = {
  title: "open.un.org/Page Structure/Financial detail panel/Content components",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Extracted from System Organizations. Structural examples only: dashes are application-supplied values; bar lengths illustrate geometry, not financial records. Headings, year selection and ranked rows are shared; fetching, sorting, formatting, tooltips and navigation stay with the application.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Headings: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <FinancialPanelHeading>Overview</FinancialPanelHeading>
      <FinancialPanelHeading>Financials</FinancialPanelHeading>
      <FinancialPanelHeading subheading>Funding by donor</FinancialPanelHeading>
    </div>
  ),
};

function YearExample() {
  const [selected, setSelected] = React.useState(2025);
  return (
    <FinancialPanelYearSelector
      label="Select year"
      years={[2025, 2024, 2023]}
      selected={selected}
      onChange={setSelected}
    />
  );
}
export const YearSelector: Story = { render: () => <YearExample /> };

export const RankedRows: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <FinancialPanelRankedRow label="Country label" value="—">
        <FinancialPanelBar percent={75} color="var(--color-un-blue)" />
      </FinancialPanelRankedRow>
      <FinancialPanelRankedRow label="Contributor label" value="—">
        <FinancialPanelBar
          percent={100}
          segments={[
            { id: "one", percent: 60, color: "var(--color-un-blue)" },
            { id: "two", percent: 40, color: "var(--color-faded-jade)" },
          ]}
        />
      </FinancialPanelRankedRow>
      <FinancialPanelRankedRow
        label="Goal label"
        value="—"
        badge={
          <FinancialPanelGoalBadge label="—" color="var(--color-un-blue)" />
        }
      >
        <FinancialPanelBar percent={50} color="var(--color-un-blue)" />
      </FinancialPanelRankedRow>
    </div>
  ),
};

function IntegratedExample() {
  const [selected, setSelected] = React.useState(2025);
  return (
    <div className="h-96">
      <FinancialDetailPanel
        titleId="integrated-panel-title"
        title="Financial record"
        yearSelectorPlacement="header"
        yearSelector={{
          label: "Select year",
          years: [2025, 2024, 2023],
          selected,
          onChange: setSelected,
        }}
      >
        <p className={typography.caption}>
          Record content is supplied by the application.
        </p>
      </FinancialDetailPanel>
    </div>
  );
}
export const IntegratedYearSelector: Story = {
  render: () => <IntegratedExample />,
};

export const Inventory: Story = {
  render: () => (
    <table className={typography.body}>
      <thead>
        <tr>
          <th className="p-2 text-start">Component family</th>
          <th className="p-2 text-start">Used in the portal</th>
          <th className="p-2 text-start">Status</th>
        </tr>
      </thead>
      <tbody>
        {[
          [
            "Panel shell and circular controls",
            "All sidebar families use shared controls; Organizations, Contributors and Secretariat Overview use the financial shell",
            "Shared",
          ],
          [
            "Section headings and year selector",
            "Organizations; similar markup in Contributors, Countries and Goals",
            "Extracted; Organizations and Contributors adopted",
          ],
          [
            "Single / stacked ranked bars and goal badges",
            "Organizations; similar rows in Contributors, Countries and Goals",
            "Extracted; Organizations and Contributors adopted",
          ],
          [
            "Funding-source labels and explanations",
            "System and Secretariat panels",
            "Already shared",
          ],
          [
            "Funding and revenue/expense trends",
            "Organizations, Contributors, Secretariat Overview",
            "Reusable portal charts; candidate for shared chart renderer",
          ],
          [
            "Expandable breakdown rows",
            "Programme Budget and Peacekeeping missions",
            "Candidate: shared hierarchy presentation, separate budget logic",
          ],
          [
            "Required / available / spent bars",
            "Countries and Goals",
            "Reusable portal component; distinct financial semantics",
          ],
          [
            "Source lists, totals and state messages",
            "Financial panel; bespoke versions elsewhere",
            "Shared financial regions exist; adopt incrementally",
          ],
          [
            "Assessment exceptions, impacts and project details",
            "Peacekeeping / Trust Fund contributors, Organizations, Countries and Goals",
            "Domain content remains in portal",
          ],
        ].map(([family, usage, status]) => (
          <tr key={family}>
            <td className="border-t p-2">{family}</td>
            <td className="border-t p-2">{usage}</td>
            <td className="border-t p-2">{status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

function BreakdownExample() {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <ul className="max-w-lg space-y-1">
      <FinancialBreakdownRow
        label="Budget group"
        value="—"
        bar={<FinancialPanelBar percent={75} color="var(--color-un-blue)" />}
        tooltip={
          <span>
            Full group name and application-supplied financial details.
          </span>
        }
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <ul className="mt-1 space-y-1">
          <FinancialBreakdownRow
            label="A longer budget class label that truncates on narrow screens"
            depth={1}
            value="—"
            bar={
              <FinancialPanelBar percent={35} color="var(--color-un-blue)" />
            }
            tooltip={
              <span>
                A longer budget class label that truncates on narrow screens
              </span>
            }
          />
        </ul>
      </FinancialBreakdownRow>
    </ul>
  );
}
export const ExpandableBreakdown: Story = {
  render: () => <BreakdownExample />,
};
