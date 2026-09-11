"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  SearchIcon,
  X as XIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./selector-popover";
import { pillStyles } from "../lib/pill-styles";
import { cn } from "../lib/utils";

export interface HierarchicalSubgroup {
  id: string;
  label: string;
  children: string[];
}

export interface HierarchicalGroup {
  id: string;
  label: string;
  bgColor: string;
  children: string[]; // Direct children (for gov)
  subgroups?: HierarchicalSubgroup[]; // Nested subgroups (for non-gov categories)
}

export interface HierarchicalMultiSelectProps {
  groups: HierarchicalGroup[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  className?: string;
  /** Optional function to get dynamic color for selected items (for use as legend) */
  getItemColor?: (id: string) => string | undefined;
  /** Text shown on add button when nothing selected */
  addLabel?: string;
  /** Replace individual chips with one summary trigger. */
  selectionSummary?: string;
}

/**
 * Hierarchical multi-select dropdown with up to three levels:
 * - Level 1: Groups (e.g., "Government", "Non-Government") - selecting shows aggregate
 * - Level 2: Subgroups or individual items (e.g., "NGOs", "Foundations" for non-gov)
 * - Level 3: Individual items within subgroups
 *
 * Selecting a group does NOT auto-select its children.
 * Users can mix group aggregates with individual items.
 * Includes search functionality.
 */
export function HierarchicalMultiSelect({
  groups,
  selected,
  onChange,
  className,
  getItemColor,
  addLabel = "Add",
  selectionSummary,
}: HierarchicalMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const toggleItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    onChange(newSelected);
  };

  const toggleExpanded = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const selectedCount = selected.size;

  // Filter based on search query
  const normalizedQuery = searchQuery.toLowerCase().trim();
  const filteredGroups = React.useMemo(() => {
    if (!normalizedQuery) return groups;

    return groups
      .map((group) => {
        const filteredChildren = group.children.filter((child) =>
          child.toLowerCase().includes(normalizedQuery),
        );
        const filteredSubgroups = group.subgroups
          ?.map((sg) => ({
            ...sg,
            children: sg.children.filter((child) =>
              child.toLowerCase().includes(normalizedQuery),
            ),
            matchesLabel: sg.label.toLowerCase().includes(normalizedQuery),
          }))
          .filter((sg) => sg.matchesLabel || sg.children.length > 0);

        return {
          ...group,
          children: filteredChildren,
          subgroups: filteredSubgroups,
          matchesLabel: group.label.toLowerCase().includes(normalizedQuery),
        };
      })
      .filter(
        (group) =>
          group.matchesLabel ||
          group.children.length > 0 ||
          (group.subgroups && group.subgroups.length > 0),
      );
  }, [groups, normalizedQuery]);

  // Auto-expand groups when searching
  React.useEffect(() => {
    if (normalizedQuery) {
      const expanded = new Set<string>();
      filteredGroups.forEach((g) => {
        expanded.add(g.id);
        g.subgroups?.forEach((sg) => expanded.add(sg.id));
      });
      setExpandedGroups(expanded);
    }
  }, [normalizedQuery, filteredGroups]);

  // Get info about a selected item (label and group color)
  const getSelectedItemInfo = (
    id: string,
  ): { label: string; bgColor: string } | null => {
    for (const group of groups) {
      if (group.id === id) {
        return { label: group.label, bgColor: group.bgColor };
      }
      if (group.children.includes(id)) {
        return { label: id, bgColor: group.bgColor };
      }
      if (group.subgroups) {
        for (const sg of group.subgroups) {
          if (sg.id === id) {
            return { label: sg.label, bgColor: group.bgColor };
          }
          if (sg.children.includes(id)) {
            return { label: id, bgColor: group.bgColor };
          }
        }
      }
    }
    return null;
  };

  return (
    <div className={className}>
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        {/* Chips row with "+" trigger first for stable positioning */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Add chip trigger - always shows "+ select" with border for better affordance */}
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                pillStyles,
                "bg-secondary transition-colors hover:bg-gray-200",
                open && "border-gray-400 bg-gray-200",
              )}
            >
              {selectionSummary !== undefined ? (
                <>
                  <span>{selectionSummary}</span>
                  <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>+</span>
                  <span>Select</span>
                </>
              )}
            </button>
          </PopoverTrigger>

          {/* Selected items as removable chips (serves as legend when getItemColor is provided) */}
          {selectionSummary === undefined &&
            Array.from(selected).map((id) => {
              const info = getSelectedItemInfo(id);
              if (!info) return null;
              const dynamicColor = getItemColor?.(id);
              return (
                <button
                  type="button"
                  key={id}
                  aria-label={`Remove ${info.label}`}
                  onClick={() => {
                    const newSelected = new Set(selected);
                    newSelected.delete(id);
                    onChange(newSelected);
                  }}
                  className={cn(
                    pillStyles,
                    "group bg-secondary transition-colors hover:bg-gray-200",
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={
                      dynamicColor
                        ? { backgroundColor: dynamicColor }
                        : undefined
                    }
                  />
                  <span className="max-w-[150px] truncate">{info.label}</span>
                  <XIcon className="h-3 w-3 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                </button>
              );
            })}
        </div>
        <PopoverContent
          className="w-[320px] border-gray-300 bg-white p-0"
          align="start"
          sideOffset={4}
        >
          {/* Search input - minimal style matching ChartSearchInput */}
          <div className="relative border-b border-gray-200">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full border-0 bg-transparent py-2 pl-8 text-sm placeholder-gray-400 outline-none ${searchQuery ? "pr-8" : "pr-3"}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Clear search"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto py-1">
            {filteredGroups.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                No results found
              </div>
            ) : (
              filteredGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.id);
                const hasExpandable =
                  group.children.length > 0 ||
                  (group.subgroups && group.subgroups.length > 0);
                const totalCount =
                  group.children.length +
                  (group.subgroups?.reduce(
                    (sum, sg) => sum + sg.children.length,
                    0,
                  ) || 0);

                if (!hasExpandable) {
                  const color = getItemColor?.(group.id);
                  return (
                    <label
                      key={group.id}
                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 shrink-0 accent-un-blue"
                        checked={selected.has(group.id)}
                        onChange={(event) => {
                          const next = new Set(selected);
                          if (event.target.checked) next.add(group.id);
                          else next.delete(group.id);
                          onChange(next);
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-2.5 w-2.5 shrink-0 rounded-full",
                          !color && group.bgColor,
                        )}
                        style={color ? { backgroundColor: color } : undefined}
                      />
                      <span>{group.label}</span>
                    </label>
                  );
                }

                return (
                  <div key={group.id}>
                    {/* Group header (selectable for aggregate) */}
                    <div
                      className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => hasExpandable && toggleExpanded(group.id)}
                    >
                      {/* Expand/collapse chevron */}
                      <div className="flex-shrink-0 w-4">
                        {hasExpandable && (
                          <ChevronRightIcon
                            className={cn(
                              "h-4 w-4 text-gray-400 transition-transform duration-200",
                              isExpanded && "rotate-90",
                            )}
                          />
                        )}
                      </div>

                      {/* Colored checkbox (combined dot + checkbox) */}
                      <button
                        type="button"
                        className={cn(
                          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded",
                          group.bgColor,
                          !selected.has(group.id) && "opacity-40",
                        )}
                        onClick={(e) => toggleItem(group.id, e)}
                      >
                        {selected.has(group.id) && (
                          <CheckIcon className="h-3 w-3 text-white" />
                        )}
                      </button>

                      {/* Label */}
                      <span className="flex-1 min-w-0 text-sm font-medium truncate">
                        {group.label}
                      </span>

                      {/* Count */}
                      <span className="flex-shrink-0 text-xs text-gray-500">
                        ({totalCount})
                      </span>
                    </div>

                    {/* Subgroups (if any) */}
                    {isExpanded &&
                      group.subgroups?.map((subgroup) => {
                        const sgExpanded = expandedGroups.has(subgroup.id);
                        const sgHasChildren = subgroup.children.length > 0;

                        return (
                          <div key={subgroup.id}>
                            {/* Subgroup header */}
                            <div
                              className="flex w-full items-center gap-2 pl-7 pr-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() =>
                                sgHasChildren && toggleExpanded(subgroup.id)
                              }
                            >
                              {/* Expand/collapse chevron */}
                              <div className="flex-shrink-0 w-4">
                                {sgHasChildren && (
                                  <ChevronRightIcon
                                    className={cn(
                                      "h-4 w-4 text-gray-400 transition-transform duration-200",
                                      sgExpanded && "rotate-90",
                                    )}
                                  />
                                )}
                              </div>

                              {/* Colored checkbox */}
                              <button
                                type="button"
                                className={cn(
                                  "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded",
                                  group.bgColor,
                                  !selected.has(subgroup.id) && "opacity-40",
                                )}
                                onClick={(e) => toggleItem(subgroup.id, e)}
                              >
                                {selected.has(subgroup.id) && (
                                  <CheckIcon className="h-3 w-3 text-white" />
                                )}
                              </button>

                              {/* Label */}
                              <span className="flex-1 min-w-0 text-sm truncate">
                                {subgroup.label}
                              </span>

                              {/* Count */}
                              <span className="flex-shrink-0 text-xs text-gray-500">
                                ({subgroup.children.length})
                              </span>
                            </div>

                            {/* Subgroup children */}
                            {sgExpanded &&
                              subgroup.children.map((child) => (
                                <button
                                  type="button"
                                  key={child}
                                  className="flex w-full items-center gap-2 pl-14 pr-3 py-1.5 text-left hover:bg-gray-100 transition-colors"
                                  onClick={(e) => toggleItem(child, e)}
                                >
                                  {/* Colored checkbox */}
                                  <div
                                    className={cn(
                                      "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded",
                                      group.bgColor,
                                      !selected.has(child) && "opacity-40",
                                    )}
                                  >
                                    {selected.has(child) && (
                                      <CheckIcon className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  <span className="flex-1 min-w-0 text-sm truncate">
                                    {child}
                                  </span>
                                </button>
                              ))}
                          </div>
                        );
                      })}

                    {/* Direct children (no subgroups) */}
                    {isExpanded &&
                      group.children.map((child) => (
                        <button
                          type="button"
                          key={child}
                          className="flex w-full items-center gap-2 pl-10 pr-3 py-1.5 text-left hover:bg-gray-100 transition-colors"
                          onClick={(e) => toggleItem(child, e)}
                        >
                          {/* Colored checkbox */}
                          <div
                            className={cn(
                              "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded",
                              group.bgColor,
                              !selected.has(child) && "opacity-40",
                            )}
                          >
                            {selected.has(child) && (
                              <CheckIcon className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className="flex-1 min-w-0 text-sm truncate">
                            {child}
                          </span>
                        </button>
                      ))}
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
