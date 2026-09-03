import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Maximize2, Share2, X } from "lucide-react";
import { DetailPanel, DetailHeader, DetailSection } from "../components/detail-panel";
import { DetailPanelControls } from "../components/detail-panel-controls";
import { Chip } from "../components/chip";
import { DocumentSymbol, EntityRef } from "../components/concepts";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

const meta = {
  title: "Page Structure/DetailPanel",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The record view that opens when a row is clicked — the estate's most reused workflow (mandates, open, system-chart, un80-actions). The section headings are settled editorial content, so the hierarchy comes from space, weight and colour rather than from shortening them. Owns the shell structure and the type hierarchy; routing and dismissal stay with the product.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const ENTITIES = ["DESA","DGC","DOS","DPO","DPPA","ECA","ECE","ECLAC","ESCAP","ESCWA","ITC","OCHA"];
const SUBJECTS = ["Artificial Intelligence","Declarations (Text)","Development Finance","Digital Divide","Digital Technology","Governance","International Cooperation","International Security","Multilateralism","Organizational Reform","Sustainable Development","Youth"];

/** The panel content — identical wording in both columns below. */
function Body() {
  return (
    <>
      <DetailHeader>
        <DocumentSymbol href="#">A/RES/79/1</DocumentSymbol>
        <Chip density="dense">Resolution</Chip>
        <Chip density="dense">General Assembly</Chip>
        <Chip density="dense">2024</Chip>
      </DetailHeader>

      <DetailSection heading="Who adopted this document and its mandates?">
        A <Chip density="dense">Resolution</Chip> of the{" "}
        <Chip density="dense">General Assembly</Chip>, under agenda item{" "}
        <Chip density="dense">123a · Strengthening of the United Nations System</Chip>,
        published in <Chip density="dense">2024</Chip>.
      </DetailSection>

      <DetailSection heading="Who cites this mandate in the budget?" hint="27 entities">
        <div className="flex flex-wrap gap-1.5">
          {ENTITIES.map((e) => <EntityRef key={e} acronym={e} density="dense" />)}
          <Chip density="dense" tone="ghost" onClick={() => {}}>Show all 27</Chip>
        </div>
        <p className={cn(typography.caption, "mt-3")}>
          Extracted automatically from each entity’s budget submission.
        </p>
      </DetailSection>

      <DetailSection heading="What subjects does this mandate have?" hint="12 subjects">
        <div className="flex flex-wrap gap-1.5">
          {SUBJECTS.map((s) => <Chip key={s} density="dense">{s}</Chip>)}
        </div>
      </DetailSection>

      <DetailSection heading="Which reports were submitted under this mandate?" hint="1 report · 2025">
        <div className="flex items-baseline gap-3">
          <span className={cn(typography.numeric, "text-muted-foreground")}>2025</span>
          <DocumentSymbol href="#">A/79/966</DocumentSymbol>
          <span className="min-w-0 truncate">
            Innovative voluntary financing options for artificial intelligence capacity-building
          </span>
        </div>
        <p className={cn(typography.caption, "mt-3")}>
          Identified automatically from the metadata in each report’s UN Digital Library record.
        </p>
      </DetailSection>
    </>
  );
}

/**
 * Styling only — the questions are unchanged. What moves is the title (out of
 * the scroll area), the spacing (pt-8 + a hairline per section), the hint
 * (inline against its heading rather than flung to the far edge), and the
 * greys (tokens instead of four hardcoded steps).
 */
export const Restyled: Story = {
  name: "Restyled — same content",
  render: () => (
    <div className="h-screen w-full max-w-3xl border-s border-border">
      <DetailPanel
        eyebrow="Mandate document"
        title="The Pact for the Future"
        controls={
          <DetailPanelControls
            share={{
              label: "Share",
              onClick: () => {},
              icon: <Share2 className="size-4" />,
            }}
            expand={{
              label: "Open full page",
              onClick: () => {},
              icon: <Maximize2 className="size-4" />,
            }}
            close={{
              label: "Close",
              onClick: () => {},
              icon: <X className="size-4" />,
            }}
          />
        }
      >
        <Body />
      </DetailPanel>
    </div>
  ),
};

/** What changes, and why — for review. */
export const WhatChanged: Story = {
  name: "What changed",
  render: () => (
    <div className="max-w-2xl p-8">
      <h1 className={cn(typography.pageTitle, "mb-6")}>Detail panel — styling changes</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["", "Today", "Proposed"].map((h) => (
              <th key={h} className={cn(typography.tableHeader, "border-b border-border px-3 py-2.5 text-left")}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Record title", "In the scroll area — gone once you scroll. Header bar holds only buttons.", "In the header, always visible. Body is the only thing that scrolls."],
            ["Title size", "text-xl → 2xl (20–24px), competing with the questions", "20px. A panel is not a page."],
            ["Section heading", "16px semibold, no separation", "16px semibold, pt-8 and a hairline above each"],
            ["Hint / count", "Inline but same line-length as the heading", "Inline, caption size, muted — belongs to the heading"],
            ["Body", "14px", "14px — a real 16 → 14 step now that spacing carries the break"],
            ["Smallest text", "10px in three child components", "12px floor (caption)"],
            ["Greys", "gray-900 / 700 / 600 / 500, hardcoded", "foreground / muted-foreground tokens"],
            ["Controls", "Flush to the edge — focus ring clipped", "pe-1 reserves room for the ring"],
          ].map(([what, before, after]) => (
            <tr key={what as string} className="border-b border-border last:border-0">
              <td className={cn(typography.eyebrow, "px-3 py-3 align-top whitespace-nowrap")}>{what}</td>
              <td className={cn(typography.body, "px-3 py-3 align-top text-muted-foreground")}>{before}</td>
              <td className={cn(typography.body, "px-3 py-3 align-top")}>{after}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={cn(typography.caption, "mt-5")}>
        The section headings themselves are unchanged — they are settled editorial
        content. The hierarchy comes from space, weight and colour.
      </p>
    </div>
  ),
};
