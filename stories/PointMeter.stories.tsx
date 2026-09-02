import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { PointMeter, scoreTotal, type PointValue } from "../components/point-meter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/data-table";
import { EntityRef } from "../components/concepts";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

const LABELS = ["Documents", "Active mandates", "Budget-linked", "Implementation-linked", "Results-linked"];

const meta = {
  title: "Concepts/PointMeter",
  component: PointMeter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "An ordinal score as positional dots, from mandates' system registry. The only scale here that carries magnitude rather than category — and the only validated one: the ramp is CVD-checked as a set (protan/deutan/tritan ΔE ≥ 10 between adjacent steps, ≥ 3:1 on white). The audit left 'a real data-viz scale' open; this closes it.",
      },
    },
  },
  args: { labels: LABELS },
} satisfies Meta<typeof PointMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

const p = (...v: PointValue[]) => v;

/** The four steps. Colour follows the total, so one meter is never two colours. */
export const Ramp: Story = {
  args: { points: [] },
  render: () => (
    <div className="max-w-lg space-y-3">
      {[
        p(true, false, false, false, false),
        p(true, true, false, false, false),
        p(true, true, true, false, false),
        p(true, true, true, true, false),
        p(true, true, true, true, true),
      ].map((points, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border pb-3 last:border-0">
          <PointMeter points={points} labels={LABELS} />
          <span className={typography.caption}>
            {scoreTotal(points)} of 5 · step {[1, 2, 2, 3, 4][i]}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** A partial point renders as a ring and counts as a half. */
export const Partial: Story = {
  args: { points: p(true, true, "partial", false, false) },
};

/**
 * Why the rules matter. Colour is never alone — the dots already encode the
 * count by fill, so the meter reads with no colour vision at all, and in print.
 * Position is stable, so dot 3 is always the same criterion and a column can be
 * scanned vertically; that is why an unmet point stays as a grey dot rather
 * than collapsing.
 */
export const InATable: Story = {
  name: "In a table — the real use",
  args: { points: [] },
  render: () => (
    <div className="max-w-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entity</TableHead>
            <TableHead>Registry evidence</TableHead>
            <TableHead numeric>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["UNDP", "United Nations Development Programme", p(true, true, true, true, true)],
            ["OCHA", "Office for the Coordination of Humanitarian Affairs", p(true, true, true, "partial", false)],
            ["UNEP", "United Nations Environment Programme", p(true, true, false, false, false)],
            ["UNCTAD", "UN Conference on Trade and Development", p(true, false, false, false, false)],
          ].map(([ac, name, points]) => (
            <TableRow key={ac as string}>
              <TableCell><EntityRef acronym={ac as string} name={name as string} /></TableCell>
              <TableCell><PointMeter points={points as PointValue[]} labels={LABELS} /></TableCell>
              <TableCell numeric>{scoreTotal(points as PointValue[])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className={cn(typography.caption, "mt-3 max-w-md")}>
        Each dot is one point of evidence, in a fixed order:{" "}
        {LABELS.join(" · ")}.
      </p>
    </div>
  ),
};
