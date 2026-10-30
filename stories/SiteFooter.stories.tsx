import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteFooter } from "../components/site-footer";
import { getFooterLabels } from "../lib/footer-labels";
const meta = {
  title: "Page Structure/SiteFooter",
  component: SiteFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Official footer copy is stored centrally for all six UN languages. Supply locale; labels are optional for exceptional overrides. Arabic sets RTL direction automatically.",
      },
    },
  },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const English: Story = { args: { locale: "en" } };
export const French: Story = { args: { locale: "fr" } };
export const Spanish: Story = { args: { locale: "es" } };
export const Arabic: Story = { args: { locale: "ar" } };
export const Russian: Story = { args: { locale: "ru" } };
export const Chinese: Story = { args: { locale: "zh" } };
export const WithExtraLink: Story = {
  args: {
    locale: "en",
    extraLinks: [{ label: "llms.txt", href: "/llms.txt" }],
  },
};
export const CustomLabels: Story = {
  args: {
    locale: "en",
    labels: {
      ...getFooterLabels("en"),
      linksNavigation: "Official United Nations resources",
    },
  },
};
export const UnknownLocale: Story = { args: { locale: "xx" } };
