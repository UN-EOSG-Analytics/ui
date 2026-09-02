import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Download, Filter, Plus, Search } from "lucide-react";
import { Button } from "../components/button";

const meta = {
  title: "UI Elements/Button",
  component: Button,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Extracted from transcripts — the newer of the two shadcn generations in the estate, with the fuller size set and the 3px focus ring the audit found repeated 23 times as ring-[3px]. One change from the vendored version: default is UN Blue, not near-black. The brand guide makes UN Blue the accent for everything.",
      },
    },
  },
  args: { children: "Transcribe" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-6 border-b border-border py-3 last:border-0">
    <span className="w-28 shrink-0 font-mono text-[12px] text-muted-foreground">{label}</span>
    <span className="flex flex-wrap items-center gap-2">{children}</span>
  </div>
);

export const Variants: Story = {
  render: () => (
    <div className="max-w-3xl">
      <Row label="default"><Button>Transcribe</Button></Row>
      <Row label="outline"><Button variant="outline">Export</Button></Row>
      <Row label="secondary"><Button variant="secondary">Cancel</Button></Row>
      <Row label="ghost"><Button variant="ghost">Dismiss</Button></Row>
      <Row label="destructive"><Button variant="destructive">Delete</Button></Row>
      <Row label="link"><Button variant="link">View the record</Button></Row>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="max-w-3xl">
      <Row label="xs"><Button size="xs">Extra small</Button></Row>
      <Row label="sm"><Button size="sm">Small</Button></Row>
      <Row label="default"><Button>Default</Button></Row>
      <Row label="lg"><Button size="lg">Large</Button></Row>
      <Row label="icon sizes">
        <Button size="icon-xs" aria-label="Add"><Plus /></Button>
        <Button size="icon-sm" aria-label="Filter"><Filter /></Button>
        <Button size="icon" aria-label="Search"><Search /></Button>
        <Button size="icon-lg" aria-label="Download"><Download /></Button>
      </Row>
    </div>
  ),
};

/** Icons size themselves from the button size — no per-call-site sizing. */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button><Plus />New feed</Button>
      <Button variant="outline"><Download />Export CSV</Button>
      <Button variant="secondary" size="sm"><Filter />Filter</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="max-w-3xl">
      <Row label="default"><Button>Transcribe</Button></Row>
      <Row label="disabled"><Button disabled>Transcribe</Button></Row>
      <Row label="focus ring">
        <Button autoFocus>Tab to me</Button>
        <span className="text-xs text-muted-foreground">
          3px ring — the token, not a per-component value
        </span>
      </Row>
    </div>
  ),
};
