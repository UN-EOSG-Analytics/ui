# UN EOSG design system — rules for agents

Rules for writing UI in an EOSG / UN80 product. Written for coding agents, but
they are the same rules for people.

These exist because of a measured problem, not a preference. An audit of six
products found: 127 hand-rolled text sizes below Tailwind's floor, six bespoke
header bars, four table-header treatments, three different "almost black" text
colours, and a class-name typo that silently shipped to production. High
agentic throughput without a detector is what produced that.

## Setup

```css
/* globals.css */
@import "tailwindcss";
@import "@un-eosg/ui/theme.css";
```

## 0. Reach for a CONCEPT before a primitive

These products share a domain, not just a stack. "Entity", "document symbol",
"budget", "count" recur in all of them, far more often than any widget does.

```tsx
// GOOD — the decision about how an entity looks was made once
<EntityRef acronym="UNDP" name="United Nations Development Programme" />

// BAD — re-deciding acronym vs full name, chip vs text, and which grey
<span className="rounded-full bg-gray-100 px-2 text-xs">UNDP</span>
```

Layering: **tokens → primitives → concepts → pages.** If you are about to style
a domain thing by hand, check whether it is already a concept.

## 1. Text sizes come from the scale, not from `text-*`

```tsx
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

// GOOD
<h2 className={cn(typography.sectionTitle, "mb-3")}>Mandates</h2>

// BAD — re-derives a tier that already has a name
<h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">Mandates</h2>
```

## 1b. The typeface is Roboto. Always.

The brand quick guide names it the primary typeface and there is no second
face — not for headings, not for code, not for display. Per-locale stacks keep
Roboto as the Latin fallback.

## 2. Keep the display ceiling low

Hierarchy comes from **weight and colour**, not size jumps. The two most
carefully reviewed products use sizes above `text-xl` in 0.7% and 2.0% of
cases. `typography.pageTitle` is the ceiling and it is for one hero per page.

```tsx
// GOOD — a section heading is a section heading
<h2 className={typography.sectionTitle}>Recent meetings</h2>

// BAD — reaching for size to signal importance
<h2 className="text-5xl font-bold">Recent meetings</h2>
```

## 3. Stay on the 4pt grid

Tailwind's spacing scale is the baseline. A custom pt value should be
questioned, and usually replaced.

```tsx
// GOOD
<div className="px-4 py-2 gap-3">

// BAD — off-grid, and it will not line up with anything else
<div className="px-[15px] py-[7px] gap-[13px]">
```

Exceptions are values that are **derived**, not chosen — and those become
tokens. The emblem is 1.198:1, so at `h-10` it is 47.9px wide; that lives in
the theme as `--spacing-emblem-w`, not as `w-[47.9px]` at each call site.

## 4. Three colours carry the brand; accents are for charts

The brand guide is explicit: **UN Blue, white and black** should be the most
prominent colours. Body text is **true black (#000)** — not a near-black. UN
Blue is the accent for everything interactive.

The other accents (green, yellow, orange, red, purple, gray) are "primarily
used in instances when large amounts of information need to be differentiated
by colour, such as in charts, graphs or maps" — and must **not** be
colour-coded to represent particular ideas or entities. Do not reach for them
for UI states.

Each accent ships as tint / true / shade / `-text`. The bare token is for
fills, borders and dots; the `-text` variant is the darkened one that clears
WCAG AA as text on white.

```tsx
// GOOD
<span className="bg-un-blue/10 text-un-blue-text">Public preview</span>

// BAD — display hue as text on white does not clear AA
<span className="bg-un-blue/10 text-un-blue">Public preview</span>

// BAD — bypasses the system entirely
<span className="bg-[#009edb]/10 text-slate-700">Public preview</span>
```

Never write a raw hex in a `.tsx` file.

**Never build a class name by concatenation.** Tailwind scans source
statically, so `bg-${name}` and `cls.replace("bg-","border-")` generate no CSS
at all — the class silently does nothing. Write the full class name out.

## 5. Below 12px, use `micro` — never invent a size

```tsx
// GOOD
<span className={typography.micro}>UN80</span>

// BAD — this is the exact thing six products each did privately
<span className="text-[10px] font-medium">UN80</span>
```

Never go below 10px. 9px failed legibility review.

## 6. All user-visible copy arrives as props or message keys

Six official languages, one of them right-to-left. A component that hardcodes
English has to be rebuilt later.

```tsx
// GOOD
<SiteHeader brand={t("wordmarkBrand")} descriptor={t("wordmarkDescriptor")} />

// BAD
<SiteHeader brand="United Nations" descriptor="Transcripts" />
```

Third-party product names ("UN Web TV", "Kaltura") stay verbatim in every
locale — they are names, not copy.

## 7. Use logical properties, not physical ones

Arabic is RTL. `ms-auto` mirrors; `ml-auto` does not.

```tsx
// GOOD
<div className="ms-auto pe-4 text-start">

// BAD
<div className="ml-auto pr-4 text-left">
```

## 8. Compose primitives; do not fork them

`components/ui/*` is vendored shadcn and stays upgradable — do not hand-edit it.
Customisation goes in a composition above it. If a primitive is out of date, run
`shadcn add <name>` rather than patching it.

## 9. Do not remove focus indicators

`outline: none` on `:focus-visible` removes the only affordance keyboard users
have. If mouse focus rings are unwanted, suppress just those:

```css
/* GOOD — keyboard users keep their ring */
*:focus:not(:focus-visible) { outline: none; }

/* BAD */
*:focus, *:focus-visible { outline: none !important; }
```

## 10. Every dialog needs an accessible name

Use the `Modal` composition; `title` is required. If it should not be visible,
pass `hideTitle` — it stays exposed to assistive tech via `aria-labelledby`.

Do not hand-roll a dialog out of `div`s. The one in the estate that did is 739
lines and has no `role="dialog"`, no focus trap and no accessible name.
