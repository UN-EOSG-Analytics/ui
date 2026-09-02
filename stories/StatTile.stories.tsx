import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Building, FileText, Landmark } from "lucide-react";
import { StatTile } from "../components/stat-tile";

const meta = {
  title: "UI Elements/StatTile",
  component: StatTile,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A headline figure with its label. Extracted from mandates' HeaderStats — stat tiles recur across the data-heavy products and each had rebuilt them. Label in UN Blue at body size, value large, bold and tabular so a column of tiles lines up. Renders a button when given onClick, a div otherwise, so nothing looks interactive that isn't.",
      },
    },
  },
  args: { label: "Documents", value: 4821 },
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = { args: { icon: FileText } };

export const Interactive: Story = {
  args: { icon: Landmark, label: "Mandating bodies", value: 34, onClick: () => {} },
};

/** Stacked, as mandates uses them. Tabular figures keep the values aligned. */
export const Column: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <StatTile icon={FileText} label="Documents" value={4821} onClick={() => {}} />
      <StatTile icon={Landmark} label="Mandating bodies" value={34} onClick={() => {}} />
      <StatTile icon={Building} label="Entities" value={412} onClick={() => {}} />
    </div>
  ),
};

export const Row: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <div className="w-64"><StatTile icon={FileText} label="Documents" value={4821} /></div>
      <div className="w-64"><StatTile icon={Landmark} label="Mandating bodies" value={34} /></div>
      <div className="w-64"><StatTile icon={Building} label="Entities" value={412} /></div>
    </div>
  ),
};
