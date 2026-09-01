import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { SearchInput } from "../components/search-input";
import { FilterPopover, type FilterOption } from "../components/filter-popover";
import { Chip, ChipCount } from "../components/chip";
import { Button } from "../components/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/data-table";
import { typography } from "../lib/typography";
import { cn } from "../lib/utils";

const meta = {
  title: "Components/Filtering & Search",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Full-text search, facet popovers and active-filter chips — the combination every data-heavy product in the estate rebuilds. Extracted from mandates' SearchInput, PopoverFilterList and ActiveFilters.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Search: Story = {
  render: function Render() {
    const [a, setA] = React.useState("");
    const [b, setB] = React.useState("peacekeeping");
    return (
      <div className="max-w-md space-y-6">
        <div>
          <p className={cn(typography.eyebrow, "mb-2")}>bordered — default</p>
          <SearchInput
            aria-label="Search mandates"
            placeholder="Search mandates…"
            value={a}
            onChange={(e) => setA(e.target.value)}
            showClear
            onClear={() => setA("")}
          />
        </div>
        <div>
          <p className={cn(typography.eyebrow, "mb-2")}>with content — clear appears</p>
          <SearchInput
            aria-label="Search mandates"
            value={b}
            onChange={(e) => setB(e.target.value)}
            showClear
            onClear={() => setB("")}
          />
        </div>
        <div>
          <p className={cn(typography.eyebrow, "mb-2")}>border-bottom — sidebars</p>
          <SearchInput aria-label="Filter entities" placeholder="Filter entities…" variant="border-bottom" />
        </div>
        <div>
          <p className={cn(typography.eyebrow, "mb-2")}>minimal — dense toolbars</p>
          <SearchInput aria-label="Find" placeholder="Find…" variant="minimal" />
        </div>
      </div>
    );
  },
};

const organs: FilterOption[] = [
  { value: "ga", label: "General Assembly", count: 1284 },
  { value: "sc", label: "Security Council", count: 412 },
  { value: "ecosoc", label: "ECOSOC", count: 238 },
  { value: "hrc", label: "Human Rights Council", count: 156 },
  { value: "sg", label: "Secretary-General", count: 92 },
];

const subjects: FilterOption[] = [
  { value: "peace", label: "Peace and security", count: 620 },
  { value: "sd", label: "Sustainable development", count: 512 },
  { value: "hr", label: "Human rights", count: 388 },
  { value: "hum", label: "Humanitarian affairs", count: 274 },
  { value: "climate", label: "Climate", count: 201 },
  { value: "trade", label: "International trade", count: 143 },
  { value: "health", label: "Global health", count: 121 },
  { value: "gender", label: "Gender equality", count: 118 },
  { value: "edu", label: "Education", count: 96 },
  { value: "stats", label: "Statistics", count: 71 },
  { value: "transport", label: "Transport", count: 44 },
  { value: "housing", label: "Human settlements", count: 31 },
];

/**
 * Facet popovers. Search appears only once a list passes ~10 options — a search
 * box over five is noise. Counts carry a proportional bar so magnitude reads at
 * a glance. Open "Subject" to see both.
 */
export const Facets: Story = {
  render: function Render() {
    const [organ, setOrgan] = React.useState<string[]>(["sc"]);
    const [subject, setSubject] = React.useState<string[]>([]);
    return (
      <div className="flex flex-wrap gap-2">
        <FilterPopover label="Organ" options={organs} selected={organ} onChange={setOrgan} />
        <FilterPopover label="Subject" options={subjects} selected={subject} onChange={setSubject} />
      </div>
    );
  },
};

/** The whole pattern assembled: search, facets, active-filter chips, results. */
export const FullPattern: Story = {
  name: "Assembled — search + facets + results",
  render: function Render() {
    const [term, setTerm] = React.useState("");
    const [organ, setOrgan] = React.useState<string[]>(["ga"]);
    const [subject, setSubject] = React.useState<string[]>(["peace"]);

    const active = [
      ...organ.map((v) => ({ v, group: "organ" as const, label: organs.find((o) => o.value === v)!.label })),
      ...subject.map((v) => ({ v, group: "subject" as const, label: subjects.find((o) => o.value === v)!.label })),
    ];
    const remove = (group: "organ" | "subject", v: string) =>
      group === "organ"
        ? setOrgan(organ.filter((x) => x !== v))
        : setSubject(subject.filter((x) => x !== v));

    return (
      <div className="max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-64 flex-1">
            <SearchInput
              aria-label="Search mandates"
              placeholder="Search mandates…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              showClear
              onClear={() => setTerm("")}
            />
          </div>
          <FilterPopover label="Organ" options={organs} selected={organ} onChange={setOrgan} />
          <FilterPopover label="Subject" options={subjects} selected={subject} onChange={setSubject} />
        </div>

        {active.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className={typography.caption}>Filtered by</span>
            {active.map((f) => (
              <Chip key={f.group + f.v} density="dense" tone="selected" onClick={() => remove(f.group, f.v)}>
                {f.label} <ChipCount>×</ChipCount>
              </Chip>
            ))}
            <Button variant="ghost" size="xs" onClick={() => { setOrgan([]); setSubject([]); }}>
              Clear all
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Organ</TableHead>
              <TableHead numeric>Citations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["A/RES/79/1", "Strengthening the United Nations system", "General Assembly", 42],
              ["A/RES/78/12", "Peacebuilding and sustaining peace", "General Assembly", 27],
              ["A/RES/77/45", "Protection of civilians", "General Assembly", 19],
            ].map(([sym, title, org, n]) => (
              <TableRow key={sym as string}>
                <TableCell className="font-mono text-[13px] whitespace-nowrap">{sym}</TableCell>
                <TableCell>{title}</TableCell>
                <TableCell><Chip density="dense">{org}</Chip></TableCell>
                <TableCell numeric>{n}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};
