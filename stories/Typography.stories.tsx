import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/** Tier, rendered size, and what it is for. */
const tiers: [keyof typeof typography, string, string][] = [
  ["pageTitle", "36px / bold", "Page hero. One per page. The ceiling."],
  ["cardTitle", "24px / semibold", "Standalone card titles — error, login, empty states."],
  ["sectionTitle", "20px / semibold", "Primary content and section headings. The workhorse."],
  ["lead", "18px / regular", "Intro paragraph under a title."],
  ["subTitle", "16px / semibold", "Sub-section and step titles."],
  ["prose", "16px / regular", "Long-form prose pages."],
  ["body", "14px / regular", "Default body and paragraph text."],
  ["meta", "14px / muted", "Metadata rows — date, category, counts."],
  ["caption", "12px / muted", "Captions, timestamps, back-links."],
  ["label", "12px / medium", "Inline labels, button and badge text."],
  ["eyebrow", "12px / uppercase", "Small label above a heading or section."],
  ["tableHeader", "12px / uppercase muted", "Table column headers."],
  ["numeric", "14px / tabular", "Figures that line up in a column."],
  ["micro", "10px / medium", "Badges, dense table meta, chip labels."],
];

export const Scale: Story = {
  render: () => (
    <div className="p-10">
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">Typography</h1>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-foreground">
        Twelve named tiers, extracted from <code className="font-mono text-sm">transcripts</code> —
        the only semantic scale that existed across the six products, and one of the two whose UI
        has had the closest review.
      </p>

      <div className="mb-12 max-w-3xl border-s-2 border-un-blue ps-5">
        <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          The principle: a low display ceiling
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          The two reviewed products reach for sizes above <code className="font-mono">text-xl</code>{" "}
          in <strong className="text-foreground">2.0%</strong> and{" "}
          <strong className="text-foreground">0.7%</strong> of all size utilities. The other four run
          3.2&ndash;9.4%, one topping out at <code className="font-mono">text-6xl</code>. The
          reviewed products carry hierarchy through <strong className="text-foreground">weight and
          colour</strong>, not size jumps — and they read as the more polished ones.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-md border-collapse text-sm">
            <tbody>
              {[
                ["un80-actions", 0.7, true],
                ["transcripts", 2.0, true],
                ["housekeeping", 3.2, false],
                ["mandates", 4.0, false],
                ["open", 5.3, false],
                ["system-chart", 9.4, false],
              ].map(([name, pct, reviewed]) => (
                <tr key={name as string} className="border-b border-border last:border-0">
                  <td className="py-2 pe-3 whitespace-nowrap">
                    {name as string}
                    {reviewed && (
                      <span className="ms-2 rounded border border-un-blue px-1.5 py-px text-[10px] font-medium tracking-wide text-un-blue-text uppercase">
                        reviewed
                      </span>
                    )}
                  </td>
                  <td className="w-full py-2 ps-3">
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "block h-1.5 rounded-full",
                          reviewed ? "bg-un-blue" : "bg-border",
                        )}
                        style={{ width: `${((pct as number) / 9.4) * 100}%` }}
                      />
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {(pct as number).toFixed(1)}%
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mb-5 text-xl font-semibold tracking-tight text-foreground">The tiers</h2>
      <div className="max-w-4xl">
        {tiers.map(([key, size, purpose]) => (
          <div key={key} className="flex items-baseline gap-6 border-b border-border py-4 last:border-0">
            <div className="w-32 shrink-0">
              <div className="font-mono text-[13px] text-foreground">{key}</div>
              <div className="font-mono text-[11px] text-muted-foreground">{size}</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn(typography[key], "truncate")}>
                United Nations Mandate Source Registry
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{purpose}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl border-s-2 border-un-orange ps-5">
        <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          Why <code className="font-mono text-base">micro</code> exists
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tailwind&rsquo;s smallest step is 12px. All six products independently hand-rolled sizes
          beneath it — <strong className="text-foreground">127 uses</strong> of 9, 10 and 11px. Six
          teams hit the same missing rung and each solved it privately, so it earned a name.{" "}
          <strong className="text-foreground">9px is deliberately not tokenised</strong>: it failed
          legibility review and wants fixing, not blessing.
        </p>
      </div>
    </div>
  ),
};
