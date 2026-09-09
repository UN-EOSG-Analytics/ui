import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import {
  openFundingTokens,
  secretariatFundingCrosswalk,
} from "./openFundingTokenData";

const meta: Meta = {
  title: "open.un.org/Tokens/Funding sources",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

interface TokenSwatchProps {
  token: (typeof openFundingTokens)[number];
}

function TokenSwatch({ token }: TokenSwatchProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <div className={cn("h-28 border-b border-black/10", token.className)} />
      <div className="space-y-2 p-5">
        <h3 className={typography.cardTitle}>{token.label}</h3>
        <p className="min-h-10 text-sm leading-relaxed text-muted-foreground">
          {token.explanation}
        </p>
        <dl className="space-y-1 border-t border-border pt-3 font-mono text-xs">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Token</dt>
            <dd className="text-end text-foreground">{token.token}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Primary alias</dt>
            <dd className="text-end text-foreground">{token.alias}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export const Catalogue: Story = {
  render: () => (
    <main className="mx-auto max-w-6xl p-10">
      <header className="mb-10 max-w-3xl">
        <p className={cn(typography.eyebrow, "mb-2 text-un-blue-text")}>
          open.un.org
        </p>
        <h1 className={cn(typography.pageTitle, "mb-3")}>Funding source colours</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          A semantic blue ramp for financing categories in the UN Transparency
          Portal. Category labels and explanations follow the portal&rsquo;s source
          taxonomies; each funding token aliases an existing primary-palette token.
        </p>
      </header>

      <section className="mb-14">
        <h2 className={cn(typography.sectionTitle, "mb-2")}>
          UN system financial statistics
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Four categories are reported in the CEB data. The aliases below map
          them onto the shared UN Blue ramp in darkest-to-lightest order; use
          the funding token at call sites so the domain meaning stays explicit.
          The scale starts at UN Blue Shade and stops at UN Blue Tint, avoiding
          the weak distinction between the two pale tint tokens.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {openFundingTokens.map((token) => (
            <TokenSwatch key={token.key} token={token} />
          ))}
        </div>
      </section>

      <section>
        <h2 className={cn(typography.sectionTitle, "mb-2")}>
          UN Secretariat crosswalk
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This crosswalk maps Secretariat categories to the closest system-wide
          financing token. Regular and other assessed funding share one assessed colour;
          extrabudgetary funding maps to voluntary earmarked because it is
          purpose-restricted rather than entity-wide core funding.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="grid min-w-3xl grid-cols-[3rem_minmax(11rem,1fr)_minmax(12rem,1fr)_minmax(16rem,2fr)] gap-4 border-b border-border bg-muted px-5 py-3">
            <span aria-hidden="true" />
            <span className={typography.tableHeader}>Secretariat label</span>
            <span className={typography.tableHeader}>Maps to</span>
            <span className={typography.tableHeader}>Explanation</span>
          </div>
          {secretariatFundingCrosswalk.map((source) => (
            <div
              className="grid min-w-3xl grid-cols-[3rem_minmax(11rem,1fr)_minmax(12rem,1fr)_minmax(16rem,2fr)] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
              key={source.label}
            >
              <span
                aria-hidden="true"
                className={cn("block size-9 rounded border border-black/10", source.className)}
              />
              <div>
                <div className="text-sm font-medium text-foreground">{source.label}</div>
                <code className="text-xs text-muted-foreground">{source.token}</code>
              </div>
              <div className="text-sm font-medium text-foreground">{source.mapsTo}</div>
              <div className="text-sm leading-relaxed text-muted-foreground">
                {source.explanation}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};
