import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  FinancialDetailPanel,
  type FinancialDetailPanelProps,
} from "../components/financial-detail-panel";
import { FundingSourceLabel } from "../components/funding-source-label";

const meta = {
  title: "open.un.org/Page Structure/Financial detail panel/Panel",
  component: FinancialDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Built-in financial-panel regions only. Dashes indicate values supplied by the application; no fictional records or chart data are included. The portal currently uses this composition for System Organizations, System Contributors and Secretariat Overview details. The application supplies the dialog, close/share controls, record data, trend visualization and additional domain sections. The panel itself supplies the title, summary/year layout, funding rows, trend-section container, sources and status treatments.",
      },
    },
  },
} satisfies Meta<typeof FinancialDetailPanel>;
export default meta;
type Story = StoryObj;

const baseProps: FinancialDetailPanelProps = {
  titleId: "financial-detail-panel-title",
  title: "Financial record",
  total: { label: "Total expenses", value: "—" },
  year: { kind: "static", label: "Year", value: "—" },
};

function Preview(props: Partial<FinancialDetailPanelProps>) {
  return (
    <div className="flex min-h-screen justify-end bg-muted/40">
      <FinancialDetailPanel
        {...baseProps}
        {...props}
        className="min-h-screen bg-background"
      />
    </div>
  );
}

export const Summary: Story = { render: () => <Preview /> };

export const FundingSources: Story = {
  render: () => (
    <Preview
      fundingBreakdown={{
        heading: "Funding sources",
        status: "Amounts are supplied by the application.",
        items: (
          ["regular_budget", "other_assessed", "extrabudgetary"] as const
        ).map((source) => ({
          id: source,
          label: <FundingSourceLabel source={source} variant="inline" />,
          marker: null,
          value: "—",
        })),
      }}
    />
  ),
};

export const EmptyRegions: Story = {
  render: () => (
    <Preview
      fundingBreakdown={{
        heading: "Funding sources",
        items: [],
        state: "empty",
        status: "No funding-source breakdown is available.",
      }}
      trend={{
        heading: "Trend by funding source",
        state: "empty",
        status: "No trend data is available.",
      }}
      sources={{
        heading: "Source and methodology",
        items: [],
        newTabLabel: "opens in a new tab",
        state: "empty",
        status: "No source is available.",
      }}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <Preview
      busy
      statusMessage="Loading financial data."
      fundingBreakdown={{
        heading: "Funding sources",
        items: [],
        state: "loading",
        status: "Loading funding sources…",
      }}
      trend={{
        heading: "Trend by funding source",
        state: "loading",
        status: "Loading trend data…",
      }}
    />
  ),
};

export const Error: Story = {
  render: () => (
    <Preview
      notice={{
        tone: "error",
        title: "Data unavailable",
        description: "The financial record could not be loaded.",
      }}
    />
  ),
};

export const Incomplete: Story = {
  render: () => (
    <Preview
      notice={{
        tone: "incomplete",
        title: "Incomplete breakdown",
        description:
          "The available breakdown does not reconcile to the published total.",
      }}
    />
  ),
};
