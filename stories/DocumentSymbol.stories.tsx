import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentSymbol } from "../components/document-symbol";

const meta = {
  title: "Concepts/DocumentSymbol",
  component: DocumentSymbol,
  args: { children: "A/RES/79/1" },
  parameters: {
    docs: {
      description: {
        component:
          "The current Mandates document identifier: light blue, proportional type, distinct from filter chips. Also exported from concepts for existing consumers.",
      },
    },
  },
} satisfies Meta<typeof DocumentSymbol>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Linked: Story = {
  args: {
    href: "https://docs.un.org/en/A/RES/79/1",
    title: "Pact for the Future",
  },
};
export const Subdued: Story = { args: { subdued: true } };
export const French: Story = {
  args: {
    href: "https://docs.un.org/fr/A/RES/79/1",
    title: "Pacte pour l’avenir",
    "aria-label": "Document A/RES/79/1",
  },
  decorators: [
    (Story) => (
      <div lang="fr">
        <Story />
      </div>
    ),
  ],
};
export const Arabic: Story = {
  args: {
    href: "https://docs.un.org/ar/A/RES/79/1",
    "aria-label": "الوثيقة A/RES/79/1",
  },
  decorators: [
    (Story) => (
      <div lang="ar" dir="rtl">
        <Story />
      </div>
    ),
  ],
};
