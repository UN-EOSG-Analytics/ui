"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  X as XIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./selector-popover";
import { pillStyles } from "../lib/pill-styles";
import { cn } from "../lib/utils";

export interface HierarchicalGroup {
  id: string;
  label: string;
  children: string[];
  /** Optional color for the group indicator dot (hex color or Tailwind class) */
  color?: string;
}

export interface HierarchicalSingleSelectProps {
  /** Groups with their children */
  groups: HierarchicalGroup[];
  /** Currently selected value */
  selected: string;
  /** Callback when selection changes */
  onChange: (selected: string) => void;
  /** Function to get display label for a value */
  getLabel?: (id: string) => string;
  /** Additional class names */
  className?: string;
  /** Accessible name for the selector; display selection is appended. */
  label?: string;
  searchPlaceholder?: string;
  clearSearchLabel?: string;
  noResultsLabel?: string;
}

/**
 * Hierarchical single-select dropdown displayed as a clickable chip.
 * - Level 1: Groups (selectable for aggregate)
 * - Level 2: Individual items within each group (expandable, collapsed by default)
 *
 * Includes search functionality.
 */
export function HierarchicalSingleSelect({
  groups,
  selected,
  onChange,
  getLabel,
  className,
  label,
  searchPlaceholder = "Search...",
  clearSearchLabel = "Clear search",
  noResultsLabel = "No results found",
}: HierarchicalSingleSelectProps) {
  const flat = groups.every((group) => group.children.length === 0);
  const [open, setOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectItem = (id: string) => {
    onChange(id);
    setOpen(false);
    setSearchQuery("");
  };

  const toggleExpanded = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Filter children based on search query
  const normalizedQuery = searchQuery.toLowerCase().trim();
  const filteredGroups = React.useMemo(() => {
    if (!normalizedQuery) return groups;

    return groups
      .map((group) => ({
        ...group,
        children: group.children.filter((child) =>
          child.toLowerCase().includes(normalizedQuery),
        ),
        // Also match group label
        matchesLabel: group.label.toLowerCase().includes(normalizedQuery),
      }))
      .filter((group) => group.matchesLabel || group.children.length > 0);
  }, [groups, normalizedQuery]);

  // Auto-expand groups when searching
  React.useEffect(() => {
    if (normalizedQuery) {
      setExpandedGroups(new Set(filteredGroups.map((g) => g.id)));
    }
  }, [normalizedQuery, filteredGroups]);

  // Get display label for selected item
  const selectedLabel = React.useMemo(() => {
    if (getLabel) {
      return getLabel(selected);
    }
    // Check if it's a group
    for (const group of groups) {
      if (group.id === selected) {
        return group.label;
      }
      // Check if it's a child
      if (group.children.includes(selected)) {
        return selected;
      }
    }
    return selected;
  }, [selected, groups, getLabel]);

  return (
    <div className={className}>
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label ? `${label}: ${selectedLabel}` : selectedLabel}
            title={selectedLabel}
            className={cn(
              pillStyles,
              "bg-secondary transition-colors hover:bg-muted",
              open && "bg-muted",
            )}
          >
            <span className="max-w-[180px] truncate font-medium">
              {selectedLabel}
            </span>
            <ChevronDownIcon
              className={cn(
                "h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          aria-label={label ?? selectedLabel}
          className="w-[320px] border-border bg-white p-0"
          align="start"
          sideOffset={4}
        >
          {/* Search input */}
          <div className="relative border-b border-border">
            <SearchIcon className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full border-0 bg-transparent py-2 ps-8 text-sm placeholder-gray-400 outline-none ${searchQuery ? "pe-8" : "pe-3"}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                aria-label={clearSearchLabel}
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto py-1">
            {filteredGroups.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                {noResultsLabel}
              </div>
            ) : (
              filteredGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.id);
                const hasChildren = group.children.length > 0;
                const isGroupSelected = selected === group.id;

                return (
                  <div key={group.id}>
                    {/* Group header (selectable for aggregate) */}
                    <div
                      className={cn(
                        "flex w-full items-center gap-2 px-3 transition-colors",
                        isGroupSelected ? "bg-secondary" : "hover:bg-muted",
                      )}
                    >
                      {!flat && (
                        <button
                          type="button"
                          className="w-4 shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-un-blue"
                          aria-label={group.label}
                          aria-expanded={isExpanded}
                          disabled={!hasChildren}
                          onClick={(event) => toggleExpanded(group.id, event)}
                        >
                          {hasChildren && (
                            <ChevronRightIcon
                              aria-hidden
                              className={cn(
                                "h-4 w-4 text-gray-400 transition-transform duration-200 hover:text-gray-600",
                                isExpanded && "rotate-90",
                              )}
                            />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        aria-pressed={isGroupSelected}
                        title={group.label}
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-sm py-2 text-start focus-visible:outline-2 focus-visible:outline-un-blue"
                        onClick={() => selectItem(group.id)}
                      >
                        {/* Color indicator */}
                        {group.color && (
                          <span
                            className="h-3 w-3 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: group.color }}
                          />
                        )}

                        {/* Label */}
                        <span
                          className={cn(
                            "flex-1 min-w-0 text-sm truncate",
                            isGroupSelected
                              ? "font-medium text-foreground"
                              : "text-foreground",
                          )}
                        >
                          {group.label}
                        </span>

                        {/* Count */}
                        {hasChildren && (
                          <span className="flex-shrink-0 text-xs text-gray-400">
                            ({group.children.length})
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Children (expandable) */}
                    {isExpanded &&
                      group.children.map((child) => {
                        const isChildSelected = selected === child;
                        return (
                          <button
                            type="button"
                            key={child}
                            aria-pressed={isChildSelected}
                            title={child}
                            className={cn(
                              "flex w-full items-center gap-2 ps-10 pe-3 py-1.5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-un-blue",
                              isChildSelected
                                ? "bg-secondary"
                                : "hover:bg-muted",
                            )}
                            onClick={() => selectItem(child)}
                          >
                            <span
                              className={cn(
                                "flex-1 min-w-0 text-sm truncate",
                                isChildSelected
                                  ? "font-medium text-foreground"
                                  : "text-gray-600",
                              )}
                            >
                              {child}
                            </span>
                          </button>
                        );
                      })}
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
