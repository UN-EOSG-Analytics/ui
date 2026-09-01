# @un-eosg/ui

Design tokens, a type scale and shared components for the EOSG / UN80 data-team
products.

Scope is deliberately narrow: **UN80 / UN 2.0 / EOSG products.** DGC owns the UN
visual identity — nothing here reaches their web work.

```bash
pnpm install
pnpm storybook      # the workshop → http://localhost:6006
```

## What this is

Four layers. Each one only knows about the one above it.

| Layer | Knows | Examples |
| --- | --- | --- |
| **Tokens** | colour, type, spacing, emblem geometry | `un-blue`, `text-micro` |
| **Primitives** | how a control is drawn | `Chip`, `Button`, `Table`, `Modal` |
| **Concepts** | what a domain thing looks like | `EntityRef`, `DocumentSymbol`, `BudgetFigure` |
| **Products** | pages that compose them | mandates, housekeeping, system-chart, open |

The concept layer is the one that matters most. These products share a *domain*,
not just a stack — "entity", "document symbol", "budget", "count" recur in all of
them, far more often than any particular widget does. The audit found "entity"
rendered in four products, four different ways.

## Adopting it

Tokens are a versioned dependency, because a copy rots — the audit found one
eight-token palette block copied into four products and then dying differently in
each:

```css
/* your globals.css */
@import "tailwindcss";
@import "@un-eosg/ui/theme.css";
```

That is the same mechanism every product already runs for `tw-animate-css`, so it
introduces nothing new.

Components are copy-in, via the shadcn registry — matching how the team already
treats primitives: vendored, unedited, upgradable.

```bash
pnpm dlx shadcn add UN-EOSG-Analytics/ui/site-header
```

## Where the values come from

Nothing here is invented.

- `docs/un_brand_quick_guide.pdf` — UN Blue / 100% Black / 100% White, Roboto
- `docs/un_brand_colour_palette.pdf` — true values, tints, shades, accessible text
- [`AUDIT.md`](./AUDIT.md) — what the six products actually converged on, and what
  they only appeared to

Tokens the audit found dead or repo-specific were deliberately left out, and
`tokens/theme.css` says why inline so they don't come back by reflex.

## For agents

[`AGENTS.md`](./AGENTS.md) carries the rules as good/bad code pairs — examples
work better than adjectives. `scripts/check-drift.mjs` is the detector:

```bash
node scripts/check-drift.mjs <app-dir> --css <built.css>
```

It catches typo'd class names that generate no CSS, raw hex in TSX, arbitrary
values off the 4pt grid, and text below the legibility floor. An agent with a
detector converges; an agent without one drifts.

## Status

Planning phase. Seeded from the audit, tweaked against the mandates launch, and
adopted going forward — **not** pushed into six production `globals.css` files.
See [`HANDOVER.md`](./HANDOVER.md) for the open questions.
