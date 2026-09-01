import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * GitHub project Pages serve from `https://<org>.github.io/<repo>/`, but Vite
 * defaults its base to `/`, so every asset and chunk would 404. The deploy
 * workflow sets STORYBOOK_BASE_PATH; locally it is unset and the base stays
 * `/`, which is what `storybook dev` needs.
 */
const basePath = process.env.STORYBOOK_BASE_PATH ?? "/";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/nextjs-vite", options: {} },
  staticDirs: ["../public"],
  async viteFinal(config, { configType }) {
    if (configType === "PRODUCTION") {
      config.base = basePath;
    }
    return config;
  },
};

export default config;
