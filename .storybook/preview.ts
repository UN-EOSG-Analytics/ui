import type { Preview } from "@storybook/nextjs-vite";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          "Foundations",
          ["Palette", "Typography"],
          "Concepts",
          "Components",
          ["SiteHeader", "Button", "Chip", "DataTable", "Filtering & Search", "Modal"],
        ],
      },
    },
    backgrounds: { disable: true },
  },
};

export default preview;
