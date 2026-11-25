import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatAssessmentRate,
  formatBudget,
  formatBudgetTick,
  formatCount,
  formatCurrency,
  formatPercent,
} from "../lib/format-budget.ts";

test("compact money keeps the same digit limit across currencies and scales", () => {
  for (const [amount, expected] of [
    [1_000, "$1K"],
    [12_000, "$12K"],
    [123_456, "$123K"],
    [1_234_567, "$1.2M"],
    [12_345_678, "$12.3M"],
    [123_456_789, "$123M"],
    [12_345_678_000, "$12.3B"],
    [1_234_567_890_000, "$1.2T"],
  ]) {
    assert.equal(formatBudget(amount), expected);
    assert.equal(formatBudget(-amount), "−" + expected);
    assert.equal(formatCurrency(amount, "CHF"), expected.replace("$", "CHF "));
    assert.equal(formatCurrency(amount, "EUR"), expected.replace("$", "€"));
  }
});

test("money promotes rounded units and strips unnecessary trailing zeros", () => {
  for (const unit of [1_000, 1_000_000, 1_000_000_000]) {
    assert.match(formatBudget(999.49 * unit), /999[KMB]$/);
    assert.match(formatBudget(999.5 * unit), /1[MBT]$/);
    assert.match(formatBudget(99.95 * unit), /100[KMB]$/);
    assert.match(formatBudget(9.95 * unit), /10[KMB]$/);
  }
});

test("small adjustments, zero and unavailable money remain distinguishable", () => {
  assert.equal(formatBudget(0), "$0");
  assert.equal(formatBudget(-0), "$0");
  assert.equal(formatBudget(0.001), "<$1K");
  assert.equal(formatBudget(999.99), "<$1K");
  assert.equal(formatBudget(-456), "−(<$1K)");
  assert.equal(formatCurrency(-456, "CHF"), "−(<CHF 1K)");
  assert.equal(formatCurrency(0, "CHF"), "CHF 0");
  assert.equal(formatBudget(NaN), "—");
  assert.equal(formatBudget(Infinity), "—");
});

test("ordinary percentages reserve decimals for shares below ten percent", () => {
  for (const [value, expected] of [
    [98.6, "99%"],
    [19.3, "19%"],
    [45.6, "46%"],
    [12.345, "12%"],
    [10, "10%"],
    [9.96, "10%"],
    [9.94, "9.9%"],
    [3.74, "3.7%"],
    [5, "5%"],
    [0.4, "0.4%"],
    [0.1, "0.1%"],
    [0.099, "<0.1%"],
    [0.001, "<0.1%"],
    [0, "0%"],
    [-0, "0%"],
  ])
    assert.equal(formatPercent(value), expected);
});

test("rounded shares cannot imply full payment or hide overpayment", () => {
  for (const [value, expected] of [
    [99.49, "99%"],
    [99.5, "<100%"],
    [99.99, "<100%"],
    [100, "100%"],
    [100.01, ">100%"],
    [100.49, ">100%"],
    [100.5, "101%"],
    [250.4, "250%"],
  ])
    assert.equal(formatPercent(value), expected);
  assert.equal(formatPercent(99.99, { bounded: false }), "100%");
  assert.equal(formatPercent(100.01, { bounded: false }), "100%");
});

test("signed changes retain their direction, including tiny changes", () => {
  assert.equal(formatPercent(-19.5), "−20%");
  assert.equal(formatPercent(-3.74), "−3.7%");
  assert.equal(formatPercent(-0.001), "−(<0.1%)");
  assert.equal(formatPercent(19.3, { signed: true }), "+19%");
  assert.equal(formatPercent(0.001, { signed: true }), "+<0.1%");
  assert.equal(formatPercent(99.99, { signed: true, bounded: false }), "+100%");
  assert.equal(formatPercent(NaN), "—");
  assert.equal(formatPercent(Infinity), "—");
});

test("official assessment rates retain the separate three-decimal precision rule", () => {
  for (const [value, expected] of [
    [22, "22%"],
    [0.125, "0.125%"],
    [0.001, "0.001%"],
    [0.01, "0.01%"],
    [1.23456, "1.235%"],
    [0.0001, "<0.001%"],
    [0, "0%"],
  ])
    assert.equal(formatAssessmentRate(value), expected);
});

test("compact workforce counts preserve whole small counts", () => {
  assert.equal(formatCount(193), "193");
  assert.equal(formatCount(27), "27");
  assert.equal(formatCount(0), "0");
  assert.equal(formatCount(123_456), "123K");
  assert.equal(formatCount(12_345), "12.3K");
  assert.equal(formatCount(1_000), "1K");
  assert.equal(formatCount(NaN), "—");
});

test("monetary axes suppress repeated sub-thousand ticks without hiding amounts elsewhere", () => {
  assert.equal(formatBudgetTick(0), "$0");
  assert.equal(formatBudgetTick(0.25), "");
  assert.equal(formatBudgetTick(-250), "");
  assert.equal(formatBudgetTick(1_000), "$1K");
  assert.equal(formatBudget(250), "<$1K");
});
