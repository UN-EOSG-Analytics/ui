import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface ChartFrameProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}
/** Shared composition for a chart's controls, visualization, and source footer. */
export function ChartFrame({
  header,
  children,
  footer,
  className,
}: ChartFrameProps) {
  return (
    <div className={cn("w-full", className)}>
      {header && <div className="mb-3">{header}</div>}
      <div className="min-w-0">{children}</div>
      {footer}
    </div>
  );
}
