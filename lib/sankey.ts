/** Common scale for either conserved flow or independent adjacent measures. */
export interface SankeyNode {
  id: string; label: string; fullLabel?: string; column: number;
  color: string; order?: number; isAggregate?: boolean;
}
export interface SankeyLink {
  source: string; target: string; value: number;
  /** Gross positive activity before signed corrections. */
  positiveValue?: number;
}
export interface SankeyGraph { nodes: SankeyNode[]; links: SankeyLink[] }
export type SankeySelection = { kind: "node"; id: string } |
  { kind: "edge"; source: string; target: string };
export const selectionKey = (s: SankeySelection) =>
  s.kind === "node" ? "node:" + s.id : JSON.stringify([s.source, s.target]);
export const columnPosition = (index: number, count: number) =>
  190 + index * (690 / Math.max(1, count - 1));
export function ribbon(x: number, end: number, sy: number, ty: number, h: number) {
  const c = (x + end) / 2;
  return "M"+x+","+sy+" C"+c+","+sy+" "+c+","+ty+" "+end+","+ty+" L"+end+","+(ty+h)+" C"+c+","+(ty+h)+" "+c+","+(sy+h)+" "+x+","+(sy+h)+" Z";
}

export function layoutSankey(graph: SankeyGraph, columnCount = 3) {
  const nodes = graph.nodes.map((node) => {
    const incoming = graph.links.filter((link) => link.target === node.id);
    const outgoing = graph.links.filter((link) => link.source === node.id);
    const sum = (links: SankeyLink[], positive = false) =>
      links.reduce(
        (value, link) =>
          value + (positive ? (link.positiveValue ?? Math.max(0, link.value)) : link.value),
        0,
      );
    const revenue = node.column === 0 ? sum(outgoing) : sum(incoming);
    const spending = node.column === columnCount - 1 ? sum(incoming) : sum(outgoing);
    const left = node.column === 0 ? sum(outgoing, true) : sum(incoming, true);
    const right = node.column === columnCount - 1 ? sum(incoming, true) : sum(outgoing, true);
    return {
      ...node,
      revenue,
      spending,
      left,
      right,
      y: 0,
      x: columnPosition(node.column, columnCount),
    };
  });
  const columns = Array.from({ length: columnCount }, (_, i) => i).map((column) =>
    nodes
      .filter((node) => node.column === column)
      .sort(
        (a, b) =>
          (a.order ?? Number.MAX_SAFE_INTEGER) -
            (b.order ?? Number.MAX_SAFE_INTEGER) ||
          Number(!!a.isAggregate) - Number(!!b.isAggregate) ||
          Math.max(b.left, b.right) - Math.max(a.left, a.right) ||
          a.label.localeCompare(b.label),
      ),
  );
  // One common dollars-to-pixels scale. Do not normalize each column separately.
  const scale = Math.min(
    ...columns.map(
      (column) =>
        640 /
        (column.reduce(
          (sum, node) => sum + Math.max(node.left, node.right),
          0,
        ) || 1),
    ),
  );
  let height = 0;
  for (const column of columns) {
    let y = 24;
    for (const node of column) {
      node.y = y;
      y += Math.max(22, Math.max(node.left, node.right) * scale) + 12;
    }
    height = Math.max(height, y + 12);
  }
  const positions = new Map(nodes.map((node) => [node.id, node]));
  const offsets = new Map<string, number>();
  const links = graph.links
    .filter((link) => (link.positiveValue ?? link.value) > 0)
    .sort((a, b) => {
      const sa = positions.get(a.source)!,
        sb = positions.get(b.source)!;
      return (
        sa.y - sb.y || positions.get(a.target)!.y - positions.get(b.target)!.y
      );
    })
    .map((link) => {
      const source = positions.get(link.source)!,
        target = positions.get(link.target)!;
      const sourceKey = `${link.source}:out`,
        targetKey = `${link.target}:in`;
      const sy = source.y + (offsets.get(sourceKey) ?? 0),
        ty = target.y + (offsets.get(targetKey) ?? 0);
      const h = (link.positiveValue ?? link.value) * scale;
      offsets.set(sourceKey, (offsets.get(sourceKey) ?? 0) + h);
      offsets.set(targetKey, (offsets.get(targetKey) ?? 0) + h);
      const x = source.x + 40,
        end = target.x,
        control = (x + end) / 2;
      return {
        ...link, x, end, sy, ty, h,
        color: source.column === 0 ? target.color : source.color,
        path: `M${x},${sy} C${control},${sy} ${control},${ty} ${end},${ty} L${end},${ty + h} C${control},${ty + h} ${control},${sy + h} ${x},${sy + h} Z`,
      };
    });
  return { nodes, links, height, scale };
}
