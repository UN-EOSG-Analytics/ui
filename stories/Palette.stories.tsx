import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

const meta: Meta = {
  title: "Foundations/Palette",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function Section({ title, note, children }: {
  title: string; note?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className={cn(typography.sectionTitle, "mb-1")}>{title}</h2>
      {note && <div className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{note}</div>}
      {children}
    </section>
  );
}

function Swatch({ cls, name, hex, note, dark }: {
  cls: string; name: string; hex: string; note?: string; dark?: boolean;
}) {
  return (
    <div className="w-44">
      <div className={cn("h-16 rounded border", cls, dark ? "border-black/10" : "border-border")} />
      <div className="mt-2 font-mono text-[12px] text-foreground">{name}</div>
      <div className="font-mono text-[11px] text-muted-foreground">{hex}</div>
      {note && <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{note}</div>}
    </div>
  );
}

/**
 * The three that carry the brand. Everything else is used sparingly.
 */
export const Primary: Story = {
  render: () => (
    <div className="p-10">
      <h1 className={cn(typography.pageTitle, "mb-2")}>Palette</h1>

      <Section
        title="Primary brand colours"
        note="These three carry the brand. Black is TRUE black — 100% K, #000000 — not a near-black. Four of the six products shipped shadcn's oklch(0.145 0 0) instead, and a fifth used text-slate-950, because nobody decided."
      >
        <div className="flex flex-wrap gap-5">
          <Swatch cls="bg-un-blue" name="un-blue" hex="#009EDB" note="Pantone 2925 · the accent for everything" />
          <Swatch cls="bg-un-black" name="un-black" hex="#000000" note="100% K · all body text" dark />
          <Swatch cls="bg-un-white" name="un-white" hex="#FFFFFF" note="the ground" />
        </div>
      </Section>

      <Section
        title="UN Blue — the full ramp"
        note="The only accent that earns a complete set, because it is the only one used at volume. Tints are for background washes; the shade is for deep fills and text on light; the -text values are the brand's own accessible text colours for white grounds."
      >
        <div className="flex flex-wrap gap-5">
          <Swatch cls="bg-un-blue-tint-50" name="un-blue-tint-50" hex="#E3EDF6" note="lightest wash" />
          <Swatch cls="bg-un-blue-tint" name="un-blue-tint" hex="#C5DFEF" note="Pantone 290" />
          <Swatch cls="bg-un-blue" name="un-blue" hex="#009EDB" note="true value" />
          <Swatch cls="bg-un-blue-text" name="un-blue-text" hex="#0077B8" note="AA on white" />
          <Swatch cls="bg-un-blue-text-aaa" name="un-blue-text-aaa" hex="#005392" note="AAA on white" />
          <Swatch cls="bg-un-blue-shade" name="un-blue-shade" hex="#004987" note="Pantone 301" />
        </div>
        <div className="mt-6 max-w-xl rounded border border-border p-4">
          <p className="mb-2 text-sm">
            <span className="text-un-blue">This is the true value as text.</span>{" "}
            <span className="text-un-blue-text">This is the AA variant.</span>
          </p>
          <p className={typography.caption}>
            The true value does not clear AA as body text on white. Use it for
            fills, borders and dots; use <code className="font-mono">-text</code> when
            the colour is the text.
          </p>
        </div>
      </Section>

      <Section
        title="Accent colours — used sparingly"
        note={
          <>
            The brand guide is specific: accents are “primarily used in instances
            when large amounts of information need to be differentiated by colour,
            such as in charts, graphs or maps” — and must <strong className="text-foreground">not</strong>{" "}
            be colour-coded to represent particular ideas or entities. They are not
            a semantic palette, and in practice these products rarely reach for them.
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full max-w-3xl border-collapse">
            <thead>
              <tr>
                {["Token", "Tint", "True", "Shade", "Accessible text"].map((h) => (
                  <th key={h} className={cn(typography.tableHeader, "px-3 py-2.5 text-left border-b border-border")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["un-green", "bg-un-green-tint", "bg-un-green", "bg-un-green-shade", "text-un-green-text", "#27833A"],
                ["un-yellow", "bg-un-yellow-tint", "bg-un-yellow", "bg-un-yellow-shade", null, "none — verify contrast"],
                ["un-orange", "bg-un-orange-tint", "bg-un-orange", "bg-un-orange-shade", "text-un-orange-text", "#CF3F0B"],
                ["un-red", "bg-un-red-tint", "bg-un-red", "bg-un-red-shade", "text-un-red-text", "#AB1D37"],
                ["un-purple", "bg-un-purple-tint", "bg-un-purple", "bg-un-purple-shade", "text-un-purple-text", "#733D96"],
                ["un-gray", "bg-un-gray-tint", "bg-un-gray", "bg-un-gray-shade", "text-un-gray-text", "#7C7067"],
              ].map(([name, tint, tru, shade, textCls, textHex]) => (
                <tr key={name as string} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-mono text-[13px]">{name}</td>
                  <td className="px-3 py-3"><span className={cn("block size-7 rounded border border-black/10", tint as string)} /></td>
                  <td className="px-3 py-3"><span className={cn("block size-7 rounded border border-black/10", tru as string)} /></td>
                  <td className="px-3 py-3"><span className={cn("block size-7 rounded border border-black/10", shade as string)} /></td>
                  <td className="px-3 py-3">
                    {textCls ? (
                      <span className={cn("text-sm font-medium", textCls as string)}>{textHex}</span>
                    ) : (
                      <span className={cn(typography.caption)}>{textHex}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="UN80 working palette"
        note="Not from the DGC brand palette — this is ours. The low-chroma set the products reach for when they need categorical grouping: entity groups, secretariat groupings, subject domains. Only the tokens the audit found alive are carried; pale-oyster and the dead half of the block are gone."
      >
        <div className="flex flex-wrap gap-5">
          <Swatch cls="bg-trout" name="trout" hex="#495057" />
          <Swatch cls="bg-shuttle-gray" name="shuttle-gray" hex="#5a6c7d" />
          <Swatch cls="bg-camouflage-green" name="camouflage-green" hex="#7d8471" />
          <Swatch cls="bg-smoky" name="smoky" hex="#6c5b7b" />
          <Swatch cls="bg-au-chico" name="au-chico" hex="#a0665c" />
          <Swatch cls="bg-faded-jade" name="faded-jade" hex="#4a7c7e" />
          <Swatch cls="bg-dusty-gray" name="dusty-gray" hex="#969696" />
        </div>
      </Section>

      <Section
        title="System Chart palette — namespaced reference"
        note="From the UN System Chart PDF: a third source, neither DGC's nor UN80's. Kept here because the pattern is worth stealing — a pale categorical fill paired with a darker keyline of the same hue, which stays legible at tile size and in print. Namespaced so it stops colliding: in its own repo these were called un-red and un-gray, which is why text-un-red there renders terracotta."
      >
        <div className="flex flex-wrap gap-3">
          {/* Class names written out in full — Tailwind scans statically, so a
              class built with string concatenation generates no CSS at all. */}
          {[
            ["yellow", "bg-syschart-yellow", "border-syschart-yellow-dark", "bg-syschart-yellow-dark"],
            ["purple", "bg-syschart-purple", "border-syschart-purple-dark", "bg-syschart-purple-dark"],
            ["green", "bg-syschart-green", "border-syschart-green-dark", "bg-syschart-green-dark"],
            ["red", "bg-syschart-red", "border-syschart-red-dark", "bg-syschart-red-dark"],
            ["blue", "bg-syschart-blue", "border-syschart-blue-dark", "bg-syschart-blue-dark"],
            ["brown", "bg-syschart-brown", "border-syschart-brown-dark", "bg-syschart-brown-dark"],
            ["gray", "bg-syschart-gray", "border-syschart-gray-dark", "bg-syschart-gray-dark"],
          ].map(([name, fill, keylineBorder, keylineFill]) => (
            <div key={name} className="w-32">
              <div className={cn("flex h-16 items-end rounded border-2", fill, keylineBorder)}>
                <span className={cn("m-1 block h-2 w-full rounded-sm", keylineFill)} />
              </div>
              <div className="mt-2 font-mono text-[12px]">syschart-{name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Deliberately absent">
        <ul className="max-w-2xl space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li><strong className="text-foreground">The dead block.</strong> Eight tokens copied into four products — 8/8 unused in un80-actions, 7/8 in housekeeping, 6/7 in system-chart.</li>
          <li><strong className="text-foreground">shadcn&rsquo;s stock chart-1..5.</strong> Shipped unmodified in four products with zero references anywhere.</li>
          <li><strong className="text-foreground">SDG colours.</strong> A separate brand system — the guide says use them only in SDG contexts.</li>
          <li><strong className="text-foreground">A second typeface.</strong> It is Roboto.</li>
        </ul>
      </Section>
    </div>
  ),
};
