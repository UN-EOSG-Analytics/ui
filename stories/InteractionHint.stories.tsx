import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InteractionHint } from "../components/interaction-hint";

const meta = {
  title: "UI Elements/Interaction hint",
  component: InteractionHint,
  parameters: { layout: "padded" },
  args: { text: "Click on an organization to explore details" },
} satisfies Meta<typeof InteractionHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
