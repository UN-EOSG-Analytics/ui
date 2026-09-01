#!/usr/bin/env node
/**
 * find-candidates — which components should be promoted into the system?
 *
 * THE RULE OF THREE. A pattern earns promotion when it turns up in a THIRD
 * product. Two could be coincidence — one team copied another. Three is a
 * pattern, and the third copy is where the drift starts costing more than the
 * abstraction would.
 *
 * This is the exact analysis that produced the current component set: it put
 * footer (7 products, under two names), external-link (4),
 * animated-corner-logo (4) and social-icons (3) at the top of the list, and
 * they were extracted in that order.
 *
 * Usage:
 *   node scripts/find-candidates.mjs <repo-dir>...
 *   node scripts/find-candidates.mjs --threshold 2 ../transcripts ../open
 *
 * Vendored shadcn primitives are reported separately: they are copy-in by
 * design and must NOT be re-vendored by the system.
 */
import { readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const args = process.argv.slice(2);
let threshold = 3;
const ti = args.indexOf("--threshold");
if (ti !== -1) { threshold = Number(args[ti + 1]); args.splice(ti, 2); }
if (args.length === 0) {
  console.error("usage: find-candidates.mjs [--threshold N] <repo-dir>...");
  process.exit(2);
}

const SKIP = new Set(["node_modules", ".next", ".git", "out", "dist", ".venv", "storybook-static"]);
/**
 * Next.js App Router file conventions. These are route files, not components —
 * every product has a `page.tsx`, which says nothing about shared UI.
 */
const ROUTE_FILES = new Set([
  "page","layout","loading","error","not-found","template","default","route",
  "global-error","instrumentation",
]);

/** Anything shadcn generates. Copy-in by design — never re-vendor these. */
const VENDORED = new Set([
  "accordion","alert","alert-dialog","avatar","badge","button","calendar","card","carousel",
  "chart","checkbox","collapsible","command","context-menu","dialog","drawer","dropdown-menu",
  "form","hover-card","input","input-otp","label","menubar","navigation-menu","pagination",
  "popover","progress","radio-group","resizable","scroll-area","select","separator","sheet",
  "sidebar","skeleton","slider","sonner","switch","table","tabs","textarea","toast","toggle",
  "toggle-group","tooltip",
]);

const kebab = (f) =>
  f.replace(/\.tsx$/, "").replace(/(?<!^)(?=[A-Z])/g, "-").replace(/_/g, "-").toLowerCase();

function walk(dir, out = []) {
  let entries; try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    if (SKIP.has(e)) continue;
    const p = join(dir, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else if (e.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const index = new Map();
let routeSkipped = 0;
for (const repo of args) {
  // `mandates/website` should read as "mandates", not "website".
  const parts = repo.replace(/\/+$/, "").split("/");
  const last = parts[parts.length - 1];
  const name = ["website", "app", "src", "web"].includes(last) && parts.length > 1
    ? parts[parts.length - 2]
    : last;
  for (const f of walk(repo)) {
    const k = kebab(basename(f));
    if (ROUTE_FILES.has(k)) { routeSkipped++; continue; }
    if (!index.has(k)) index.set(k, new Set());
    index.get(k).add(name);
  }
}

const rows = [...index.entries()]
  .map(([name, repos]) => ({ name, repos: [...repos].sort() }))
  .filter((r) => r.repos.length >= threshold)
  .sort((a, b) => b.repos.length - a.repos.length || a.name.localeCompare(b.name));

const bespoke = rows.filter((r) => !VENDORED.has(r.name));
const vendored = rows.filter((r) => VENDORED.has(r.name));

console.log(`\nScanned ${args.length} products · ${index.size} distinct component names`);
console.log(`Threshold: appears in ${threshold}+ products`);
console.log(`Skipped ${routeSkipped} Next.js route files (page/layout/error/…)\n`);

console.log(`PROMOTION CANDIDATES (${bespoke.length})`);
if (!bespoke.length) console.log("  none — nothing has crossed the bar yet");
for (const r of bespoke) {
  console.log(`  ${String(r.repos.length).padStart(2)}  ${r.name.padEnd(26)} ${r.repos.join(", ")}`);
}

console.log(`\nVENDORED PRIMITIVES — do not re-vendor (${vendored.length})`);
console.log("  " + vendored.map((r) => r.name).join(", "));
console.log(
  "\nNote: the same component often appears under two names (footer / site-footer).\n" +
  "Skim the full list before concluding something is unique to one product.\n",
);
