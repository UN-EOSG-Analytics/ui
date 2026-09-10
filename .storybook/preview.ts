import type { Preview } from "@storybook/nextjs-vite";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          "Overview",
          "Foundations",
          ["Palette", "Typography"],
          // Relational: a domain thing mapped to a visual.
          "Concepts",
          ["Overview", "PointMeter"],
          // Shared page chrome and structural furniture.
          "Page Structure",
          ["SiteHeader", "SecondaryHeader", "DetailPanel", "SiteFooter", "AnimatedCornerLogo"],
          // The UI kit itself.
          "UI Elements",
          [
            "Button", "Chip", "StatTile", "DataTable", "GroupedTreemap", "Filtering & Search",
            "Modal", "SignInCard",
          ],
          // Product-specific catalogues follow the shared design system.
          "open.un.org",
          ["Tokens", ["Funding sources"]],
        ],
      },
    },
    backgrounds: { disable: true },
  },
};

export default preview;
