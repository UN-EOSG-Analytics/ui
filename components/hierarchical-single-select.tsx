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
}: HierarchicalSingleSelectProps) {
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
            className={cn(
              pillStyles,
              "bg-secondary transition-colors hover:bg-gray-200",
              open && "bg-gray-200",
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
          className="w-[320px] border-gray-300 bg-white p-0"
          align="start"
          sideOffset={4}
        >
          {/* Search input */}
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
                const hasChildren = group.children.length > 0;
                const isGroupSelected = selected === group.id;

                return (
                  <div key={group.id}>
                    {/* Group header (selectable for aggregate) */}
                    <div
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 transition-colors cursor-pointer",
                        isGroupSelected ? "bg-gray-100" : "hover:bg-gray-50",
                      )}
                      onClick={() => selectItem(group.id)}
                    >
                      {/* Expand/collapse chevron */}
                      <button
                        type="button"
                        className="flex-shrink-0 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasChildren) toggleExpanded(group.id, e);
                        }}
                      >
                        {hasChildren && (
                          <ChevronRightIcon
                            className={cn(
                              "h-4 w-4 text-gray-400 transition-transform duration-200 hover:text-gray-600",
                              isExpanded && "rotate-90",
                            )}
                          />
                        )}
                      </button>

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
                            ? "font-medium text-gray-900"
                            : "text-gray-700",
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
                    </div>

                    {/* Children (expandable) */}
                    {isExpanded &&
                      group.children.map((child) => {
                        const isChildSelected = selected === child;
                        return (
                          <button
                            type="button"
                            key={child}
                            className={cn(
                              "flex w-full items-center gap-2 pl-10 pr-3 py-1.5 text-left transition-colors",
                              isChildSelected
                                ? "bg-gray-100"
                                : "hover:bg-gray-50",
                            )}
                            onClick={() => selectItem(child)}
                          >
                            <span
                              className={cn(
                                "flex-1 min-w-0 text-sm truncate",
                                isChildSelected
                                  ? "font-medium text-gray-900"
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
