import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  EntityRef, DocumentSymbol, BudgetFigure, Count,
} from "../components/concepts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/data-table";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

const meta = {
  title: "Concepts/Overview",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The layer above the primitives. A primitive knows how a pill is drawn; a concept knows what an entity looks like — and that is where consistency actually lives, because the domain concepts recur far more than the widgets do.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const LAYERS = [
  { layer: "Tokens", what: "colour · type · spacing · emblem geometry", ex: "un-blue, text-micro" },
  { layer: "Primitives", what: "how a control is drawn", ex: "Chip, Button, Table, Modal" },
  { layer: "Concepts", what: "what a domain thing looks like", ex: "EntityRef, DocumentSymbol, BudgetFigure" },
  { layer: "Products", what: "pages that compose them", ex: "mandates, housekeeping, system-chart, open" },
];

export const InheritanceFlow: Story = {
  name: "Inheritance flow",
  render: () => (
    <div className="p-10">
      <h1 className={cn(typography.pageTitle, "mb-2")}>Concepts</h1>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-foreground">
        These products share a domain, not just a stack. “Entity”, “document
        symbol”, “budget”, “count” recur in every one of them — far more often
        than any particular widget does. So the system encodes concepts, and the
        widgets fall out of that.
      </p>

      <div className="mb-12 max-w-3xl">
        {LAYERS.map((l, i) => (
          <div key={l.layer} className="relative">
            <div
              className={cn(
                "rounded-md border p-4",
                i === 2 ? "border-un-blue bg-un-blue-tint-50" : "border-border bg-background",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className={typography.subTitle}>{l.layer}</span>
                <span className={typography.caption}>{l.what}</span>
              </div>
              <div className={cn(typography.meta, "mt-1 font-mono text-[12px]")}>{l.ex}</div>
            </div>
            {i < LAYERS.length - 1 && (
              <div aria-hidden className="mx-auto h-4 w-px bg-border" />
            )}
          </div>
        ))}
      </div>

      <div className="mb-12 max-w-2xl border-s-2 border-un-blue ps-5">
        <h2 className={cn(typography.sectionTitle, "mb-2")}>Why this is the layer that saves time</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Asked to “show the entity”, an agent reaches for{" "}
          <code className="font-mono text-xs">&lt;EntityRef&gt;</code> instead of
          re-deciding acronym vs full name, chip vs text, and which grey. The
          decision was made once. That is also why the estate drifted: the
          concept recurred in four products and the decision was re-made in each.
        </p>
      </div>

      <h2 className={cn(typography.sectionTitle, "mb-4")}>Entity</h2>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Always an acronym plus a long name. The acronym is the identifier, the
        long name the gloss — every product stores both and then disagrees about
        which to show where.
      </p>
      <div className="mb-10 space-y-4">
        <div className="flex flex-wrap items-baseline gap-6 border-b border-border pb-3">
          <span className="w-24 font-mono text-[12px] text-muted-foreground">chip</span>
          <span className="flex flex-wrap gap-2">
            <EntityRef acronym="UNDP" name="United Nations Development Programme" onClick={() => {}} />
            <EntityRef acronym="OCHA" name="Office for the Coordination of Humanitarian Affairs" onClick={() => {}} />
            <EntityRef acronym="DPPA" name="Department of Political and Peacebuilding Affairs" selected onClick={() => {}} />
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-6 border-b border-border pb-3">
          <span className="w-24 font-mono text-[12px] text-muted-foreground">inline</span>
          <p className={cn(typography.body, "max-w-lg")}>
            The report was prepared by{" "}
            <EntityRef variant="inline" acronym="DESA" name="Department of Economic and Social Affairs" />{" "}
            in consultation with{" "}
            <EntityRef variant="inline" acronym="UNCTAD" name="UN Conference on Trade and Development" />.
            A pill would break the line; an abbreviation does not.
          </p>
        </div>
        <div className="flex flex-wrap items-baseline gap-6">
          <span className="w-24 font-mono text-[12px] text-muted-foreground">block</span>
          <EntityRef variant="block" acronym="UNEP" name="United Nations Environment Programme" />
        </div>
      </div>

      <h2 className={cn(typography.sectionTitle, "mb-4")}>Document symbol</h2>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Deliberately <strong className="text-foreground">not</strong> a chip. A symbol is the
        document&rsquo;s identifier, not a facet you filter by — square corners, blue
        ground, monospaced. Scanning a list you can tell “this <em>is</em> the
        document” from “this is something <em>about</em> the document” without
        reading either.
      </p>
      <div className="mb-10 flex flex-wrap items-center gap-2">
        <DocumentSymbol href="#">A/RES/79/1</DocumentSymbol>
        <DocumentSymbol href="#">S/RES/2735</DocumentSymbol>
        <DocumentSymbol subdued>A/78/6 (Sect. 1)</DocumentSymbol>
        <span className={typography.caption}>subdued = the document you are already on</span>
      </div>

      <h2 className={cn(typography.sectionTitle, "mb-4")}>Budget &amp; count</h2>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        <code className="font-mono text-xs">open</code> alone reimplements{" "}
        <code className="font-mono text-xs">Intl.NumberFormat</code> in six places.
        Currency formatting is a concept, not a call-site decision — and a count
        has to pluralise, which is the most visible small bug there is.
      </p>
      <div className="mb-10 max-w-lg space-y-2">
        <div className="flex justify-between border-b border-border py-2">
          <span className={typography.body}>Standard</span>
          <BudgetFigure amount={3592184000} className={typography.body} />
        </div>
        <div className="flex justify-between border-b border-border py-2">
          <span className={typography.body}>Compact (hover for exact)</span>
          <BudgetFigure amount={3592184000} compact className={typography.body} />
        </div>
        <div className="flex justify-between border-b border-border py-2">
          <span className={typography.body}>Count — plural</span>
          <Count value={1284} singular="mandate" className={typography.body} />
        </div>
        <div className="flex justify-between py-2">
          <span className={typography.body}>Count — singular</span>
          <Count value={1} singular="mandate" className={typography.body} />
        </div>
      </div>

      <h2 className={cn(typography.sectionTitle, "mb-4")}>Assembled</h2>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        One row of a mandates table, built entirely from concepts — no ad-hoc
        styling at the call site.
      </p>
      <div className="max-w-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Lead entity</TableHead>
              <TableHead>Mandates</TableHead>
              <TableHead numeric>Appropriation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["A/RES/79/1", "DPPA", "Department of Political and Peacebuilding Affairs", 42, 728400000],
              ["A/RES/78/12", "OCHA", "Office for the Coordination of Humanitarian Affairs", 27, 415900000],
              ["A/RES/77/45", "UNEP", "United Nations Environment Programme", 1, 96250000],
            ].map(([sym, ac, nm, n, amt]) => (
              <TableRow key={sym as string}>
                <TableCell><DocumentSymbol href="#">{sym}</DocumentSymbol></TableCell>
                <TableCell><EntityRef acronym={ac as string} name={nm as string} onClick={() => {}} /></TableCell>
                <TableCell><Count value={n as number} singular="mandate" /></TableCell>
                <TableCell numeric><BudgetFigure amount={amt as number} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};
