import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

/**
 * Table primitives with the column-header treatment built in.
 *
 * The audit found four different header treatments across six products — and
 * housekeeping shipping two of them inside one codebase. transcripts and
 * mandates express the *same* design, but mandates hardcodes `text-gray-500`
 * instead of the semantic token.
 *
 * `TableHead` applies `typography.tableHeader` by default so the treatment is
 * the path of least resistance rather than something each table re-derives.
 * It is still overridable — pass `className` — but you have to mean it.
 */

export function Table({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"table"> & { containerClassName?: string }) {
  return (
    // Wide tables scroll inside their own container so the page body never
    // scrolls sideways.
    <div className={cn("w-full overflow-x-auto", containerClassName)}>
      <table
        className={cn("w-full caption-bottom border-collapse", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("border-b border-border", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors last:border-0 hover:bg-un-blue/5",
        className,
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ComponentProps<"th"> {
  /** Right-align for numeric columns, with tabular figures on the cells. */
  numeric?: boolean;
}

export function TableHead({ className, numeric, ...props }: TableHeadProps) {
  return (
    <th
      scope="col"
      className={cn(
        typography.tableHeader,
        "px-3 py-2.5 text-left align-bottom whitespace-nowrap",
        numeric && "text-right",
        className,
      )}
      {...props}
    />
  );
}

export interface TableCellProps extends React.ComponentProps<"td"> {
  numeric?: boolean;
}

export function TableCell({ className, numeric, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 align-top",
        typography.body,
        // Digits that line up in a column need tabular figures, always.
        numeric && "text-right tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption className={cn("mt-3", typography.caption, className)} {...props} />;
}
