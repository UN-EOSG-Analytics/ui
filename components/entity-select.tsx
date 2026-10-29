"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface EntityOption {
  entity: string;
  entity_long?: string | null;
}

export interface EntitySelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  entities: readonly EntityOption[];
  labels: {
    input: string;
    placeholder: string;
    empty: string;
    custom: (value: string) => string;
  };
  allowCustom?: boolean;
  disabled?: boolean;
  required?: boolean;
  describedBy?: string;
  className?: string;
}

/** Presentational entity combobox. The caller owns data loading and persistence.
 * Typing only searches; selection (including the explicit custom option) commits
 * a value. This prevents an accidental partial acronym becoming an affiliation.
 */
export function EntitySelect({
  id, value, onChange, entities, labels, allowCustom = true,
  disabled, required, describedBy, className,
}: EntitySelectProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-options`;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState(0);
  const container = React.useRef<HTMLDivElement>(null);
  const needle = search.trim().toLocaleLowerCase();
  const options = entities.filter((item) =>
    `${item.entity} ${item.entity_long ?? ""}`.toLocaleLowerCase().includes(needle),
  );
  const custom = allowCustom && needle.length > 0 &&
    !entities.some((item) => item.entity.toLocaleLowerCase() === needle);
  const count = options.length + (custom ? 1 : 0);
  const activeIndex = Math.min(active, count - 1);

  React.useEffect(() => {
    if (open && activeIndex >= 0) {
      document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeIndex, listId]);

  function select(index: number) {
    const selected = index < options.length ? options[index]?.entity : custom ? search.trim() : undefined;
    if (selected) onChange(selected);
    setOpen(false);
  }

  return (
    <div ref={container} className={cn("relative", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <label htmlFor={inputId} className={cn(typography.label, "mb-2 block")}>{labels.input}</label>
      <input id={inputId} role="combobox" aria-autocomplete="list"
        aria-expanded={open} aria-controls={listId}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        aria-describedby={describedBy} aria-required={required || undefined}
        autoComplete="off" disabled={disabled} placeholder={labels.placeholder}
        value={open ? search : value}
        onFocus={() => { setSearch(""); setActive(0); setOpen(true); }}
        onClick={() => { if (!open) { setSearch(""); setActive(0); setOpen(true); } }}
        onChange={(event) => { setSearch(event.target.value); setActive(0); setOpen(true); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); }
          else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) { setSearch(""); setOpen(true); setActive(0); }
            else if (count > 0) setActive((activeIndex + (event.key === "ArrowDown" ? 1 : -1) + count) % count);
          } else if (open && event.key === "Enter") {
            event.preventDefault(); if (count > 0) select(activeIndex);
          } else if (open && (event.key === "Home" || event.key === "End")) {
            event.preventDefault(); setActive(event.key === "Home" ? 0 : Math.max(0, count - 1));
          } else if (event.key === "Tab") setOpen(false);
        }}
        className={cn(typography.body, "w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50")}
      />
      {open && <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
        <ul id={listId} role="listbox" aria-label={labels.input}>
          {options.map((option, index) => <li key={option.entity} id={`${listId}-${index}`} role="option"
            aria-selected={value === option.entity}
            onMouseDown={(event) => event.preventDefault()}
            onMouseMove={() => setActive(index)} onClick={() => select(index)}
            className={cn("cursor-pointer rounded px-3 py-2", activeIndex === index && "bg-accent text-accent-foreground")}>
            <span className={typography.body}>{option.entity}</span>
            {option.entity_long && <span className={cn(typography.caption, "block")}>{option.entity_long}</span>}
          </li>)}
          {custom && <li id={`${listId}-${options.length}`} role="option" aria-selected={value === search.trim()}
            onMouseDown={(event) => event.preventDefault()}
            onMouseMove={() => setActive(options.length)} onClick={() => select(options.length)}
            className={cn(typography.body, "cursor-pointer rounded px-3 py-2", activeIndex === options.length && "bg-accent text-accent-foreground")}>
            {labels.custom(search.trim())}
          </li>}
        </ul>
        {count === 0 && <p role="status" className={cn(typography.meta, "px-3 py-2")}>{labels.empty}</p>}
      </div>}
    </div>
  );
}
