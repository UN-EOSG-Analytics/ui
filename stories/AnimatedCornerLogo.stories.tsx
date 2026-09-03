import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedCornerLogo } from "../components/animated-corner-logo";

const src = `${import.meta.env.BASE_URL}images/un-two-zero-corner.svg`.replace(
  "//images",
  "/images",
);

const meta = {
  title: "Page Structure/AnimatedCornerLogo",
  component: AnimatedCornerLogo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The UN 2.0 corner mark, in four products. Two of them keep the keyframes in globals.css where they are dead weight on every page; this scopes them to the component. It also honours prefers-reduced-motion itself rather than relying on the host app's globals — a slide-and-spin entrance is exactly what that preference is for.",
      },
    },
  },
  args: { label: "UN 2.0", src },
} satisfies Meta<typeof AnimatedCornerLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Reload the story to replay the entrance — corner at 1.5s, roundel at 2.5s. */
export const Default: Story = {
  render: (args) => (
    <div className="relative h-96">
      <p className="p-6 text-sm text-muted-foreground">
        The mark slides into the bottom-left corner after the page settles.
        Reload to replay.
      </p>
      <AnimatedCornerLogo {...args} />
    </div>
  ),
};

/** Faster, for reviewing the motion without waiting. */
export const Immediate: Story = {
  args: { delays: { corner: 0, roundel: 200 } },
  render: (args) => (
    <div className="relative h-96">
      <AnimatedCornerLogo {...args} />
    </div>
  ),
};
