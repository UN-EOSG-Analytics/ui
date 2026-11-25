import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  formatAssessmentRate,
  formatCount,
  formatCurrency,
  formatPercent,
} from "../lib/format-budget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/data-table";
import { BudgetFigure } from "../components/concepts";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

type Kind = "money" | "percentage" | "assessment" | "count";
interface FormattingProps {
  kind: Kind;
  value: number;
  currency: "USD" | "CHF" | "EUR";
  signed: boolean;
  bounded: boolean;
}

const examples: Record<
  Kind,
  { title: string; description: string; values: number[] }
> = {
  money: {
    title: "Money",
    description:
      "Compact amounts everywhere, including totals, tables and tooltips. At most one decimal and roughly three significant digits. Downloads retain the original precision.",
    values: [
      0,
      456,
      -456,
      1000,
      12000,
      123456,
      1234567,
      12345678,
      123456789,
      12345678000,
      999500,
      NaN,
    ],
  },
  percentage: {
    title: "Shares and payment coverage",
    description:
      "Whole percentages from 10% upwards; at most one decimal below 10%; positive values below 0.1% show <0.1%. Only actual completion displays 100%. Disable bounded for changes rather than shares. Inputs are percentage points: 19.3 means 19.3%, not 1930%.",
    values: [
      0,
      0.04,
      0.4,
      3.74,
      5,
      9.96,
      19.3,
      45.6,
      98.6,
      99.8,
      100,
      100.2,
      -19.3,
      NaN,
    ],
  },
  assessment: {
    title: "Official assessment rates",
    description:
      "Official rates determine obligations and retain up to three decimal places. Trailing zeros disappear; tiny nonzero rates remain distinguishable from zero. Use this formatter for published rates, rather than payment coverage.",
    values: [0, 0.0001, 0.001, 0.01, 0.125, 0.326, 1.23456, 22, NaN],
  },
  count: {
    title: "Workforce counts",
    description:
      "Whole numbers for small counts; compact large workforce counts use the same digit limit as money. Countries, organizations, projects and other discrete inventories can retain their whole-number counts.",
    values: [0, 27, 193, 1000, 12345, 123456, NaN],
  },
};

function NumberFormatting({
  kind,
  value,
  currency,
  signed,
  bounded,
}: FormattingProps) {
  const example = examples[kind];
  const format = (amount: number) => {
    switch (kind) {
      case "money":
        return formatCurrency(amount, currency);
      case "percentage":
        return formatPercent(amount, { signed, bounded });
      case "assessment":
        return formatAssessmentRate(amount);
      case "count":
        return formatCount(amount);
    }
  };
  return (
    <div className="mx-auto max-w-3xl space-y-5 p-6">
      <h1 className={typography.pageTitle}>{example.title}</h1>
      <p className={typography.body}>{example.description}</p>
      <div className="flex items-baseline justify-between gap-4 border-y border-border py-4">
        <span className={typography.body}>Interactive example</span>
        <output className={cn(typography.sectionTitle, "tabular-nums")}>
          {format(value)}
        </output>
      </div>
      {kind === "money" && (
        <p className={typography.body}>
          BudgetFigure uses the same helper, without an exact-value hover:{" "}
          <BudgetFigure amount={value} currency={currency} />
        </p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Input</TableHead>
            <TableHead numeric>Rounded display</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {example.values.map((amount, index) => (
            <TableRow key={index}>
              <TableCell>
                {Number.isNaN(amount) ? "Unavailable" : String(amount)}
              </TableCell>
              <TableCell numeric>{format(amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const meta = {
  title: "Foundations/Number formatting",
  component: NumberFormatting,
  parameters: { layout: "fullscreen" },
  args: {
    kind: "money",
    value: 12345678,
    currency: "USD",
    signed: false,
    bounded: true,
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["money", "percentage", "assessment", "count"],
    },
    value: { control: "number" },
    currency: { control: "select", options: ["USD", "CHF", "EUR"] },
    signed: { control: "boolean" },
    bounded: { control: "boolean" },
  },
} satisfies Meta<typeof NumberFormatting>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Money: Story = {};
export const Percentages: Story = { args: { kind: "percentage", value: 98.6 } };
export const OfficialAssessmentRates: Story = {
  args: { kind: "assessment", value: 0.001 },
};
export const WorkforceCounts: Story = {
  args: { kind: "count", value: 123456 },
};
