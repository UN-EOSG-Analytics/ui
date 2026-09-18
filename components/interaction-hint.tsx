import { MousePointerClick } from "lucide-react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface InteractionHintProps {
  text: string;
  className?: string;
}

/** A quiet instruction for exploring interactive content. */
export function InteractionHint({ text, className }: InteractionHintProps) {
  return (
    <span
      className={cn(
        typography.meta,
        "inline-flex items-center gap-1.5 text-un-black",
        className,
      )}
    >
      <MousePointerClick
        className="size-4 shrink-0 text-un-blue"
        aria-hidden="true"
      />
      {text}
    </span>
  );
}
