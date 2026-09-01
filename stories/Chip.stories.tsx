import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Chip, ChipCount } from "../components/chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "One primitive for every small rounded label. Extracted from mandates, where it replaced 31 hand-rolled implementations — 5 border radii, 6 spellings of the text size, 7 paddings, 11 border treatments, 17 fills, and 17 chips with no focus state at all. Two axes: density (set by the container) and tone (emphasis, not decoration).",
      },
    },
  },
  args: { children: "General Assembly" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-6 border-b border-border py-3 last:border-0">
    <span className="w-32 shrink-0 font-mono text-[12px] text-muted-foreground">{label}</span>
    <span className="flex flex-wrap items-baseline gap-2">{children}</span>
  </div>
);

/** The two axes, crossed. Pick one value from each; never hand-write classes. */
export const Axes: Story = {
  render: () => (
    <div className="max-w-3xl">
      <Row label="tone">
        <Chip tone="neutral">Neutral</Chip>
        <Chip tone="selected">Selected</Chip>
        <Chip tone="ghost">Ghost</Chip>
      </Row>
      <Row label="density">
        <Chip density="dense">dense</Chip>
        <Chip density="comfortable">comfortable</Chip>
        <Chip density="touch">touch</Chip>
      </Row>
      <Row label="with count">
        <Chip>
          Security Council <ChipCount>142</ChipCount>
        </Chip>
        <Chip tone="selected">
          General Assembly <ChipCount>1,284</ChipCount>
        </Chip>
      </Row>
    </div>
  ),
};

/**
 * Interactivity is expressed by ELEMENT, not by styling. A static chip gets no
 * hover, so nothing looks clickable that isn't — and an interactive one is a
 * real `<a>` or `<button>`, so it is keyboard-reachable and has a focus ring.
 * The old shadcn Badge rendered a `<div>`, which is why the most-clicked pill
 * in mandates' table was unreachable by keyboard.
 */
export const Interactivity: Story = {
  render: () => (
    <div className="max-w-3xl">
      <Row label="span (static)">
        <Chip>Not clickable</Chip>
      </Row>
      <Row label="button (onClick)">
        <Chip onClick={() => {}}>Filters in place</Chip>
      </Row>
      <Row label="a (href)">
        <Chip href="#">Navigates</Chip>
      </Row>
    </div>
  ),
};

/**
 * The colour budget. Ground is neutral; exactly one thing earns colour —
 * `selected`, the state of an active facet. The brand guide puts UN Blue,
 * black and white first and reserves accents for differentiating information
 * in charts, so a page full of coloured chips would spend the budget on
 * decoration and stop UN Blue reading as "interactive".
 */
export const ColourBudget: Story = {
  render: () => (
    <div className="max-w-2xl space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium tracking-wider uppercase text-foreground">
          A facet row — one selection
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip tone="selected" onClick={() => {}}>Peace and security</Chip>
          <Chip onClick={() => {}}>Sustainable development</Chip>
          <Chip onClick={() => {}}>Human rights</Chip>
          <Chip onClick={() => {}}>Humanitarian affairs</Chip>
          <Chip onClick={() => {}}>Climate</Chip>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Only the active facet is blue. Everything else is neutral, so the eye
        goes straight to the state that matters.
      </p>
    </div>
  ),
};

/**
 * `truncate` constrains the content, not the chip — text-overflow needs a block
 * container, and a chip is inline-flex, so putting `truncate` on the chip
 * itself clips with no ellipsis. That was a real bug: "Internati", "Gender Equi".
 */
export const Truncation: Story = {
  render: () => (
    <div className="w-56 border border-dashed border-border p-3">
      <Chip density="dense" truncate>
        International Trade and Development Finance
      </Chip>
    </div>
  ),
};
