# @un-eosg/ui

Design tokens, a type scale and shared components for the EOSG / UN80 products.

**Catalogue → https://un-eosg-analytics.github.io/ui/**

Scope is deliberately narrow: UN80 / UN 2.0 / EOSG products. DGC owns the UN
visual identity; nothing here reaches their web work.

---

## The short version

| Layer | Ships as | Changes reach you… |
| --- | --- | --- |
| **Tokens** (colour, type, spacing) | a versioned dependency you `@import` | on version bump |
| **Components** | files copied into your repo | never — they're yours once copied |
| **Stories** | stay here, they are the catalogue | you never install them |

Two mechanisms, on purpose. Tokens must propagate — a copied palette rots (the
audit found one eight-token block copied into four products and dead in three).
Components must **not** propagate, because you will need to adapt them, and an
update that silently rewrote your component would be worse than no system.

---

## How stories work

**You never pull stories in.** They live only in this repo.

Storybook is the **showroom**: it exists so you can see what already exists
before you build it. The workflow is:

1. Browse https://un-eosg-analytics.github.io/ui/
2. Find the thing you need
3. Install it into your app (below)
4. Your app renders it — no Storybook, no stories, no extra dependency

Your app never runs Storybook. If you later contribute a component *back*, you
write a story for it here — see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## How tokens work

One import, once, in your `globals.css`:

```css
@import "tailwindcss";
@import "@un-eosg/ui/theme.css";   /* ← the whole token layer */
```

Install it pinned:

```bash
pnpm add "github:UN-EOSG-Analytics/ui#v0.1.5"
```

That is the same mechanism every product already runs for `tw-animate-css` — a
versioned CSS package from `node_modules` — so it introduces nothing new. The
package has **zero runtime dependencies**: ~140KB, one package, no React or Next
duplicated.

The tokens become Tailwind utilities automatically, because Tailwind v4's
`@theme` generates them from CSS custom properties:

```tsx
<span className="bg-un-blue/10 text-un-blue-text">Public preview</span>
<span className="text-micro">UN80</span>
```

Unused tokens are tree-shaken out of your CSS, so importing the whole layer
costs nothing.

**To pick up a token change:** bump the version in `package.json` and
`pnpm install`. Nothing happens to your app until you do — that is the point.
You choose when.

### Also define your semantic layer

Tokens are brand facts. The shadcn semantic layer (`--primary`, `--muted`, …)
stays in *your* `globals.css`, because that is the legitimate per-product
surface. Start from the brand:

```css
:root {
  --background: var(--color-un-white);   /* white */
  --foreground: var(--color-un-black);   /* TRUE black, #000 — not near-black */
  --primary:    var(--color-un-blue);    /* UN Blue is the accent for everything */
  --ring:       var(--color-un-blue);
  --accent:     var(--color-un-blue-tint-50);
  --accent-foreground: var(--color-un-blue-text);
}
```

---

## Should I edit the shadcn primitives?

**No. Leave `src/components/ui/*` alone.**

Those are vendored shadcn — `button.tsx`, `dialog.tsx`, `popover.tsx`. The team
already treats them as replaceable, and it works: three products ship a
byte-identical `dialog.tsx`. Hand-editing them means you can never run
`shadcn add` again without losing your changes.

So:

| You want to… | Do this |
| --- | --- |
| Change how a primitive looks everywhere | Change a **token**, not the primitive |
| Add behaviour or structure | Write a **composition** that wraps the primitive |
| Update an out-of-date primitive | `pnpm dlx shadcn@latest add dialog` |
| Reuse something across products | Promote it here (see CONTRIBUTING.md) |

This system ships **compositions**, never re-vendored primitives. `Modal` wraps
Radix's dialog; it does not replace your `ui/dialog.tsx`.

---

## Installing a component

```bash
pnpm dlx shadcn@latest add UN-EOSG-Analytics/ui/site-footer --yes
```

Files are copied into your repo. They are yours: edit them freely. Each item is
self-contained, so it brings everything it needs and needs no configuration in
`components.json`.

Components that use imagery also need the assets, once per app:

```bash
pnpm dlx shadcn@latest add UN-EOSG-Analytics/ui/brand-assets --yes
```

That puts the emblem, the six per-locale reverse lockups and the UN 2.0 corner
mark into `public/images/`.

Browse `registry.json`, or the catalogue, for the full list.

---

## Building a new page — worked example

Say you need a **login dialog**.

**1. Check the catalogue first.** Open Storybook and look. You will find
`Modal` (an accessible dialog composition), `Button`, and `SearchInput`. You
will **not** find a login dialog — it is not in the system yet.

**2. Compose from what exists.** Do not hand-roll a dialog out of `div`s; the
one product that did has 739 lines, no `role="dialog"`, no focus trap and no
accessible name.

```tsx
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";

export function LoginDialog({ open, onOpenChange }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Sign in"                            // required — the accessible name
      description="We'll email you a sign-in link."
      footer={<Button type="submit">Send link</Button>}
    >
      <input
        type="email"
        aria-label="Email address"
        className="w-full rounded-md border border-border px-3 py-2 text-sm"
      />
    </Modal>
  );
}
```

**3. Leave it in your app.** One product using it is not a system component.

**4. When it reaches a third product, promote it.** `login-form` is already in
four products and `user-menu` in three — the auth cluster is the next thing due
for extraction, and it needs a shared contract agreed first because it couples
to a backend. Run the finder rather than guessing:

```bash
node scripts/find-candidates.mjs ../transcripts ../mandates/website ../open \
  ../un80-actions ../un-system-chart-navigator ../un-mandates-housekeeping
```

---

## Reach for a concept before a primitive

These products share a **domain**, not just a stack. "Entity", "document
symbol", "budget", "count" recur in all of them — far more often than any
widget does.

```tsx
// GOOD — the decision was made once
<EntityRef acronym="UNDP" name="United Nations Development Programme" />

// BAD — re-deciding acronym vs full name, chip vs text, and which grey
<span className="rounded-full bg-gray-100 px-2 text-xs">UNDP</span>
```

`tokens → primitives → concepts → pages`. If you are about to style a domain
thing by hand, check whether it is already a concept.

---

## Where the values come from

Nothing is invented.

- `docs/un_brand_quick_guide.pdf` — UN Blue / 100% Black / 100% White, Roboto
- `docs/un_brand_colour_palette.pdf` — true values, tints, shades, accessible text
- [`AUDIT.md`](./AUDIT.md) — what the six products converged on, and what only
  looked like convergence

Tokens the audit found dead or repo-specific were left out deliberately, and
`tokens/theme.css` says why inline so they don't return by reflex.

---

## For agents

[`AGENTS.md`](./AGENTS.md) has the rules as good/bad code pairs — examples work
better than adjectives. Install it into a project so Claude Code picks it up:

```bash
pnpm dlx shadcn@latest add UN-EOSG-Analytics/ui/agents-md --yes
```

`scripts/check-drift.mjs` is the detector:

```bash
node scripts/check-drift.mjs <app-dir> --css <built.css>
```

It catches class names that generate no CSS (typos that ship silently), raw hex
in TSX, arbitrary values off the 4pt grid, and text below the legibility floor.
An agent with a detector converges; an agent without one drifts.

---

## Local development

```bash
pnpm install
pnpm storybook      # http://localhost:6006
pnpm typecheck
```

Every push to `main` rebuilds and redeploys the catalogue.
