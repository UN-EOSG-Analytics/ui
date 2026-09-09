import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { openSystemCategoryTokens } from "./openSystemCategoryTokenData";

const meta: Meta = {
  title: "open.un.org/Tokens/System categories",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const Catalogue: Story = {
  render: () => (
    <main className="mx-auto max-w-6xl p-10">
      <header className="mb-10 max-w-3xl">
        <p className={cn(typography.eyebrow, "mb-2 text-un-blue-text")}>
          open.un.org
        </p>
        <h1 className={cn(typography.pageTitle, "mb-3")}>
          UN System category colours
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Semantic aliases for the organization groupings shown in the UN
          Transparency Portal. Entity categories use the UN accent palette;
          product code uses the semantic token names below.
        </p>
      </header>

      <section className="mb-12">
        <h2 className={cn(typography.sectionTitle, "mb-2")}>
          Category mapping
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          UN Secretariat-administered uses UN blue, Funds and Programmes UN
          green, Specialized Agencies UN yellow, Related Organizations UN
          orange, Other Entities UN red, and Research and Training UN purple.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {openSystemCategoryTokens
            .filter((token) => token.key !== "neutral")
            .map((token) => (
              <article
                className="overflow-hidden rounded-lg border border-border bg-card"
                key={token.key}
              >
                <div
                  className={cn(
                    "h-24 border-b border-black/10",
                    token.className,
                  )}
                />
                <div className="space-y-3 p-5">
                  <h3 className={typography.subTitle}>{token.label}</h3>
                  <dl className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Token</dt>
                      <dd className="text-end text-foreground">{token.token}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Alias</dt>
                      <dd className="text-end text-foreground">{token.alias}</dd>
                    </div>
                  </dl>
                  <p className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                    Maps: {token.maps.join("; ")}
                  </p>
                </div>
              </article>
            ))}
        </div>
      </section>

      <section>
        <h2 className={cn(typography.sectionTitle, "mb-2")}>
          Temporary neutral fallback
        </h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The remaining taxonomy values stay explicit and visible while their
          entities are reassigned. Unknown future values use the same fallback,
          so no category silently acquires an unrelated colour.
        </p>
        {openSystemCategoryTokens
          .filter((token) => token.key === "neutral")
          .map((token) => (
            <div
              className="grid max-w-3xl overflow-hidden rounded-lg border border-border sm:grid-cols-[10rem_1fr]"
              key={token.key}
            >
              <div className={cn("min-h-32", token.className)} />
              <div className="space-y-3 p-5">
                <h3 className={typography.subTitle}>{token.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {token.maps.join("; ")}
                </p>
                <p className="font-mono text-xs text-foreground">
                  {token.token} → {token.alias}
                </p>
              </div>
            </div>
          ))}
      </section>
    </main>
  ),
};
