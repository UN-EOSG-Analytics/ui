import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/data-table";

const meta = {
  title: "UI Elements/DataTable",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Table primitives with the column-header treatment built in. The audit found four different header treatments across six products — and one product shipping two of them internally. TableHead applies the tokenised treatment by default, so consistency is the path of least resistance.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const rows = [
  ["A/RES/79/1", "General Assembly", "Peace and security", 14],
  ["S/RES/2735", "Security Council", "Middle East", 3],
  ["A/RES/78/12", "General Assembly", "Sustainable development", 27],
  ["E/RES/2024/4", "ECOSOC", "Statistics", 8],
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Mandate citations by source document.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Organ</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead numeric>Citations</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([symbol, organ, subject, count]) => (
          <TableRow key={symbol as string}>
            <TableCell className="font-mono text-[13px] whitespace-nowrap">{symbol}</TableCell>
            <TableCell>{organ}</TableCell>
            <TableCell>{subject}</TableCell>
            <TableCell numeric>{count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * What the audit actually found. These are the four real treatments, side by
 * side — the case for a token, in one screen.
 */
export const TheProblem: Story = {
  name: "The problem it solves",
  render: () => {
    const variants: [string, string, string][] = [
      ["transcripts", "text-xs font-medium tracking-wider text-muted-foreground uppercase", "tokenised"],
      ["mandates", "text-xs font-medium tracking-wider text-gray-500 uppercase", "same design, hardcoded grey"],
      ["housekeeping", "font-medium text-gray-900", "one of two treatments in the same repo"],
      ["system-chart", "font-semibold text-gray-700", "no uppercase"],
      ["open", "font-medium", "weight only"],
    ];
    return (
      <div className="space-y-7">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The same column header, as rendered by five of the six products today.
        </p>
        {variants.map(([name, cls, note]) => (
          <div key={name}>
            <div className="mb-1.5 flex items-baseline gap-3">
              <span className="font-mono text-[13px] text-foreground">{name}</span>
              <span className="text-xs text-muted-foreground">{note}</span>
            </div>
            <table className="w-full max-w-xl border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className={`${cls} px-3 py-2.5 text-left`}>Symbol</th>
                  <th className={`${cls} px-3 py-2.5 text-left`}>Organ</th>
                  <th className={`${cls} px-3 py-2.5 text-right`}>Citations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2.5 font-mono text-[13px]">A/RES/79/1</td>
                  <td className="px-3 py-2.5 text-sm">General Assembly</td>
                  <td className="px-3 py-2.5 text-right text-sm tabular-nums">14</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  },
};
