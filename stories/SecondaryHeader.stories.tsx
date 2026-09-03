import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecondaryHeader } from "../components/secondary-header";

const items = [
  { href: "#overview", label: "Overview" },
  { href: "#contributors", label: "Contributors" },
  { href: "#programme-budget", label: "Programme Budget" },
  { href: "#field-missions", label: "Field Missions" },
];

const meta = {
  title: "Page Structure/SecondaryHeader",
  component: SecondaryHeader,
  parameters: { layout: "fullscreen" },
  args: {
    items,
    label: "Section navigation",
    activeHref: "#contributors",
  },
} satisfies Meta<typeof SecondaryHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The low-transparency treatment used by the Transparency Portal. */
export const Default: Story = {};

export const Opaque: Story = { args: { transparency: "none" } };

export const HighTransparency: Story = {
  args: { transparency: "high" },
};
