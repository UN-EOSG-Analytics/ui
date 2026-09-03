import * as React from "react";
import { cn } from "../lib/utils";

export interface DetailPanelAction {
  label: string;
  title?: string;
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface DetailPanelControlsProps {
  close: DetailPanelAction;
  share?: DetailPanelAction;
  expand?: DetailPanelAction;
  className?: string;
}

function DetailPanelControl({ action }: { action: DetailPanelAction }) {
  return (
    <button
      type="button"
      aria-label={action.label}
      title={action.title ?? action.label}
      disabled={action.disabled}
      onClick={action.onClick}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-un-blue/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
    >
      {action.icon}
    </button>
  );
}

/** Canonical panel controls: optional share, optional expand, required close. */
export function DetailPanelControls({
  close,
  share,
  expand,
  className,
}: DetailPanelControlsProps) {
  return (
    <div className={cn("flex shrink-0 items-center gap-2 pe-1", className)}>
      {share && <DetailPanelControl action={share} />}
      {expand && <DetailPanelControl action={expand} />}
      <DetailPanelControl action={close} />
    </div>
  );
}
