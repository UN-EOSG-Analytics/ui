"use client";

import * as React from "react";

interface DetailPanelExpansionState {
  expanded: boolean;
  toggle: () => void;
  /** Apply to the product-owned dialog or sheet, alongside its normal sizing. */
  style: React.CSSProperties | undefined;
}

const ExpansionContext = React.createContext<DetailPanelExpansionState | null>(
  null,
);

/** Resize a panel in place without remounting its content or changing its route. */
export function DetailPanelExpansion({
  children,
}: {
  children: (state: DetailPanelExpansionState) => React.ReactNode;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const toggle = React.useCallback(() => setExpanded((value) => !value), []);
  const state = React.useMemo<DetailPanelExpansionState>(
    () => ({
      expanded,
      toggle,
      style: expanded
        ? { width: "100%", maxWidth: "100%", minWidth: 0 }
        : undefined,
    }),
    [expanded, toggle],
  );

  return (
    <ExpansionContext.Provider value={state}>
      {children(state)}
    </ExpansionContext.Provider>
  );
}

export function useDetailPanelExpansion() {
  return React.useContext(ExpansionContext);
}
