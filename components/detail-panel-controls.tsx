import * as React from "react";
import { cn } from "../lib/utils";

interface DetailPanelActionBase {
  label: string;
  title?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export type DetailPanelAction = DetailPanelActionBase &
  (
    | { href: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> }
    | { href?: never; onClick: () => void }
  );

interface DetailPanelControlsProps {
  close: DetailPanelAction;
  share?: DetailPanelAction;
  expand?: DetailPanelAction;
  className?: string;
}

function DetailPanelControl({ action }: { action: DetailPanelAction }) {
  const className =
    "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-un-blue/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  if (action.href !== undefined && !action.disabled) {
    return (
      <a
        href={action.href}
        onClick={action.onClick}
        aria-label={action.label}
        title={action.title ?? action.label}
        className={className}
      >
        {action.icon}
      </a>
    );
  }
  return (
    <button
      type="button"
      aria-label={action.label}
      title={action.title ?? action.label}
      disabled={action.disabled}
      onClick={action.href === undefined ? action.onClick : undefined}
      className={className}
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
