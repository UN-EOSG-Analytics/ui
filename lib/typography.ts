/**
 * Semantic typography scale — the single source of truth for text size/weight.
 *
 * Compose with `cn()`, e.g. `cn(typography.sectionTitle, "mb-3")`.
 * New text should use a tier here rather than raw `text-*`/`font-*` utilities.
 *
 * Extracted from `transcripts/lib/typography.ts`, the only semantic scale that
 * existed across the six audited products — and one of the two whose UI has had
 * the closest review. The tiers below are its tiers; what is new is the `micro`
 * pair and the ceiling rule.
 *
 * ---------------------------------------------------------------------------
 * THE PRINCIPLE: a low display ceiling.
 *
 * The two reviewed products reach for sizes above `text-xl` in 2.0% and 0.7% of
 * all size utilities. The other four run 3.2–9.4%, one of them topping out at
 * `text-6xl`. The reviewed products carry hierarchy through WEIGHT and COLOUR,
 * not size jumps — and they read as the more polished ones.
 *
 * So `pageTitle` is the ceiling, and it is for a page's single hero. Anything
 * bigger should need an argument.
 * ---------------------------------------------------------------------------
 *
 * A tier is not just a size. Each one bundles size + weight + capitalization +
 * tracking + colour, because those travel together — `tableHeader` is 12px AND
 * medium AND uppercase AND tracked AND muted, and splitting them is how six
 * products ended up with four different header treatments. Set a tier, not a
 * pile of utilities.
 *
 * Sizes stay on Tailwind's 4pt scale. Arbitrary `text-[Npx]` values are a lint
 * target, not a tier — with one exception, `micro`, which exists precisely
 * because all six products independently invented it (127 uses of 9/10/11px)
 * and it deserved a name instead of a private convention in each repo.
 */
export const typography = {
  /** Page hero. One per page. The ceiling — see the principle above. */
  pageTitle: "text-4xl font-bold tracking-tight text-foreground",
  /** Standalone card titles — error pages, login, empty states. */
  cardTitle: "text-2xl font-semibold text-foreground",
  /** Primary content title and peer section headings. The workhorse heading. */
  sectionTitle: "text-xl font-semibold tracking-tight text-foreground",
  /** Sub-section / step titles. */
  subTitle: "text-base font-semibold text-foreground",
  /** Intro or lead paragraph sitting under a title. */
  lead: "text-lg text-foreground",
  /** Default body / paragraph text. */
  body: "text-sm leading-relaxed",
  /** Long-form prose pages (about, methodology). */
  prose: "text-base leading-relaxed text-foreground",
  /** Metadata rows — date, category, duration, counts. */
  meta: "text-sm text-muted-foreground",
  /** Small captions, timestamps, back-links. */
  caption: "text-xs text-muted-foreground",
  /** Inline form/control labels, button text, badge text. */
  label: "text-xs font-medium",
  /**
   * Eyebrow / overline — the small uppercase label above a heading or section.
   * Same case-and-tracking treatment as `tableHeader`, but it sits in prose
   * rather than a table, so it keeps the foreground colour.
   */
  eyebrow: "text-xs font-medium tracking-wider uppercase text-foreground",
  /**
   * Table column headers.
   *
   * Resolves the audit's clearest accidental divergence: transcripts and
   * mandates express this same design, but mandates hardcodes `text-gray-500`
   * instead of the semantic token — and housekeeping ships two different
   * treatments inside one codebase.
   */
  tableHeader:
    "text-xs font-medium tracking-wider text-muted-foreground uppercase",
  /**
   * Numeric cells and any figure that lines up in a column. Tabular figures
   * are not optional once digits stack vertically.
   */
  numeric: "text-sm tabular-nums",
  /**
   * The micro tier — 10px. Badges, dense table meta, chip labels.
   * Named so it stops being an arbitrary value in six separate repos.
   * Do not go below this: 9px failed legibility review.
   */
  micro: "text-micro font-medium",
} as const;

export type TypographyTier = keyof typeof typography;
