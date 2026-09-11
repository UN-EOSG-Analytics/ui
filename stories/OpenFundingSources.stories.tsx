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
  label: string;
  className: string;
  token: string;
  explanation: string;
  alias?: string;
  mapsTo?: string;
}

function TokenSwatch({
  label,
  className,
  token,
  explanation,
  alias,
  mapsTo,
}: TokenSwatchProps) {
  return (
    <article className="w-44 space-y-2">
      <div
        aria-hidden="true"
        className={cn("h-16 rounded border border-black/10", className)}
      />
      <h3 className={cn(typography.caption, "font-semibold")}>{label}</h3>
      <p
        className={cn(
          typography.caption,
          "leading-relaxed text-muted-foreground",
        )}
      >
        {explanation}
      </p>
      <dl className={cn(typography.caption, "space-y-1 text-muted-foreground")}>
        <div>
          <dt>Token</dt>
          <dd className="break-words text-foreground">{token}</dd>
        </div>
        {alias && (
          <div>
            <dt>Primary alias</dt>
            <dd className="break-words text-foreground">{alias}</dd>
          </div>
        )}
        {mapsTo && (
          <div>
            <dt>Maps to</dt>
            <dd className="text-foreground">{mapsTo}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

export const Catalogue: Story = {
  render: () => (
    <main className="mx-auto max-w-6xl p-10">
      <header className="mb-8 max-w-3xl">
        <p className={cn(typography.eyebrow, "mb-2 text-un-blue-text")}>
          open.un.org
        </p>
        <h1 className={cn(typography.pageTitle, "mb-3")}>
          Funding source colours
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A semantic blue ramp for financing categories in the UN Transparency
          Portal. Category labels and explanations follow the portal&rsquo;s
          source taxonomies; each funding token aliases an existing
          primary-palette token.
        </p>
      </header>

      <section className="mb-10">
        <h2 className={cn(typography.sectionTitle, "mb-2")}>
          UN system financial statistics
        </h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Four categories are reported in the CEB data. The aliases below map
          them onto the shared UN Blue ramp in darkest-to-lightest order; use
          the funding token at call sites so the domain meaning stays explicit.
          The scale starts at UN Blue Shade and stops at UN Blue Tint, avoiding
          the weak distinction between the two pale tint tokens.
        </p>
        <div className="flex flex-wrap gap-5">
          {openFundingTokens.map(({ key, ...token }) => (
            <TokenSwatch key={key} {...token} />
          ))}
        </div>
      </section>

      <section>
        <h2 className={cn(typography.sectionTitle, "mb-2")}>
          UN Secretariat crosswalk
        </h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This crosswalk maps Secretariat categories to the closest system-wide
          financing token. Regular and other assessed funding share one assessed
          colour; extrabudgetary funding maps to voluntary earmarked because it
          is purpose-restricted rather than entity-wide core funding.
        </p>
        <div className="flex flex-wrap gap-5">
          {secretariatFundingCrosswalk.map(({ key, ...source }) => (
            <TokenSwatch key={key} {...source} />
          ))}
        </div>
      </section>
    </main>
  ),
};
