# Sankey

`@un-eosg/ui/sankey` exports `layoutSankey`, graph types and selection types. `@un-eosg/ui/components/sankey-diagram` exports `SankeyDiagram`.

Supply ordered column controls, nodes, adjacent links, formatted labels and a detail renderer. All copy comes from the consumer. Values are signed. Optional `positiveValue` retains gross positive activity even when a link nets to zero; widths use it while labels and details disclose the net and adjustments. Negative-only nodes remain focusable. One currency-to-width scale applies across columns. Adjacent measures may differ; the renderer does not invent a balance.

`highlightedValue(selection, source, target)` lets a consumer reconstruct partial downstream ribbons from original records. It returns gross positive activity in that subset. When a selection is pinned, `renderDetails` and `describeLink` receive it as optional `within` so hover and accessible descriptions can use the same intersection. Consumers with independent measures may omit this callback.

Keyboard: nodes and ribbons receive focus; Enter/Space pins; Escape and the supplied clear control unpin. Narrow displays scroll horizontally. Financial taxonomies, donor attribution, source joins and domain navigation belong in consumers.

The open repository supplies graph-contract regression checks against actual System and Secretariat exports. This repository typechecks the generic renderer; no persistent UI tests were added.
