# Design-system audit — six EOSG / UN80 products

**Status: findings only. Nothing here has been applied.** No product repo was modified.
This is HANDOVER §8 step 2; it exists so §5.1 (one repo or two) and §5.3 (structure) can
be decided with evidence rather than taste.

Scope note: this covers UN80 / UN 2.0 / EOSG data-team products. DGC owns the UN visual
identity, and nothing proposed here reaches their web work.

**Repos audited** (branch as of 2026-09-01):

| Key          | Path                         | Branch |
| ------------ | ---------------------------- | ------ |
| transcripts  | `transcripts/`               | main   |
| mandates     | `mandates/website/`          | dev    |
| un80-actions | `un80-actions/`              | app    |
| system-chart | `un-system-chart-navigator/` | main   |
| open         | `open/`                      | main   |
| housekeeping | `un-mandates-housekeeping/`  | main   |

`transcripts` and `un80-actions` have had the closest UI review and are treated here as
the **reference implementations** — the system should be seeded by extracting from them
(HANDOVER §5.8), not by authoring fresh.

---

## A. Typography

### A1 — What separates the reviewed apps is restraint at the top of the scale

Density alone does not separate the products; four of six sit above 86% `text-xs`/`text-sm`.
What separates them is how often they reach for **display sizes** (anything above `text-xl`):

| Repo                        | Display uses (>`text-xl`) | Total size utilities |    Share | Ceiling           |
| --------------------------- | ------------------------: | -------------------: | -------: | ----------------- |
| **un80-actions** (reviewed) |                         2 |                  293 | **0.7%** | `text-2xl` (24px) |
| **transcripts** (reviewed)  |                         3 |                  152 | **2.0%** | `text-4xl`        |
| housekeeping                |                        11 |                  344 |     3.2% | `text-4xl`        |
| mandates                    |                        14 |                  348 |     4.0% | `text-6xl`        |
| open                        |                        25 |                  472 |     5.3% | `text-4xl`        |
| system-chart                |                        11 |                  117 |     9.4% | `text-5xl`        |

The ordering is monotonic and puts the two reviewed apps at the bottom. `un80-actions`
never exceeds 24px anywhere in 293 uses. The reviewed products carry hierarchy through
**weight, colour and spacing**; the others escalate size.

**This is the principle to encode:** a low display ceiling, hierarchy led by weight and
colour. It is extracted from what was already reviewed and approved, not invented.

### A2 — `<h1>` marks three different roles, so markup cannot encode hierarchy

Comparing `<h1>`s by tag is a category error — they are not one tier. Classified by role:

**Site wordmark (inside the header)**

| Repo                              | Size                            |
| --------------------------------- | ------------------------------- |
| un80-actions `HeaderBar.tsx:75`   | `text-[15px] font-bold` — 15px  |
| housekeeping `core/Header.tsx:47` | `text-xl font-bold` — 20px      |
| system-chart `Header.tsx:24`      | `text-left` (no size; inherits) |

**Page hero — the same role, four different sizes**

| Repo                                                           | Size              |
| -------------------------------------------------------------- | ----------------- |
| transcripts (`typography.pageTitle`)                           | `text-4xl` — 36px |
| open `page.tsx:25`, `SectionChrome.tsx:20`                     | `text-4xl` — 36px |
| mandates `system/page.tsx:125`, `secretariat/page-view.tsx:17` | `text-4xl` — 36px |
| mandates `methodology/page.tsx:14`, `analytics/page.tsx:106`   | `text-3xl` — 30px |
| system-chart `about`, `methodology`                            | `text-3xl` — 30px |
| housekeeping `analysis/page.tsx:35`, `heatmap/page.tsx:54`     | `text-3xl` — 30px |

`mandates` is **internally inconsistent**: its page hero is 36px on two pages and 30px on
two others. That is drift inside a single product, not just between products.

**Content-item title** — transcripts `video-page-client.tsx:329` uses `sectionTitle`
(20px); mandates `MandateDetailUi.tsx:230` uses `text-xl md:text-2xl`.

### A3 — `text-[15px]` should converge onto the 4pt scale

`un80-actions` uses an arbitrary `text-[15px]` in four places (`HeaderBar.tsx:75`,
`QuestionsTab.tsx:297, 343, 955`). This was tweaking rather than a considered half-step —
Tailwind's 4pt system is what stays maintainable in grid layouts at scale. **Action:
converge onto the 4pt scale**, and treat arbitrary `text-[Npx]` as a lint target.

### A4 — Exactly one semantic scale exists, and it is in a reviewed app

`transcripts/lib/typography.ts` defines 13 named tiers — `pageTitle`, `cardTitle`,
`sectionTitle`, `subTitle`, `lead`, `speakerLabel`, `body`, `prose`, `meta`, `caption`,
`label`, `tableHeader` — each documented, with a "new text should use a token rather than
raw `text-*`/`font-*`" rule and an explicit list of intentional exclusions. The other five
products style headings inline at the call site.

**This is the extraction seed.** It is also proof the approach survives contact with a
real app: 10 of 11 `<h1>`s in transcripts resolve through a token.

The twelfth is instructive — `app/[locale]/verify/page.tsx:27` hardcodes
`text-xl font-semibold text-foreground`, which is `sectionTitle` minus its
`tracking-tight`. **Even under an explicit rule, a near-miss leaked in.** Whatever ships
needs a check, not just a convention.

### A5 — Table headers: four treatments across six products

| Repo         | Treatment                                                                               |
| ------------ | --------------------------------------------------------------------------------------- |
| transcripts  | `text-xs font-medium tracking-wider text-muted-foreground uppercase` (tokenised)        |
| mandates     | same design, but hardcoded `text-gray-500` — **accidental divergence, free win**        |
| housekeeping | **two treatments internally**: 9× `font-medium text-gray-900`, 3× the uppercase pattern |
| system-chart | `font-semibold text-gray-700`, no uppercase                                             |
| open         | `font-medium` only                                                                      |
| un80-actions | no `<th>` styling (non-table markup)                                                    |

transcripts and mandates express the _same_ design; one routes through a semantic token,
the other hardcodes a grey. housekeeping disagrees with itself inside one codebase — the
clearest single argument for a token.

---

### A6 — Every product independently invented a tier below the scale

Tailwind's smallest step is `text-xs` (12px). All six products hand-roll sizes beneath it:

| Repo         | `text-[9px]` | `text-[10px]` | `text-[11px]` |
| ------------ | -----------: | ------------: | ------------: |
| housekeeping |            1 |            36 |            11 |
| open         |            2 |            24 |             3 |
| mandates     |            2 |            18 |            12 |
| transcripts  |            — |             6 |             1 |
| un80-actions |            — |             4 |             3 |
| system-chart |            — |             1 |             3 |

**127 uses across all six.** Six teams independently hit the same missing rung and each
invented it privately. This is the strongest evidence in the audit that a _shared_ scale
is needed rather than six local conventions — the gap is real, not stylistic.

Two consequences. The scale should define a named micro tier (10px, and 11px if it earns
its place) so this stops being an arbitrary value. And 9px body text is an accessibility
concern worth a separate look.

---

## B. Spacing, sizing and the 4pt grid

**Rule of thumb to encode: Tailwind's 4pt grid is the baseline.** Custom pt values for
margin, padding and sizing should be questioned and avoided unless there is a reason.
This is what makes a layout feel coherent, and it is the cheapest rule to enforce
mechanically.

Measured against that rule — arbitrary-value utilities (`p-[…]`, `m-[…]`, `gap-[…]`,
`w-[…]`, `h-[…]`, `text-[…]`, `inset-[…]`, `rounded-[…]` and friends):

| Repo         | Arbitrary values | Of which hard `px` |
| ------------ | ---------------: | -----------------: |
| mandates     |              145 |                 78 |
| open         |              138 |                117 |
| housekeeping |               69 |                 62 |
| system-chart |               56 |                 20 |
| transcripts  |               44 |                 43 |
| un80-actions |               42 |                 23 |

The two reviewed products sit lowest in absolute terms, consistent with A1.

**The clusters worth naming**, rather than converging blindly:

- `text-[10px]` ×89, `text-[11px]` ×33 — the missing micro tier (A6). **Promote to tokens.**
- `ring-[3px]` ×23 — a focus-ring width, repeated. **Promote to a token.**
- `h-[280px]`, `h-[560px]`, `h-[650px]`, `h-[780px]` — chart and container heights.
  Legitimately custom, but they should be _named_ constants rather than repeated literals.
- `w-[47.9px]` ×10 — a sub-pixel width. A magic number; worth asking what it is.

The distinction matters: a recurring arbitrary value is usually a **missing token**, and a
one-off arbitrary value is usually a **layout escape hatch that is fine**. The rule should
be "question custom values", not "ban them" — which is also HANDOVER §3.5's point that not
all divergence is debt.

---

## C. Colour

### C1 — Two kinds of divergence needing opposite actions

**Genuine collisions.** `--color-shuttle-gray` is `#5a6c7d` in mandates, open,
un80-actions and housekeeping, but `#596b7d` in `system-chart:9` — and both render
(`ErrorBoundary.tsx:58, 78`). `--color-un-gray` is `#aea29a` (`transcripts:21`) vs
`#d7d1ca` (`system-chart:16`) — but the second is **dead**, so it is a delete, not a
converge.

**A misnamed repo-specific palette.** `system-chart` draws from the **UN System Chart
PDF** — a different source document, neither the UN80 palette nor DGC's. So
`--color-un-red: #a0665c` (`system-chart:14`) is not a wrong value to converge; it is a
**correctly-valued token wearing a shared name**. It happens to be byte-identical to that
same file's `--color-au-chico`, so `text-un-red` at `ErrorBoundary.tsx:81` renders
terracotta rather than red.

> **Action: namespace, don't converge.** `--color-syschart-*` removes the collision while
> keeping the sourced values intact. **Open verification:** check `#596b7d` against the
> System Chart PDF before converging it — it may be sourced rather than mistyped. This
> audit cannot close that question.

### C2 — A travelling dead palette

The block `trout / shuttle-gray / camouflage-green / pale-oyster / smoky / au-chico /
faded-jade / dusty-gray` appears near-verbatim in four products and is largely unused:

| Repo         | Block tokens defined | Dead  | Still live    |
| ------------ | -------------------: | ----: | ------------- |
| un80-actions |                    8 | **8** | —             |
| housekeeping |                    8 | **7** | `dusty-gray`  |
| system-chart |                    7 | **6** | `shuttle-gray`|
| open         |                    8 |     0 | all eight     |
| mandates     |                    7 |     0 | all seven     |

`mandates` carries dead tokens too — `card-gray`, `geyser`, `iron` — but those are its
separate neutral ramp, not this block.

`un80-actions`, `open` and `housekeeping` also share an identical boilerplate comment
header, so the copy lineage is traceable. Note that `un80-actions` is a reviewed, polished
product _and_ carries 8 dead tokens — visual polish and token hygiene are separable axes.
Deleting dead tokens changes no pixels.

### C3 — The chart tokens are unexploited, not rejected

Four products ship unmodified shadcn `--chart-1..5`, with **zero** references anywhere
outside `globals.css`. This reflects a throughput bottleneck — Tailwind's token surface
has barely been reached for — rather than a design verdict against it.

Meanwhile the two products doing real data-viz bypassed the stock tokens and authored
their own. `mandates` is the worked example: a categorical palette for subject domains and
a 4-step ordinal tier ramp, CVD-validated (protan/deutan/tritan ΔE ≥ 10 adjacent, ≥ 3:1 on
white) with a documented "change only as a set" rule and "colour carries category, never
magnitude, always paired with a label."

**This is an opportunity, not debt.** HANDOVER §5.5 already assigns data-viz scales to the
`system/` layer; mandates' palette is the ready-made candidate, and a shared layer here
adds something no product currently has.

### C4 — `--primary` was never decided

| Repo                             | `--primary`                                      |
| -------------------------------- | ------------------------------------------------ |
| transcripts                      | `#009edb` — UN blue                              |
| mandates                         | `hsl(0 0% 20%)` — near-black                     |
| un80-actions, open, housekeeping | `oklch(0.205 0 0)` — near-black (shadcn default) |

One product chose; four inherited a default. Related: "almost black" body text is three
different tokens across the set — `text-foreground`, `text-gray-900`, `text-slate-950`.

Colour spaces are unharmonised. Hex, `oklch`, `hsl` and bare `white`/`black` all appear as
`:root` values, sometimes within one file.

---

## D. Components

### D1 — The divergence is at the composition layer, not the primitive layer

`un80-actions`, `open` and `housekeeping` ship **byte-identical** `dialog.tsx`
(md5 `0cd06834349826c87b64a468dbd05306`, 143 lines). Primitives are vendored and left
unedited by design, so they stay `shadcn add`-able. That policy is working.

`mandates` carries the older 122-line forwardRef generation. The difference is therefore
an **upgrade lag, not hand-editing** — but it still renders differently:

|             | mandates                                            | other three                                                              |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| Overlay dim | `bg-black/80`                                       | `bg-black/50`                                                            |
| Width       | `max-w-lg`                                          | `max-w-[calc(100%-2rem)] sm:max-w-lg` — **mandates has no mobile inset** |
| Corners     | `sm:rounded-lg` (square on mobile)                  | `rounded-lg` always                                                      |
| Animation   | zoom **+ slide-in**                                 | zoom only                                                                |
| Title       | `text-lg font-semibold leading-none tracking-tight` | same minus `tracking-tight`                                              |

The mobile-width gap is a real defect, not just a style difference. **The fix is
`shadcn add dialog` in mandates — not a design-system concern.**

> **Implication for §5.2 / §5.3: the shared layer should distribute higher-level
> compositions, not re-vendored primitives.** Primitives stay per-repo and upgradable;
> the system sits above them. This resolves the "a registry distributes copies, so it
> delivers initial consistency, not permanent consistency" worry in §5.2 — copies of
> _primitives_ are fine, because they are already treated as replaceable.

Copy-in surface varies 7×: transcripts 5 primitives, housekeeping 9, system-chart 12,
un80-actions 13, open 16, mandates 35.

### D2 — The header bar: six bespoke implementations of one component

| Repo         | File                             | Lines |
| ------------ | -------------------------------- | ----: |
| mandates     | `src/components/SiteHeader.tsx`  |   182 |
| transcripts  | `components/site-header.tsx`     |   176 |
| open         | `src/components/SiteHeader.tsx`  |   169 |
| un80-actions | `src/components/HeaderBar.tsx`   |   118 |
| system-chart | `src/components/Header.tsx`      |   106 |
| housekeeping | `src/components/core/Header.tsx` |    95 |

Four different names for one component, ~850 lines total doing the same job. File-naming
convention also diverges — kebab-case in transcripts, PascalCase in the other five.

**Best first candidate for componentization with variables.**

### D3 — Multilingual readiness: one product, and it is a reviewed one

`transcripts` is the **only** i18n-capable product: `next-intl`, six locale catalogs
(`messages/{en,fr,es,ar,zh,ru}.json`), RTL Arabic, per-locale font stacks
(`:lang(ar)`, `:lang(zh)`).

Its header already implements exactly the JSON-variable pattern needed — the wordmark
split into two translated keys (`site-header.tsx:128-130`):

```
messages/en.json:30-31   "wordmarkBrand": "United Nations",  "wordmarkDescriptor": "Transcripts"
messages/fr.json:30-31   "wordmarkBrand": "Nations Unies",   "wordmarkDescriptor": "Transcriptions"
```

…with the deliberate rule that the site's _own_ wordmark is translated per locale while
**third-party product names stay verbatim** ("UN Web TV", "Kaltura"). Its `CLAUDE.md`
encodes the six-catalog discipline, ICU plural categories per language, and a preference
for official UN terminology.

The other five products are English-only with hardcoded copy. `un80-actions`
(`src/constants/site.ts:1`) and `housekeeping` (`core/Header.tsx:14`) have taken the
partial step of extracting `SITE_TITLE` to a constant.

**transcripts is the sole reference implementation for the i18n contract.** Any shared
component must take its copy as props or message keys — never hardcoded strings — or it
will have to be rebuilt when multilingualism lands.

---

### D4 — system-chart: custom layout is a legitimate exception, its modal is not

`system-chart` has a **highly custom layout** and its main page behaves differently from
the other products. That divergence is intentional and should be left alone — it is
HANDOVER §3.5's "per-site custom styles exist partly on purpose", and §5.9's "leave alone,
tag" row. **The layout is not a convergence target.**

Its **modal is a different matter.** system-chart ships no `dialog.tsx` at all; it has a
bespoke 739-line `EntityModal.tsx`. Checked for the affordances the shadcn primitive
provides for free:

| Affordance                    | Present |
| ----------------------------- | ------- |
| `role="dialog"`               | **no**  |
| `aria-modal`                  | **no**  |
| Focus trap / focus management | **no**  |
| `aria-label`                  | **no**  |
| Escape-to-close               | yes     |

So the modal is not announced to assistive technology and does not trap focus, in the same
product that also removes focus rings (E1). The behaviour is close enough to the other
products' modals to be a shared concern — this is a good argument for the shared layer
owning a _composed_ modal (D1) that carries these affordances, while the custom layout
around it stays untouched.

---

## E. Cross-cutting

### E1 — Focus rings: a deliberate decision with an accessibility cost

| Repo         | Behaviour                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| transcripts  | WCAG baseline: `:where(button, a, [role=button], …):focus-visible` with an explicit cascade-order comment |
| mandates     | `*:focus:not(:focus-visible)` — suppresses mouse-only, keeps keyboard                                     |
| un80-actions | `outline: none !important; box-shadow: none !important` on all focus                                      |
| system-chart | as above, plus `--tw-ring-shadow: none !important`                                                        |
| housekeeping | `outline: none` on both `:focus` and `:focus-visible`                                                     |

This was **chosen, not neglected** — it is not a §5.9 "unexplained value". Recording it as
an open accessibility item rather than a defect.

Worth noting: `mandates`' `*:focus:not(:focus-visible)` achieves the same visual result
(no rings for mouse users) while keeping keyboard focus visible — WCAG 2.4.7. It is
available if the accessibility concern is ever weighed against the visual one.

### E2 — The only product with design docs has docs that no longer match its code

`mandates/website/docs/COLORS.md` opens with "All colors must come from CSS variables
defined in `globals.css`. Never use raw hex values." It has drifted in six places:

| Claim in COLORS.md                                    | Reality in `globals.css`                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| `--color-un-blue-deep: #0077b0`                       | `#0090cc`                                                                     |
| `--color-pale-oyster: #9bbb7a`                        | **not defined at all**                                                        |
| `--card` / `--muted` / `--border` tinted `hsl(220 …)` | neutral `hsl(0 0% …)`                                                         |
| `bg-accent` → `var(--color-un-blue)`                  | `hsl(0 0% 96%)`                                                               |
| `card-gray` / `geyser` / `iron` = the neutral ramp    | all three **dead**                                                            |
| —                                                     | `--color-moss`, the subject-domain palette and tier ramp are **undocumented** |

**This is the most important finding for how the system is built.** A hand-written design
document, in the most carefully documented repo, decayed silently in six ways. It bears
directly on §5.4 (Storybook vs showcase) and on the parked `check:drift` idea — and it is
a warning about the design system's own documentation. Whatever ships should be
**generated from the tokens or checked against them in CI**, not hand-maintained.

### E3 — A HANDOVER premise is wrong, and it reshapes the harness

§3 argues the visual-regression harness is cheap because `output: "export"` lets you glob
`out/**/*.html`, and §3's stack table lists "Deploy: GitHub Pages (static)".

**Only 2 of 6 products are static exports.**

| Static export      | Server                                                                               |
| ------------------ | ------------------------------------------------------------------------------------ |
| system-chart, open | transcripts, mandates, un80-actions (`output: "standalone"`); housekeeping (default) |

`transcripts` is a Postgres-backed, Azure-container, `next-intl` app with cron jobs and
API routes — its pages are not statically enumerable and its content changes hourly.
`mandates` and `un80-actions` are also server apps with databases.

**Any harness needs a per-app fixture strategy, not one glob.** This directly reshapes
HANDOVER §8 step 4, which should be re-scoped before work starts.

### E4 — Stack drift: its own workstream, tracked here

| Package        | Range across the six                                     |
| -------------- | -------------------------------------------------------- |
| `lucide-react` | `^0.555.0` → `^1.33.0` — **crosses a major boundary**    |
| `next`         | `^16.0.6` → `16.3.2` (un80-actions on `16.2.1-canary.1`) |
| `typescript`   | `^5` → `^6.0.3`                                          |
| `pnpm`         | 10.28 → 11.23; un80-actions declares no `packageManager` |

Uniform: **Tailwind v4** and **Roboto** across all six — the two things that genuinely
already agree.

This belongs beside the design system, not inside it. Tracked because the `lucide-react`
major boundary means icon geometry can already differ between products today, which is a
live input to §5.7.

---

### E5 — A shipped UI break that nobody noticed — §3.4, demonstrated

`un-system-chart-navigator/src/components/EntityModal.tsx:390`:

```jsx
<div className="shrink-0flow-hidden relative h-20 w-16 rounded-xl bg-gray-100">
```

`shrink-0` and `overflow-hidden` were glued into `shrink-0flow-hidden` by a dropped
space. Tailwind does not recognise the result: the string appears **zero times** in the
built CSS. Both utilities are silently absent, so a head-of-entity headshot container in
a production modal neither resists flex-shrink nor clips its image.

This is not a hypothetical. HANDOVER §3.4 names "UI breaks go unnoticed" as _the binding
constraint_, and argues from it that a detector must come before tokens or components.
This is that argument's proof, found incidentally while auditing something else — which
is itself the point. A scan across all six products found no other instance of the
pattern.

---

## F. Classification (HANDOVER §5.9)

| Finding                                           | Class                    | Action                                                         |
| ------------------------------------------------- | ------------------------ | -------------------------------------------------------------- |
| `shuttle-gray` `#596b7d` vs `#5a6c7d` (both live) | Accidental\*             | Converge — \*pending the PDF check                             |
| system-chart `un-red`, `un-gray`, system palette  | Intentional, misnamed    | **Namespace** → `--color-syschart-*`                           |
| Dead palette block (8/8, 7/8, 6/7)                | Accidental               | Delete — changes no pixels                                     |
| `un-gray` `#d7d1ca` (dead)                        | Accidental               | Delete, not converge                                           |
| Stock `--chart-1..5`, unused everywhere           | Unexploited              | Promote — seed `system/` from mandates' validated palette      |
| `--primary` split 4 ways                          | Never decided            | Decide once; then converge                                     |
| Mixed colour spaces (hex/oklch/hsl/keyword)       | Accidental               | Pick one; convert mechanically                                 |
| Table header: mandates' hardcoded `gray-500`      | Accidental               | Converge to the token                                          |
| Table header: housekeeping's internal split       | Accidental               | Converge internally first                                      |
| `text-[15px]` ×4                                  | Tweaking                 | Converge onto the 4pt scale; lint arbitrary values             |
| Display-size ceiling (0.7% → 9.4%)                | Intentional              | Promote the reviewed apps' restraint to a documented principle |
| mandates' page hero 30px vs 36px                  | Accidental               | Converge internally                                            |
| Six bespoke header bars                           | Intentional + accidental | Componentize with variables + i18n keys                        |
| mandates' older `dialog.tsx`                      | Upgrade lag              | `shadcn add dialog` — outside system scope                     |
| Focus-ring removal ×3                             | **Intentional**          | Leave; track as an accessibility decision                      |
| `COLORS.md` drift ×6                              | —                        | Generate or CI-check; never hand-maintain                      |
| Sub-12px text ×122, all six products              | Missing tier             | **Promote** — name a micro tier; review 9px for a11y           |
| `ring-[3px]` ×23                                  | Missing token            | Promote                                                        |
| Chart/container heights `h-[NNNpx]`               | Intentional              | Name as constants; do not converge                             |
| `w-[47.9px]` ×10                                  | Unknown                  | Leave and tag — ask what it is                                 |
| system-chart's custom layout                      | **Intentional**          | Leave alone — not a convergence target                         |
| system-chart's bespoke 739-line modal             | Accidental               | Converge to a composed modal with a11y affordances             |
| `shrink-0flow-hidden` (live break)                | Bug                      | Fix in repo; it is the case for the harness                    |

\* The one "converge" that is not yet safe to action.

---

## G. What this audit does _not_ settle

- **§5.1 — one repo or two.** Needs a capacity judgment, not evidence. Undecided.
- **§5.3 — repo structure.** Same. But D1 narrows it: the shared layer owns compositions,
  not primitives.
- **§5.6 — print.** Nothing in any of the six repos touches print. **Still unknown what
  the print products actually use** — unchanged from HANDOVER, and it blocks any print
  pipeline work.
- **§5.7 — icons.** OCHA humanitarian icon licensing **remains unverified**. E4 adds that
  `lucide-react` already spans a major boundary, so a concept→icon lexicon would be
  building on a moving base.
- **The System Chart PDF check** (C1) — needed before `#596b7d` can be converged.
- **The focus-ring accessibility question** (E1) — a decision, not a finding.

## H. What the evidence does support

1. **Seed by extraction from `transcripts` and `un80-actions`**, the two reviewed
   products — `lib/typography.ts` for the type scale, the low display ceiling for the
   principle, the i18n wordmark split for the component contract.
2. **The shared layer owns higher-level compositions**, not primitives (D1). Header bar
   first (D2), built to take copy as message keys from the start (D3).
3. **Whatever ships must be generated or CI-checked, not hand-maintained** (E2, A4).
4. **Re-scope the visual-regression harness** for 2 static + 4 server apps before starting
   it (E3).

5. **Adopt the 4pt grid as the stated baseline** (B). Question custom pt values for
   margin, padding and sizing rather than banning them — recurring arbitrary values are
   missing tokens, one-offs are usually legitimate escape hatches.

Deleting the dead palette (C2) and namespacing system-chart's tokens (C1) are the only
changes that are safe today — neither moves a pixel.

One exception is worth acting on immediately regardless of what is decided above: the
`shrink-0flow-hidden` break at `EntityModal.tsx:390` (E5) is a one-line fix in a
production modal, and it is currently shipping.
