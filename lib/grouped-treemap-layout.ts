export interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TreemapLayoutLeaf {
  key: string;
  value: number;
}

export interface TreemapLayoutSubgroup {
  key: string;
  leaves: readonly TreemapLayoutLeaf[];
}

export interface TreemapLayoutRow {
  key: string;
  subgroups: readonly TreemapLayoutSubgroup[];
}

export interface GroupedTreemapLayoutOptions {
  /** Sort rows by value (default), or preserve the caller's semantic order. */
  rowOrder?: "value-desc" | "input";
  /** Secretariat Overview preserves semantic subgroup order by default. */
  subgroupOrder?: "value-desc" | "input";
  /** Pixel override. The canonical default is 0.4% of plot height. */
  rowGap?: number;
  subgroupGap?: number;
  leafGap?: number;
  /** Optional reserved pixel height. Canonical labels overlay the tiles. */
  rowLabelHeight?: number;
  /** Consolidate at least two short trailing rows into one horizontal band. */
  consolidateSmallRows?: boolean;
  /** Pixel override. The canonical default is 5% of plot height. */
  smallRowThreshold?: number;
}

export interface GroupedTreemapLeafLayout extends TreemapLayoutLeaf {
  rect: TreemapRect;
}

export interface GroupedTreemapSubgroupLayout {
  key: string;
  value: number;
  rect: TreemapRect;
  leaves: GroupedTreemapLeafLayout[];
}

export interface GroupedTreemapRowLayout {
  key: string;
  value: number;
  rect: TreemapRect;
  subgroups: GroupedTreemapSubgroupLayout[];
}

const DEFAULT_OPTIONS: Required<GroupedTreemapLayoutOptions> = {
  rowOrder: "value-desc",
  subgroupOrder: "input",
  rowGap: 0,
  subgroupGap: 0,
  leafGap: 0,
  rowLabelHeight: 0,
  consolidateSmallRows: true,
  smallRowThreshold: 0,
};

function finiteNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function finiteNonNegativeOption(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && value != null && value >= 0 ? value : fallback;
}

function cleanRect(rect: TreemapRect): TreemapRect {
  return {
    x: Number.isFinite(rect.x) ? rect.x : 0,
    y: Number.isFinite(rect.y) ? rect.y : 0,
    width: Math.max(0, Number.isFinite(rect.width) ? rect.width : 0),
    height: Math.max(0, Number.isFinite(rect.height) ? rect.height : 0),
  };
}

function inset(rect: TreemapRect, top: number): TreemapRect {
  const safeTop = Math.min(Math.max(0, top), rect.height);
  return cleanRect({
    x: rect.x,
    y: rect.y + safeTop,
    width: rect.width,
    height: rect.height - safeTop,
  });
}

function stableValueOrder<T extends { key: string; value: number }>(items: readonly T[]): T[] {
  return items
    .filter((item) => finiteNonNegative(item.value) > 0)
    .map((item) => ({ item, value: finiteNonNegative(item.value) }))
    .sort((a, b) => b.value - a.value || a.item.key.localeCompare(b.item.key))
    .map(({ item }) => item);
}

/**
 * Deterministic dense subdivision copied from Secretariat Overview: cross the
 * cumulative half-value, then split horizontally unless the box is narrow.
 */
export function layoutBalancedTreemap<T extends { key: string; value: number }>(
  items: readonly T[],
  bounds: TreemapRect,
  gap = 0,
  order: "value-desc" | "input" = "value-desc",
): Array<T & { rect: TreemapRect }> {
  const ordered = order === "input"
    ? items.filter((item) => finiteNonNegative(item.value) > 0)
    : stableValueOrder(items);
  const safeBounds = cleanRect(bounds);

  function recurse(nodes: readonly T[], rect: TreemapRect): Array<T & { rect: TreemapRect }> {
    if (nodes.length === 0 || rect.width <= 0 || rect.height <= 0) return [];
    if (nodes.length === 1) return [{ ...nodes[0], rect: cleanRect(rect) }];

    const total = nodes.reduce((sum, node) => sum + finiteNonNegative(node.value), 0);
    if (total <= 0) return [];

    let splitIndex = 0;
    let running = 0;
    for (let index = 0; index < nodes.length; index += 1) {
      running += finiteNonNegative(nodes[index].value);
      if (running >= total / 2) {
        splitIndex = index + 1;
        break;
      }
    }
    splitIndex = Math.max(1, Math.min(splitIndex, nodes.length - 1));

    const first = nodes.slice(0, splitIndex);
    const second = nodes.slice(splitIndex);
    const firstValue = first.reduce((sum, node) => sum + finiteNonNegative(node.value), 0);
    const ratio = Math.min(1, Math.max(0, firstValue / total));
    const splitVertically = rect.height > 0 && rect.width / rect.height <= 0.7;
    if (!splitVertically) {
      const safeGap = Math.min(finiteNonNegativeOption(gap, 0), rect.width);
      const firstWidth = Math.max(0, rect.width * ratio - safeGap / 2);
      return [
        ...recurse(first, { ...rect, width: firstWidth }),
        ...recurse(second, {
          x: rect.x + firstWidth + safeGap,
          y: rect.y,
          width: Math.max(0, rect.width - firstWidth - safeGap),
          height: rect.height,
        }),
      ];
    }

    const safeGap = Math.min(finiteNonNegativeOption(gap, 0), rect.height);
    const firstHeight = Math.max(0, rect.height * ratio - safeGap / 2);
    return [
      ...recurse(first, { ...rect, height: firstHeight }),
      ...recurse(second, {
        x: rect.x,
        y: rect.y + firstHeight + safeGap,
        width: rect.width,
        height: Math.max(0, rect.height - firstHeight - safeGap),
      }),
    ];
  }

  return recurse(ordered, safeBounds);
}

/** Secretariat Overview's grouped bottom block uses longest-side splitting. */
function layoutCanonicalGroupBlock<T extends { key: string; value: number }>(
  items: readonly T[],
  bounds: TreemapRect,
  gap: number,
): Array<T & { rect: TreemapRect }> {
  const ordered = stableValueOrder(items);

  function recurse(nodes: readonly T[], rect: TreemapRect): Array<T & { rect: TreemapRect }> {
    if (nodes.length === 0 || rect.width <= 0 || rect.height <= 0) return [];
    if (nodes.length === 1) return [{ ...nodes[0], rect: cleanRect(rect) }];
    const total = nodes.reduce((sum, node) => sum + finiteNonNegative(node.value), 0);
    let running = 0;
    let splitIndex = 0;
    for (let index = 0; index < nodes.length; index += 1) {
      running += finiteNonNegative(nodes[index].value);
      if (running >= total / 2) {
        splitIndex = index + 1;
        break;
      }
    }
    splitIndex = Math.max(1, Math.min(splitIndex, nodes.length - 1));
    const first = nodes.slice(0, splitIndex);
    const second = nodes.slice(splitIndex);
    const firstValue = first.reduce((sum, node) => sum + finiteNonNegative(node.value), 0);
    const ratio = firstValue / total;

    if (rect.width >= rect.height) {
      const safeGap = Math.min(gap, rect.width);
      const firstWidth = Math.max(0, rect.width * ratio - safeGap / 2);
      return [
        ...recurse(first, { ...rect, width: firstWidth }),
        ...recurse(second, {
          x: rect.x + firstWidth + safeGap,
          y: rect.y,
          width: Math.max(0, rect.width - firstWidth - safeGap),
          height: rect.height,
        }),
      ];
    }
    const safeGap = Math.min(gap, rect.height);
    const firstHeight = Math.max(0, rect.height * ratio - safeGap / 2);
    return [
      ...recurse(first, { ...rect, height: firstHeight }),
      ...recurse(second, {
        x: rect.x,
        y: rect.y + firstHeight + safeGap,
        width: rect.width,
        height: Math.max(0, rect.height - firstHeight - safeGap),
      }),
    ];
  }

  return recurse(ordered, cleanRect(bounds));
}

function horizontalSlices<T extends { key: string; value: number }>(
  items: readonly T[],
  rect: TreemapRect,
  gap: number,
  order: "value-desc" | "input",
): Array<T & { rect: TreemapRect }> {
  const ordered = order === "input"
    ? items.filter((item) => finiteNonNegative(item.value) > 0)
    : stableValueOrder(items);
  const total = ordered.reduce((sum, item) => sum + finiteNonNegative(item.value), 0);
  const safeGap = ordered.length > 1
    ? Math.min(finiteNonNegativeOption(gap, 0), rect.width / (ordered.length - 1))
    : 0;
  const available = Math.max(0, rect.width - Math.max(0, ordered.length - 1) * safeGap);
  let x = rect.x;
  return ordered.map((item, index) => {
    const width = index === ordered.length - 1
      ? Math.max(0, rect.x + rect.width - x)
      : available * (finiteNonNegative(item.value) / total);
    const result = { ...item, rect: cleanRect({ x, y: rect.y, width, height: rect.height }) };
    x += width + safeGap;
    return result;
  });
}

/**
 * Lay out rows first, then balanced-binary subgroups and leaves. Invalid and
 * non-positive leaves are intentionally omitted; all totals are derived from
 * the remaining descendants rather than trusted from callers.
 */
export function layoutGroupedTreemap(
  rows: readonly TreemapLayoutRow[],
  bounds: TreemapRect,
  options: GroupedTreemapLayoutOptions = {},
): GroupedTreemapRowLayout[] {
  const settings: Required<GroupedTreemapLayoutOptions> = {
    rowOrder: options.rowOrder === "input" ? "input" : DEFAULT_OPTIONS.rowOrder,
    subgroupOrder: options.subgroupOrder === "value-desc" ? "value-desc" : DEFAULT_OPTIONS.subgroupOrder,
    rowGap: finiteNonNegativeOption(options.rowGap, DEFAULT_OPTIONS.rowGap),
    subgroupGap: finiteNonNegativeOption(options.subgroupGap, DEFAULT_OPTIONS.subgroupGap),
    leafGap: finiteNonNegativeOption(options.leafGap, DEFAULT_OPTIONS.leafGap),
    rowLabelHeight: finiteNonNegativeOption(options.rowLabelHeight, DEFAULT_OPTIONS.rowLabelHeight),
    consolidateSmallRows: options.consolidateSmallRows ?? DEFAULT_OPTIONS.consolidateSmallRows,
    smallRowThreshold: finiteNonNegativeOption(options.smallRowThreshold, DEFAULT_OPTIONS.smallRowThreshold),
  };
  const normalizedRows = rows.map((row) => {
    const subgroups = row.subgroups.map((subgroup) => {
      const leaves = stableValueOrder(
        subgroup.leaves.map((leaf) => ({ ...leaf, value: finiteNonNegative(leaf.value) })),
      );
      return {
        key: subgroup.key,
        leaves,
        value: leaves.reduce((sum, leaf) => sum + leaf.value, 0),
      };
    }).filter((subgroup) => subgroup.value > 0);
    return {
      key: row.key,
      subgroups,
      value: subgroups.reduce((sum, subgroup) => sum + subgroup.value, 0),
    };
  });
  const orderedRows = settings.rowOrder === "input"
    ? normalizedRows.filter((row) => row.value > 0)
    : stableValueOrder(normalizedRows);
  const safeBounds = cleanRect(bounds);
  const total = orderedRows.reduce((sum, row) => sum + row.value, 0);
  if (total <= 0 || safeBounds.width <= 0 || safeBounds.height <= 0) return [];

  // Secretariat Overview lays out in a square 0–100 coordinate system and
  // then applies the resulting percentages to the responsive plot.
  const virtualBounds: TreemapRect = { x: 0, y: 0, width: 100, height: 100 };
  const rowGap = options.rowGap == null
    ? 0.4
    : settings.rowGap / safeBounds.height * virtualBounds.height;
  const smallRowThreshold = options.smallRowThreshold == null
    ? 5
    : settings.smallRowThreshold / safeBounds.height * virtualBounds.height;
  const rowLabelHeight = settings.rowLabelHeight / safeBounds.height * virtualBounds.height;
  const subgroupGap = settings.subgroupGap / Math.min(safeBounds.width, safeBounds.height) * 100;
  const leafGap = settings.leafGap / Math.min(safeBounds.width, safeBounds.height) * 100;

  const nominalHeight = (row: (typeof orderedRows)[number]) =>
    virtualBounds.height * (row.value / total);
  let y = virtualBounds.y;
  const rowRects: Array<(typeof orderedRows)[number] & { rect: TreemapRect }> = [];

  if (settings.rowOrder === "value-desc" && settings.consolidateSmallRows) {
    const regularRows = orderedRows.filter((row) => nominalHeight(row) >= smallRowThreshold);
    const smallRows = orderedRows.filter((row) => nominalHeight(row) < smallRowThreshold);
    regularRows.slice(0, -1).forEach((row) => {
      const share = row.value / total * virtualBounds.height;
      rowRects.push({
        ...row,
        rect: cleanRect({ x: 0, y, width: 100, height: Math.max(0, share - rowGap) }),
      });
      y += share;
    });
    const bandRows = [...regularRows.slice(-1), ...smallRows];
    const bandValue = bandRows.reduce((sum, row) => sum + row.value, 0);
    if (bandRows.length > 0) {
      rowRects.push(...layoutCanonicalGroupBlock(
        bandRows,
        { x: 0, y, width: 100, height: Math.max(0, bandValue / total * 100 - rowGap) },
        0.15,
      ));
    }
  } else {
    let firstSmall = orderedRows.length;
    while (firstSmall > 0 && nominalHeight(orderedRows[firstSmall - 1]) < smallRowThreshold) {
      firstSmall -= 1;
    }
    const shouldConsolidate = settings.consolidateSmallRows
      && firstSmall < orderedRows.length
      && orderedRows.length - firstSmall >= 2;
    const regularRows = shouldConsolidate ? orderedRows.slice(0, firstSmall) : orderedRows;
    const smallRows = shouldConsolidate ? orderedRows.slice(firstSmall) : [];
    regularRows.forEach((row) => {
      const share = row.value / total * 100;
      rowRects.push({
        ...row,
        rect: cleanRect({ x: 0, y, width: 100, height: Math.max(0, share - rowGap) }),
      });
      y += share;
    });
    if (smallRows.length > 0) {
      const bandValue = smallRows.reduce((sum, row) => sum + row.value, 0);
      rowRects.push(...horizontalSlices(
        smallRows,
        { x: 0, y, width: 100, height: Math.max(0, bandValue / total * 100 - rowGap) },
        rowGap,
        "input",
      ));
    }
  }

  const scaleRect = (rect: TreemapRect): TreemapRect => cleanRect({
    x: safeBounds.x + rect.x / 100 * safeBounds.width,
    y: safeBounds.y + rect.y / 100 * safeBounds.height,
    width: rect.width / 100 * safeBounds.width,
    height: rect.height / 100 * safeBounds.height,
  });

  return rowRects.map((row) => {
    const contentRect = inset(row.rect, Math.min(rowLabelHeight, row.rect.height * 0.35));
    const subgroupRects = layoutBalancedTreemap(
      row.subgroups,
      contentRect,
      subgroupGap,
      settings.subgroupOrder,
    );
    return {
      key: row.key,
      value: row.value,
      rect: scaleRect(row.rect),
      subgroups: subgroupRects.map((subgroup) => ({
        key: subgroup.key,
        value: subgroup.value,
        rect: scaleRect(subgroup.rect),
        leaves: layoutBalancedTreemap(subgroup.leaves, subgroup.rect, leafGap).map((leaf) => ({
          ...leaf,
          rect: scaleRect(leaf.rect),
        })),
      })),
    };
  });
}
