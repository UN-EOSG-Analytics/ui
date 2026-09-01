# Contributing

The system grows by **promotion**: a component proves itself in a product, and
when the same need turns up elsewhere it moves in here to be reused. Nothing is
designed speculatively.

## When does something get promoted?

### The rule of three

A pattern earns promotion when it appears in a **third** product.

Two could be coincidence — one team copied another, and that is cheap to undo.
Three is a pattern, and the third copy is the point where drift starts costing
more than the abstraction would. The audit is the evidence: the header reached
four products before anyone noticed it had become four different components,
and the footer reached seven under two different names.

Find the candidates rather than guessing:

```bash
node scripts/find-candidates.mjs ../transcripts ../mandates/website ../open \
  ../un80-actions ../un-system-chart-navigator ../un-mandates-housekeeping \
  ../un-website-boilerplate
```

It reports what crosses the bar, skips Next.js route files, and lists vendored
shadcn primitives separately — those are copy-in by design and must **not** be
re-vendored here.

### Two exceptions that skip the count

- **Compliance.** Anything carrying an accessibility or Multilingualism Web
  Standards obligation belongs here at the first implementation, not the third.
  The site footer is the example: it satisfies reqs #9 and #12, and getting it
  right meant scraping un.org.
- **Brand fact.** Values that come from the brand guides or official assets are
  not per-product decisions, so they never belong in a product.

### What does *not* get promoted

- A component used once, however good.
- A layout specific to one product's information architecture.
  `system-chart`'s main page is deliberately custom — that is a legitimate
  permanent state, not debt.
- A shadcn primitive. Those stay per-app and upgradable via `shadcn add`; the
  system owns the **compositions above** them.

## Before you promote it

Extraction is not copy-paste — the version in here is used by products you
cannot see, so a few things have to be true first.

- [ ] **No hardcoded copy.** Every user-visible string arrives as a prop or a
      message key. Six official languages, one right-to-left. A component that
      hardcodes English will be rebuilt later.
- [ ] **Logical properties.** `ms-auto`, `ps-4`, `text-start` — never `ml-`,
      `pl-`, `text-left`. Verify with an RTL story.
- [ ] **Tokens, not literals.** No raw hex. Text tiers from `typography`, not
      raw `text-*`/`font-*`. Spacing on the 4pt grid.
      *Exception:* measured facts about an official asset — the emblem's
      47.9px width, un.org's `#333333` panel — stay literal, with a comment
      saying where the number came from.
- [ ] **No app coupling.** No `usePathname`, no `useTranslations`, no imports
      from a product's `@/lib`. Pass state in; `SiteHeader` takes `activeHref`
      rather than reading the router, so it works with any routing setup.
- [ ] **Asset paths overridable.** Default to the root-absolute path a Next app
      serves from `public/`, but accept an override — Storybook and any
      subpath deployment need it.
- [ ] **Accessible by default.** Keyboard-reachable, visible focus, an
      accessible name. Interactivity expressed by element (`<a>`/`<button>`),
      never by styling a `<div>`.
- [ ] **Honours `prefers-reduced-motion`** if it animates — in the component,
      not by assuming the host app has a global rule.
- [ ] **A story per meaningful variant**, plus one non-English and one RTL
      where the component carries text.
- [ ] **Registered** in `registry.json` so it can be installed.

## Writing it down

Say *why*, not *what*. The most useful comments in this repo record decisions
that would otherwise be re-litigated or "cleaned up" by the next person:

- why a document symbol is deliberately **not** a chip
- why chip selection is a fill and never a ring (rings mean focus)
- why `truncate` goes on the content, not the chip
- why `w-[47.9px]` is derived rather than magic

If a value looks arbitrary and is not, the comment is the only thing standing
between it and a well-meaning refactor.

## Demotion

If a promoted component falls out of use everywhere, remove it. The audit found
an eight-token palette block copied into four products and dead in three — a
shared layer that only accumulates becomes its own drift.

## What is next

Current candidates over the bar, in order:

| Candidate | Products | Notes |
| --- | ---: | --- |
| `login-form` + `verify-form` + `user-menu` | 4 / 4 / 3 | The magic-link auth cluster. Bigger job — it couples to a backend, so it needs a shared contract before extraction. |
| `header` (stub variants) | 3 | The three 11-line footers/headers in un80-actions, system-chart and housekeeping should just adopt `SiteHeader`/`SiteFooter`. |

Run the script rather than trusting this table — it goes stale.
