import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { X } from "lucide-react";
import { DetailPanel } from "../components/detail-panel";
import { DetailPanelControls } from "../components/detail-panel-controls";
import { DetailPanelExpansion } from "../components/detail-panel-expansion";

const meta = {
  title: "Page Structure/DetailPanelExpansion",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const ResizeInPlace: Story = {
  render: () => (
    <DetailPanelExpansion>
      {({ style }) => (
        <div
          className="ms-auto h-dvh w-full border-s border-border bg-background sm:w-lg"
          style={style}
        >
          <DetailPanel
            title="Organization details"
            controls={
              <DetailPanelControls
                resize={{
                  expandLabel: "Expand to full width",
                  collapseLabel: "Restore sidebar width",
                }}
                close={{
                  label: "Close details",
                  onClick: () => {},
                  icon: <X aria-hidden className="size-4" />,
                }}
              />
            }
          >
            Expand this panel to the available width, then restore its original
            width.
          </DetailPanel>
        </div>
      )}
    </DetailPanelExpansion>
  ),
};
