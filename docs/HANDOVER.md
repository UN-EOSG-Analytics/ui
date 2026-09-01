# Handover: UN80 / EOSG Design System — Planning Phase

**Status: brainstorming. Nothing below is decided.** This doc carries context from a
prior conversation into Claude Code so the discussion can continue with the actual
repos available for reference.

**How to use this:** treat the "Open questions" section as the agenda. Do not
scaffold, generate, or refactor anything until a question is explicitly closed.
Where this doc records a leaning, it is a leaning, not an instruction.

---

## 1. Who / what

Data scientist + fullstack dev at the UN, EOSG. Small team.

**Orgs**

- `https://github.com/UN-EOSG-Analytics`
- `https://github.com/united-nations` — some products have migrated here, same maintainers


**Stack (almost identical across products)**

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 16 (App Router, `output: "export"`) |
| Language        | TypeScript 5, React 19                      |
| Styling         | Tailwind CSS v4                             |
| UI primitives   | shadcn/ui (Radix)                           |
| Icons           | lucide-react                                |
| Font            | Roboto (`next/font/google`)                 |
| Package manager | pnpm (single package, no workspace globs)   |
| Data            | Airtable API                                |
| Pipeline        | Python (`uv`) — pandas, python-dotenv       |
| Deploy          | GitHub Pages (static)                       |
| Agent tooling   | `next-devtools` MCP, `agent-browser` CLI    |

Some theming already exists in each app's `globals.css`.

---

## 2. The problem

Products share UI patterns and styles but each implementation differs slightly.
Maintenance is harder than it should be. Goal is visual coherence across the web
presence.

Also wanted: captured colors, font hierarchies, icon→concept mapping, and written
design philosophy usable in agent prompts.

---

## 3. Hard constraints — read before proposing anything

These dominate every design decision. A proposal that ignores them is wrong
regardless of technical merit.

1. **Everything is in production** and has been meticulously built over a long time.
2. **Technical debt is large.**
3. **No capacity to test changes.** The team is too small.
4. **UI breaks go unnoticed.** This is the binding constraint — it makes any
   refactor negative-expected-value until there is a detector.
5. **Per-site custom buttons/styles exist partly on purpose** — audiences and use
   cases genuinely differ. Not all divergence is debt.
6. Heavy agentic coding via Claude Code. High throughput + low test coverage is
   the specific pairing that produces silent quality decay.

**Implication discussed:** the first work should be a visual-regression safety net,
not tokens and not components. `output: "export"` makes this cheap — glob
`out/**/*.html`, serve locally, Playwright `toHaveScreenshot`, baselines committed.
Standalone value even if the design system never ships.

---

## 4. Where it lives

keep the design system in `UN-EOSG-Analytics`, even
though some consuming products now live in `united-nations`. Cross-org install is a
non-issue for a public GitHub registry (`owner/repo/item`).

Reason is semantic, not technical: `united-nations/ui/button` reads as the universal
UN UI kit, which is a claim that cannot be made.

**Scope is explicitly limited.** This is _not_ a UN-wide webkit:

- Agencies and entities have their own design systems.
- **DGC owns the UN visual identity.**
- Actual scope: UN80 / UN 2.0 / EOSG data team products.

Repo display name and install path are separate decisions with very different
switching costs — worth keeping them decoupled.

---

## 5. Open questions

### 5.1 One repo or two? (`ui` vs `ui` + `tokens`)

Undecided. The argument for splitting was: tokens should be a **versioned
dependency** that no app forks, while components can be copy-in. That split is what
makes a single color change propagate everywhere. The argument against is overhead
for a small team.

Sub-questions:

- If split, how are tokens consumed — GitHub Packages, or a pinned git dependency
  (`github:UN-EOSG-Analytics/tokens#v1.2.0`, no auth infra needed)?
- Does a single repo with two publishable outputs work just as well?

### 5.2 Distribution mechanism

Options discussed:

- **shadcn GitHub registry** — add `registry.json` at repo root of a public repo,
  install via `pnpm dlx shadcn add owner/repo/item`. Can distribute non-component
  files too (rules, docs, config, `AGENTS.md`). Pin to tag/SHA for reproducibility.
  Note: private repos and GitHub Enterprise hosts are not supported by GitHub
  registry addresses.
- **npm package** — versioned, but fights the copy-in model already in use.
- **Hybrid** — tokens as package, components as registry.

Not resolved. Note that a registry distributes _copies_, so it delivers initial
consistency, not permanent consistency.

### 5.3 Repo structure

Unclear. Needs the actual repos open to decide. Questions: where do per-product
theme overrides live, how are brand vs. system tokens separated on disk, does the
docs site live in the same repo as the registry.

### 5.4 Storybook or a Next.js showcase site

Undecided. Storybook 10.3 supports Next.js 16.2 and has a preview MCP server for
agents; strong for variant matrices, a11y, visual regression. Cost is a second build
system and second Tailwind wiring for a small team. A Next.js showcase in the
existing stack is cheaper and dogfoods the system.

Open: is this needed at all in v1, or is it a later phase?

### 5.5 Token architecture

Discussed but not settled. Three tiers (primitive → semantic → component) and a
**brand / system split**:

- `brand/` — colors, typography, logo rules. Sourced from DGC, cited to document
  and version. Implemented, not authored, by this team.
- `system/` — spacing, radii, elevation, motion, data-viz scales, component tokens.
  Owned here. DGC likely has no position on chart color ordering or table density.

Rationale: if DGC formalizes digital tokens, swap one layer. Also a much better
opening posture with DGC — downstream consumer, not competing authority.

Also open: DTCG JSON + Style Dictionary, or hand-written Tailwind v4 `@theme`? DTCG
earns its keep when print/Figma outputs are real requirements; may be premature
otherwise.

### 5.6 Print coherence

Goal is stated but the requirements aren't mapped. Known constraints:

- OKLCH→CMYK/Pantone cannot be round-tripped. Pairing values on the same token via
  DTCG `$extensions` was the suggested approach, not conversion.
- If print doesn't use Roboto, coherence must come from scale and hierarchy
  (ratios, weights, tracking, measure), not typeface.

**Unknown: what do the print products actually use?** Needs answering before any
print pipeline work.

### 5.7 Icons

lucide-react is Feather-derived (24px, 2px stroke, generic) and will not sit next to
a print icon set. Proposed line: lucide for UI affordances only, separate concept
set for content. OCHA humanitarian icons mentioned as worth evaluating — **licensing
unverified.**

Also proposed but undecided: a concept→icon lexicon (`icon.mandate`, `icon.entity`,
etc.) plus a lint rule banning direct lucide imports outside that module, since
agents otherwise pick a plausible icon fresh each time.

### 5.8 Migration posture

Leaning: seed the system by **extracting** the best existing implementation of each
pattern, warts included. First version modifies no production app. Adoption via new
work; existing pages migrate opportunistically when already being edited.

"System for new work, existing apps left alone" may be a legitimate permanent end
state, not a failure.

### 5.9 Classifying existing divergence

Proposed audit output — script over all repos extracting every color, spacing value,
font size, icon; then classify:

| Class                                    | Action                          |
| ---------------------------------------- | ------------------------------- |
| Accidental (`#1a5490` vs `#1a5491`)      | Converge — free win             |
| Intentional (denser type in transcripts) | Promote to theme variable       |
| Unknown (nobody remembers why)           | Leave alone, tag, revisit never |

On a meticulously tuned app, an unexplained value is often load-bearing.

---

## 6. Correction carried forward

An earlier suggestion was to kill Tailwind's default palette with
`@theme { --color-*: initial; }` so agents physically cannot write `bg-blue-500`.

**Do not do this to an existing production app** — it breaks every `bg-slate-50`
currently in use. Only viable for new apps and the design system repo itself.

---

## 7. Ideas parked, not adopted

- `PRINCIPLES.md` with ~7 principles, each one rule + a good/bad code pair (agents
  follow examples far better than adjectives). Candidate principles included
  multilingual-by-default with logical properties (`ps-4` not `pl-4`) given six
  official languages and RTL Arabic, and WCAG 2.2 AA verified at token level.
- ADRs in `decisions/` so design feedback (Kersten reviews design in detail) becomes
  durable and readable by agents rather than re-litigated.
- `// @load-bearing: reason` convention marking values agents must not "clean up."
- A `check:drift` CI script diffing local `components/ui/*` against the registry, to
  counteract the copy-in model.
- PR previews: GitHub Pages has no native support; Vercel connector is available.

---

## 8. Suggested first session

Nothing here is committed to. Roughly in order of usefulness:

1. Open the four product repos and read the actual `globals.css` files side by side.
   Most open questions above are blocked on real data.
2. Run the audit — extract and diff colors, spacing, type, icons across repos.
   Produces the artifact for both internal justification and any DGC conversation.
3. Decide 5.1 (one repo or two) and 5.3 (structure) with the audit in hand.
4. Scope the visual-regression harness — routes per app, fixture freezing strategy.

Open the repos before proposing structure.
