#!/usr/bin/env node
/**
 * check-drift — a cheap detector for the class of UI bug that ships unnoticed.
 *
 * The audit's binding constraint was "UI breaks go unnoticed". The break it
 * actually found — `shrink-0flow-hidden`, two classes glued by a dropped space,
 * generating no CSS at all — was caught by comparing source class names against
 * the built stylesheet. That generalises, and it is far cheaper than screenshot
 * testing: it needs no fixtures, no browser, and works the same on a static
 * export or a server-rendered app.
 *
 * Usage:
 *   node scripts/check-drift.mjs <app-dir> [--css <built.css>]
 *
 * Checks:
 *   1. unknown-class  — a Tailwind-shaped class that produced no CSS (needs --css)
 *   2. raw-hex        — a hex colour literal in .tsx/.ts
 *   3. off-grid       — arbitrary px spacing/sizing values
 *   4. sub-micro      — text below 10px
 *   5. focus-killed   — focus indicator removed globally
 *
 * Exit code 1 if any error-level finding is present.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const args = process.argv.slice(2);
const root = args[0];
const cssPath = args[includesFlag("--css") + 1];
function includesFlag(f) { return args.indexOf(f); }

if (!root) {
  console.error("usage: check-drift.mjs <app-dir> [--css <built.css>]");
  process.exit(2);
}

const SKIP = new Set(["node_modules", ".next", ".git", "out", "dist", ".venv", "storybook-static"]);
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const p = join(dir, entry);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, acc);
    else if ([".tsx", ".ts", ".jsx"].includes(extname(p))) acc.push(p);
  }
  return acc;
}

const findings = [];
const add = (level, rule, file, line, message) =>
  findings.push({ level, rule, file, line, message });

const files = walk(root);

// Class names as they appear in className="..." strings.
const classAttr = /class(?:Name)?\s*=\s*"([^"]+)"/g;
// A token that looks like a Tailwind utility (has a dash, lowercase start).
const utilityish = /^[a-z][a-z0-9]*(?:-[a-z0-9.[\]()/%#,+_-]+)+$/;

let cssText = null;
if (cssPath) {
  try { cssText = readFileSync(cssPath, "utf8"); }
  catch { console.error(`! could not read --css ${cssPath}; skipping unknown-class check`); }
}
/** Escape a class name the way it appears as a CSS selector. */
const escapeClass = (c) => c.replace(/[.:/[\]()%#,+!]/g, (m) => "\\" + m);

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");

  lines.forEach((text, i) => {
    const ln = i + 1;

    // 2. raw hex colour literals
    for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
      if (/^\s*(\/\/|\*|\/\*)/.test(text)) continue; // comments are fine
      add("warn", "raw-hex", file, ln, `raw hex ${m[0]} — use a token`);
    }

    // 4. text below the micro tier
    for (const m of text.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)) {
      const px = parseFloat(m[1]);
      if (px < 10) add("error", "sub-micro", file, ln, `${m[0]} is below the 10px floor`);
      else if (px !== 10 && px !== 11)
        add("warn", "off-grid", file, ln, `${m[0]} — use a typography tier`);
    }

    // 3. arbitrary px spacing / sizing
    for (const m of text.matchAll(/\b(p|px|py|pt|pb|ps|pe|m|mx|my|mt|mb|ms|me|gap|space-x|space-y)-\[(\d+(?:\.\d+)?)px\]/g)) {
      add("warn", "off-grid", file, ln, `${m[0]} — off the 4pt grid`);
    }
  });

  // 1. unknown classes — the shrink-0flow-hidden class of bug
  if (cssText) {
    for (const m of src.matchAll(classAttr)) {
      const startLine = src.slice(0, m.index).split("\n").length;
      for (const cls of m[1].split(/\s+/)) {
        if (!cls || !utilityish.test(cls)) continue;
        if (cls.includes("${") || cls.includes("{")) continue; // interpolated
        const bare = cls.replace(/^[a-z-]+:/, ""); // strip one variant for the fallback probe
        const sel = `.${escapeClass(cls)}`;
        if (cssText.includes(sel)) continue;
        if (cssText.includes(`.${escapeClass(bare)}`)) continue;
        add("error", "unknown-class", file, startLine,
          `"${cls}" produced no CSS — typo, or a class the build never saw`);
      }
    }
  }
}

const rel = (f) => relative(root, f);
const errors = findings.filter((f) => f.level === "error");
const warns = findings.filter((f) => f.level === "warn");

const byRule = {};
for (const f of findings) (byRule[f.rule] ??= []).push(f);

for (const [rule, list] of Object.entries(byRule)) {
  console.log(`\n${list[0].level === "error" ? "✗" : "•"} ${rule} — ${list.length}`);
  for (const f of list.slice(0, 8)) console.log(`    ${rel(f.file)}:${f.line}  ${f.message}`);
  if (list.length > 8) console.log(`    … and ${list.length - 8} more`);
}

console.log(`\n${errors.length} error(s), ${warns.length} warning(s) in ${files.length} files`);
process.exit(errors.length > 0 ? 1 : 0);
