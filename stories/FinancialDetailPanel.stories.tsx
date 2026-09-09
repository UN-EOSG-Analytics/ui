import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Share2, X } from "lucide-react";
import {
  FinancialDetailPanel,
  type FinancialDetailPanelFundingBreakdown,
  type FinancialDetailPanelProps,
} from "../components/financial-detail-panel";
import { DetailField, DetailFields, DetailSection } from "../components/detail-panel";
import { DetailPanelControls } from "../components/detail-panel-controls";
import { Chip } from "../components/chip";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

const meta = {
  title: "open.un.org/Page Structure/Financial detail panel",
  component: FinancialDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A product-data-agnostic composition for open.un.org financial records. It standardizes the summary, year, funding breakdown, trends, sources and loading states while leaving data fetching, routing, taxonomies and domain-specific sections to the product.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const yearOptions = [
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
] as const;

const standardFunding: FinancialDetailPanelFundingBreakdown = {
  heading: "Funding sources",
  status: "Funding-source breakdown is ready.",
  items: [
    {
      id: "assessed",
      label: "Assessed contributions",
      value: "$1.42 billion",
      share: "67%",
      marker: <span className="block size-3 rounded-sm bg-open-funding-assessed" />,
    },
    {
      id: "unearmarked",
      label: "Voluntary unearmarked",
      value: "$412 million",
      share: "19%",
      marker: <span className="block size-3 rounded-sm bg-open-funding-voluntary-unearmarked" />,
    },
    {
      id: "earmarked",
      label: "Voluntary earmarked",
      value: "$305 million",
      share: "14%",
      marker: <span className="block size-3 rounded-sm bg-open-funding-voluntary-earmarked" />,
    },
  ],
  note: "Figures may not add up because of rounding.",
};

function Sparkline() {
  return (
    <div className="flex h-28 items-end gap-2" aria-label="Mock financial trend">
      {[48, 62, 55, 73, 81, 76].map((height, index) => (
        <span
          key={index}
          className="min-w-0 flex-1 rounded-t-sm bg-un-blue"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function Controls() {
  return (
    <DetailPanelControls
      share={{ label: "Share", onClick: () => {}, icon: <Share2 className="size-4" /> }}
      close={{ label: "Close", onClick: () => {}, icon: <X className="size-4" /> }}
    />
  );
}

function PanelFrame({ children, titleId }: { children: React.ReactNode; titleId: string }) {
  return (
    <div className="flex min-h-screen justify-end bg-muted/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="h-screen w-full border-s border-border bg-background sm:w-auto"
      >
        {children}
      </div>
    </div>
  );
}

type DemoProps = Omit<FinancialDetailPanelProps, "year"> & {
  initialYear?: string;
  year?: FinancialDetailPanelProps["year"];
};

function Demo({ initialYear = "2023", year, ...props }: DemoProps) {
  const [selectedYear, setSelectedYear] = React.useState(initialYear);
  const selectedYearControl: FinancialDetailPanelProps["year"] = year ?? {
    kind: "select",
    label: "Year",
    value: selectedYear,
    options: yearOptions,
    onChange: setSelectedYear,
  };

  return (
    <PanelFrame titleId={props.titleId}>
      <FinancialDetailPanel {...props} year={selectedYearControl} />
    </PanelFrame>
  );
}

const baseProps = {
  titleId: "financial-panel-system-contributor",
  eyebrow: "Contributor",
  title: "Kingdom of Norland",
  controls: <Controls />,
  metadata: (
    <>
      <Chip density="dense">Government</Chip>
      <Chip density="dense">Northern Europe</Chip>
    </>
  ),
  total: { label: "Total contributions", value: "$2.14 billion", details: "Current prices" },
  fundingBreakdown: standardFunding,
  trend: {
    heading: "Contributions over time",
    hint: "2018–2023",
    state: "ready" as const,
    status: "Trend data is ready.",
    content: <Sparkline />,
  },
};

export const SystemContributor: Story = {
  render: () => <Demo {...baseProps} />,
};

export const SecretariatEntity: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-secretariat-entity"
      eyebrow="UN Secretariat-administered"
      title="Department of Example Operations"
      total={{ label: "Total expenditure", value: "$684 million", details: "Final expenditure" }}
      fundingBreakdown={{
        heading: "Funding sources",
        status: "Funding-source breakdown is ready.",
        items: [
          {
            id: "regular",
            label: "Regular budget",
            value: "$302 million",
            share: "44%",
            marker: <span className="block size-3 rounded-sm bg-open-funding-assessed" />,
          },
          {
            id: "other-assessed",
            label: "Other assessed",
            value: "$141 million",
            share: "21%",
            marker: <span className="block size-3 rounded-sm bg-open-funding-assessed" />,
          },
          {
            id: "extrabudgetary",
            label: "Extrabudgetary",
            value: "$241 million",
            share: "35%",
            marker: <span className="block size-3 rounded-sm bg-open-funding-voluntary-earmarked" />,
          },
        ],
      }}
    />
  ),
};

export const ProgrammeBudgetProvenance: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-programme-budget"
      eyebrow="Programme budget"
      title="Economic and social development in Example Region"
      total={{ label: "Approved resources", value: "$96.8 million", details: "Before recosting" }}
      sources={{
        heading: "Sources",
        newTabLabel: "opens in a new tab",
        status: "One source is available.",
        items: [
          {
            id: "pbb",
            label: "Proposed programme budget for 2023",
            href: "https://documents.un.org/",
            description: "Fascicle 12 · Section 18",
          },
        ],
      }}
    >
      <DetailSection heading="Budget hierarchy" hint="3 levels">
        <DetailFields columns={1}>
          <DetailField label="Part">International cooperation for development</DetailField>
          <DetailField label="Section">Economic and social development in Example Region</DetailField>
          <DetailField label="Subprogramme">Inclusive and sustainable growth</DetailField>
        </DetailFields>
      </DetailSection>
    </Demo>
  ),
};

export const Loading: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-loading"
      busy
      statusMessage="Updating financial data for 2022. The previous year remains visible."
      fundingBreakdown={{
        ...standardFunding,
        state: "loading",
        status: "Updating the funding-source breakdown. Previous values remain visible.",
      }}
      trend={{
        ...baseProps.trend,
        state: "loading",
        status: "Updating the trend. The previous trend remains visible.",
      }}
      sources={{
        heading: "Sources",
        newTabLabel: "opens in a new tab",
        state: "loading",
        status: "Updating sources. The previous source remains visible.",
        items: [{ id: "source", label: "UN financial statistics", href: "https://unsceb.org/" }],
      }}
      year={{
        kind: "select",
        label: "Year",
        value: "2022",
        options: yearOptions,
        onChange: () => {},
        pending: true,
        pendingLabel: "Loading 2022…",
      }}
    />
  ),
};

export const NoData: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-no-data"
      total={{ label: "Total contributions", value: "—" }}
      fundingBreakdown={{
        heading: "Funding sources",
        items: [],
        state: "empty",
        status: "No funding-source breakdown is available for this year.",
      }}
      trend={{
        heading: "Contributions over time",
        state: "empty",
        status: "No trend is available for this contributor.",
      }}
      sources={{
        heading: "Sources",
        newTabLabel: "opens in a new tab",
        items: [],
        state: "empty",
        status: "No sources are available for this record.",
      }}
      notice={{
        tone: "empty",
        title: "No financial data",
        description: "No reported figures are available for this contributor and year.",
      }}
    />
  ),
};

export const RegionErrorWithPreservedContent: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-region-error"
      fundingBreakdown={{
        ...standardFunding,
        state: "error",
        status: "The funding-source update failed. Previous values remain visible.",
      }}
      trend={{
        ...baseProps.trend,
        state: "error",
        status: "The trend update failed. The previous trend remains visible.",
      }}
      sources={{
        heading: "Sources",
        newTabLabel: "opens in a new tab",
        state: "error",
        status: "The sources could not be refreshed. The previous source remains visible.",
        items: [{ id: "source", label: "UN financial statistics", href: "https://unsceb.org/" }],
      }}
    />
  ),
};

export const StaticYear: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-static-year"
      year={{ kind: "static", label: "Reporting year", value: "2023" }}
    />
  ),
};

export const IncompleteBreakdown: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-incomplete"
      fundingBreakdown={{
        ...standardFunding,
        state: "incomplete",
        status: "$18 million is reported without a funding-source classification.",
      }}
      notice={{
        tone: "incomplete",
        title: "Partial classification",
        description: "The total is complete, but the funding-source breakdown is not.",
      }}
    />
  ),
};

export const LongMobileLabels: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-long-labels"
      title="Office for Multilateral Cooperation and Sustainable Development Partnerships"
      fundingBreakdown={{
        heading: "Funding sources",
        status: "Funding-source breakdown is ready.",
        items: [
          {
            id: "long",
            label: "Voluntary contributions earmarked for country-level programme implementation",
            value: "$305 million",
            share: "71.4% of the classified total",
            details: "Includes multi-partner trust funds",
            marker: <span className="block size-3 rounded-sm bg-open-funding-voluntary-earmarked" />,
          },
        ],
      }}
    />
  ),
};

export const MultipleSources: Story = {
  render: () => (
    <Demo
      {...baseProps}
      titleId="financial-panel-multiple-sources"
      sources={{
        heading: "Sources",
        newTabLabel: "opens in a new tab",
        status: "Three sources are available.",
        items: [
          { id: "statistics", label: "UN system financial statistics", href: "https://unsceb.org/" },
          { id: "report", label: "Audited financial statements", href: "https://documents.un.org/", description: "Volume I · Note 4" },
          { id: "method", label: "Portal methodology", href: "https://open.un.org/" },
        ],
      }}
    />
  ),
};

export const CustomSdgSection: Story = {
  render: () => (
    <Demo {...baseProps} titleId="financial-panel-sdgs">
      <DetailSection heading="Sustainable Development Goals" hint="4 goals">
        <div className="flex flex-wrap gap-2">
          {["1 · No poverty", "5 · Gender equality", "13 · Climate action", "17 · Partnerships"].map((goal) => (
            <Chip key={goal} density="dense">{goal}</Chip>
          ))}
        </div>
        <p className={cn(typography.caption, "mt-3")}>
          Goal associations are supplied by the product, not inferred by this panel.
        </p>
      </DetailSection>
    </Demo>
  ),
};
