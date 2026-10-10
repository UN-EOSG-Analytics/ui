import type { KeyboardEvent } from "react";

// Use only on a tile with an activation handler, never on tooltip-only areas.
export const treemapTileInteractionClassName =
  "group/treemap-tile cursor-pointer focus-visible:outline-none";

// Keep layout changes at their existing pace; interaction feedback is immediate.
export const treemapTileLayoutTransitionClassName =
  "motion-safe:transition-[inset-inline-start,left,top,width,height] motion-safe:duration-500 motion-safe:ease-in-out motion-reduce:transition-none";

// Apply only to decorative fills, never to the tile ancestor or its labels.
export const treemapTileFillInteractionClassName =
  "group-hover/treemap-tile:brightness-90 group-focus-visible/treemap-tile:brightness-90 motion-safe:transition-[background-color,filter] motion-safe:duration-[500ms,150ms] motion-reduce:transition-none";

// Swap the base stroke for the interaction stroke instead of stacking them.
export const treemapTileBaseBorderClassName =
  "group-hover/treemap-tile:opacity-0 group-focus-visible/treemap-tile:opacity-0";

export function TreemapTileInteractionCue({
  contrastingFocus = false,
}: {
  contrastingFocus?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 border-2 border-white opacity-0 group-hover/treemap-tile:opacity-100 group-focus-visible/treemap-tile:opacity-100 motion-safe:transition-opacity motion-safe:duration-150 ${contrastingFocus ? "group-[:focus-visible:not(:hover)]/treemap-tile:border-shuttle-gray" : ""}`}
    />
  );
}

/** Keyboard equivalent for existing div tiles with role=button. Native buttons
 * already handle these keys and must not use this helper. */
export function activateTreemapTileOnKeyDown(
  event: KeyboardEvent<HTMLElement>,
  activate: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!event.repeat) activate();
  }
}
