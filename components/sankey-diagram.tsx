"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { layoutSankey, columnPosition, ribbon, selectionKey as flowSelectionKey,
  type SankeySelection as FlowSelection, type SankeyGraph as FlowGraph } from "../lib/sankey";
export interface SankeyDiagramProps {
  graph: FlowGraph; columnControls: readonly ReactNode[];
  ariaLabel: string; selectionLabel: string; clearLabel: string;
  formatValue: (value: number) => string;
  describeNode: (id: string) => string;
  describeLink: (source: string, target: string, value: number, within?: FlowSelection) => string;
  renderDetails: (selection: FlowSelection, compact: boolean, within?: FlowSelection) => ReactNode;
  highlightedValue?: (selection: FlowSelection, source: string, target: string) => number;
}
export function SankeyDiagram({
  graph, columnControls, ariaLabel, selectionLabel, clearLabel,
  formatValue: formatBudget, describeNode: nodeDescription, describeLink,
  renderDetails, highlightedValue,
}: SankeyDiagramProps) {
  const layout = useMemo(() => layoutSankey(graph, columnControls.length), [graph, columnControls.length]);
  const [hoverState, setHover] = useState<{
    graph: FlowGraph;
    selection: FlowSelection;
    x: number;
    y: number;
  } | null>(null);
  const [pinnedState, setPinned] = useState<{
    graph: FlowGraph;
    selection: FlowSelection;
  } | null>(null);
  const [highlightState, setHighlight] = useState<{
    graph: FlowGraph;
    selection: FlowSelection;
  } | null>(null);
  const hover = hoverState?.graph === graph ? hoverState : null;
  const pinned = pinnedState?.graph === graph ? pinnedState.selection : null;
  // Tooltips follow the pointer immediately; highlighting waits for intent.
  // Cancel pending changes whenever the pointer moves or the graph changes.
  useEffect(() => {
    if (pinned) return;
    const timer = window.setTimeout(
      () => setHighlight(hover ? { graph, selection: hover.selection } : null),
      hover ? 150 : 100,
    );
    return () => window.clearTimeout(timer);
  }, [hover, graph, pinned]);
  const highlight =
    highlightState?.graph === graph ? highlightState.selection : null;
  const active = pinned ?? highlight;
  const tooltip = hover ? renderDetails(hover.selection, true, pinned ?? undefined) : null;
  const details = pinned ? renderDetails(pinned, false) : null;
  const pin = (selection: FlowSelection) => {
    setPinned(
      pinned && flowSelectionKey(pinned) === flowSelectionKey(selection)
        ? null
        : { graph, selection },
    );
    setHover(null);
    setHighlight(null);
  };
  const relatedEdge = (source: string, target: string) =>
    !active ||
    (highlightedValue ? highlightedValue(active, source, target) > 0 :
    (active.kind === "node"
      ? active.id === source || active.id === target
      : active.source === source && active.target === target));
  const relatedNode = (id: string) =>
    !active || (highlightedValue && graph.links.some(link =>
      (link.source === id || link.target === id) && highlightedValue(active, link.source, link.target) > 0)) ||
    (active.kind === "edge"
      ? active.source === id || active.target === id
      : active.id === id ||
        graph.links.some(
          (link) =>
            (link.source === active.id && link.target === id) ||
            (link.target === active.id && link.source === id),
        ));
  const describeNode = (node: { id: string }, x: number, y: number) =>
    setHover({ graph, selection: { kind: "node", id: node.id }, x, y });
  return (
    <div
      className="space-y-3"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setHover(null);
          setPinned(null);
          setHighlight(null);
        }
      }}
    >
      <div className="overflow-x-auto rounded border border-border">
        <div className="min-w-[1000px]">
          <div className="relative h-10">
            {columnControls?.map((control, index) => (
              <div
                key={index}
                className="absolute bottom-0 w-max -translate-x-1/2"
                style={{
                  left: `${((columnPosition(index, columnControls.length) + 20) / 1200) * 100}%`,
                }}
              >
                {control}
              </div>
            ))}
          </div>
          <svg
            viewBox={`0 0 1200 ${layout.height}`}
            className="w-full"
            role="group"
            aria-label={ariaLabel}
          >
            {layout.links.map((link) => {
              const source = graph.nodes.find(
                (node) => node.id === link.source,
              )!;
              const target = graph.nodes.find(
                (node) => node.id === link.target,
              )!;
              const related = relatedEdge(link.source, link.target);
              const selection: FlowSelection = {
                kind: "edge",
                source: link.source,
                target: link.target,
              };
              const isPinned =
                !!pinned &&
                flowSelectionKey(pinned) === flowSelectionKey(selection);
              return (
                <path
                  key={`${link.source}/${link.target}`}
                  d={active && highlightedValue ? ribbon(link.x, link.end, link.sy, link.ty, link.h * Math.min(1, highlightedValue(active, link.source, link.target) / (link.positiveValue ?? link.value))) : link.path}
                  fill={link.color}
                  opacity={related ? (active ? 0.65 : 0.3) : 0.06}
                  className="cursor-pointer transition-opacity focus:stroke-black focus:stroke-2 focus:outline-none motion-reduce:transition-none"
                  role="button"
                  tabIndex={0}
                  aria-pressed={isPinned}
                  aria-label={describeLink(link.source, link.target, link.value, pinned ?? undefined)}
                  onClick={() => pin(selection)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      pin(selection);
                    }
                  }}
                  onFocus={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setHover({
                      graph,
                      selection,
                      x: rect.x + rect.width / 2,
                      y: rect.y,
                    });
                  }}
                  onBlur={() => setHover(null)}
                  onMouseEnter={(event) =>
                    setHover({
                      graph,
                      selection,
                      x: event.clientX,
                      y: event.clientY,
                    })
                  }
                  onMouseLeave={() => setHover(null)}
                >
                  <title>
                    {describeLink(link.source, link.target, link.value, pinned ?? undefined)}
                  </title>
                </path>
              );
            })}
            {layout.nodes.map((node) => {
              const leftNet =
                Math.max(0, node.column === columnControls.length - 1 ? node.spending : node.revenue) *
                layout.scale;
              const rightNet =
                Math.max(0, node.column === 0 ? node.revenue : node.spending) *
                layout.scale;
              const polygon = (left: number, right: number) =>
                `${node.x},${node.y} ${node.x + 40},${node.y} ${node.x + 40},${node.y + right} ${node.x},${node.y + left}`;
              const x = node.column === 0 ? node.x - 8 : node.x + 48;
              const label =
                node.label.length > 26
                  ? `${node.label.slice(0, 24)}…`
                  : node.label;
              return (
                <g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={
                    pinned?.kind === "node" && pinned.id === node.id
                  }
                  opacity={relatedNode(node.id) ? 1 : 0.3}
                  onClick={() => pin({ kind: "node", id: node.id })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      pin({ kind: "node", id: node.id });
                    }
                  }}
                  aria-label={nodeDescription(node.id)}
                  className="cursor-pointer focus-visible:stroke-current focus-visible:stroke-2"
                  onMouseEnter={(event) =>
                    describeNode(node, event.clientX, event.clientY)
                  }
                  onMouseLeave={() => setHover(null)}
                  onFocus={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    describeNode(node, rect.x + rect.width / 2, rect.y);
                  }}
                  onBlur={() => setHover(null)}
                >
                  <rect
                    x={node.x - 2}
                    y={node.y}
                    width={44}
                    height={Math.max(
                      22,
                      node.left * layout.scale,
                      node.right * layout.scale,
                    )}
                    fill="transparent"
                  />
                  <polygon
                    points={polygon(
                      node.left * layout.scale,
                      node.right * layout.scale,
                    )}
                    fill="var(--background)"
                    stroke={
                      Math.max(
                        node.left * layout.scale - leftNet,
                        node.right * layout.scale - rightNet,
                      ) > 0.5
                        ? node.color
                        : "none"
                    }
                    strokeDasharray="3 2"
                    strokeWidth={1}
                  />
                  <polygon
                    points={polygon(leftNet, rightNet)}
                    fill={node.color}
                  />
                  <text
                    x={x}
                    y={node.y + 11}
                    textAnchor={node.column === 0 ? "end" : "start"}
                    fontSize={14}
                    fill="currentColor"
                    stroke="var(--background)"
                    strokeWidth={4}
                    paintOrder="stroke"
                    strokeLinejoin="round"
                  >
                    {label}
                  </text>
                  <text
                    x={x}
                    y={node.y + 25}
                    textAnchor={node.column === 0 ? "end" : "start"}
                    fontSize={12}
                    fill="currentColor"
                    stroke="var(--background)"
                    strokeWidth={4}
                    paintOrder="stroke"
                  >
                    {formatBudget(
                      node.column === 0 ? node.revenue : node.spending,
                    )}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      {hover && tooltip && (
        <div
          className="pointer-events-none fixed z-50 max-h-[calc(100vh-16px)] w-80 max-w-[calc(100vw-16px)] overflow-hidden rounded-md border border-border bg-background p-3 shadow-lg"
          style={{
            left: Math.max(8, Math.min(hover.x + 12, window.innerWidth - 336)),
            top: Math.max(8, Math.min(hover.y + 12, window.innerHeight - 540)),
          }}
        >
          {tooltip}
        </div>
      )}
      {details && (
        <section
          aria-label={selectionLabel}
          className="rounded border border-border p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <h3 className="font-semibold">{selectionLabel}</h3>
            <button
              type="button"
              className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted"
              onClick={() => {
                setPinned(null);
                setHighlight(null);
                setHover(null);
              }}
            >
              {clearLabel}
            </button>
          </div>
          {details}
        </section>
      )}
    </div>
  );
}
