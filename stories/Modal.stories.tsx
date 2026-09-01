import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Modal } from "../components/modal";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A composition over the Radix dialog primitive. Two audit findings shaped it: system-chart ships a bespoke 739-line modal with no role=dialog, no focus trap and no accessible name; and mandates' older copy has no mobile inset, so it overflows narrow screens. Both are fixed here by default, and `title` is a required prop. Radix isolates the dialog by marking sibling nodes aria-hidden rather than by setting aria-modal.",
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const btn = cn(
  typography.label,
  "inline-flex items-center rounded-md bg-un-blue px-3.5 py-2 text-white transition-colors hover:bg-un-blue-text",
);
const btnGhost = cn(
  typography.label,
  "inline-flex items-center rounded-md border border-border px-3.5 py-2 transition-colors hover:bg-muted",
);

export const Default: Story = {
  args: {
    title: "Change entity",
    description: "Pick the entity whose mandates you want to review.",
    trigger: <button className={btn}>Open modal</button>,
    children: (
      <p className={typography.body}>
        Body content goes here. Tab cycles inside the dialog and Escape closes it — both come
        from the primitive, not from anything this composition had to write.
      </p>
    ),
    footer: (
      <>
        <button className={btnGhost}>Cancel</button>
        <button className={btn}>Save</button>
      </>
    ),
  },
};

/**
 * Narrow viewport. The panel is `max-w-[calc(100%-2rem)]` before it widens at
 * `sm`, so it keeps a gutter — the thing mandates' older copy is missing.
 */
export const NarrowViewport: Story = {
  args: { ...Default.args, title: "Fits a phone" },
  parameters: { viewport: { defaultViewport: "mobile1" } },
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

export const Sizes: Story = {
  args: { title: "placeholder" },
  render: () => (
    <div className="flex gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Modal
          key={size}
          size={size}
          title={`Size: ${size}`}
          description="Widths step at the sm breakpoint; the mobile inset is constant."
          trigger={<button className={btnGhost}>{size}</button>}
        >
          <p className={typography.body}>
            The inset never changes — only the ceiling width does.
          </p>
        </Modal>
      ))}
    </div>
  ),
};

/**
 * A dialog whose title is visually hidden but still announced. This is the
 * case that usually ends up with no accessible name at all — here the title
 * prop is required, so it cannot.
 */
export const HiddenTitle: Story = {
  args: {
    title: "Search mandates",
    hideTitle: true,
    trigger: <button className={btnGhost}>Hidden title</button>,
    children: (
      <input
        type="text"
        placeholder="Search…"
        className="w-full rounded-md border border-border px-3 py-2 text-sm"
      />
    ),
  },
};
