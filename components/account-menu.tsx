"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";

export interface AccountMenuLabels {
  accountMenu: string;
  signedInAs: string;
  signOut: string;
  signingOut: string;
  signOutError: string;
}

export interface AccountDetail {
  label: string;
  value: string;
}

export interface AccountAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface AccountSectionProps {
  email: string;
  entity?: AccountDetail;
  role?: AccountDetail;
  labels: AccountMenuLabels;
  actions?: readonly AccountAction[];
  onSignOut: () => void | Promise<void>;
  dir?: "ltr" | "rtl";
  className?: string;
}

export interface AccountMenuProps extends AccountSectionProps {
  /** Override when a display name supplies better initials than the email. */
  initials?: string;
}

function initialsFromEmail(email: string) {
  const local = email.split("@")[0] || email;
  return local
    .split(/[.\-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();
}

function AccountDetails({ email, entity, role, labels }: AccountSectionProps) {
  return (
    <div className="min-w-0 px-2 pt-1 pb-2">
      <p className={typography.caption}>{labels.signedInAs}</p>
      <p className={cn(typography.body, "break-words font-medium")}>
        <bdi>{email}</bdi>
      </p>
      {(entity || role) && (
        <dl className="mt-2 space-y-1">
          {[entity, role]
            .filter((detail): detail is AccountDetail => !!detail)
            .map((detail, index) => (
              <div
                key={index}
                className={cn(typography.caption, "flex flex-wrap gap-x-2")}
              >
                <dt className="text-muted-foreground">{detail.label}</dt>
                <dd className="min-w-0 break-words font-medium text-foreground">
                  {detail.value}
                </dd>
              </div>
            ))}
        </dl>
      )}
    </div>
  );
}

const actionClass =
  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-un-blue disabled:cursor-wait disabled:opacity-60 data-[highlighted]:bg-muted data-[highlighted]:outline-none [&_svg]:size-4 [&_svg]:shrink-0";

function AccountContent(
  props: AccountSectionProps & { menu?: boolean; onSignedOut?: () => void },
) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(false);
  const pendingRef = React.useRef(false);
  async function signOut() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setError(false);
    try {
      await props.onSignOut();
      props.onSignedOut?.();
    } catch {
      setError(true);
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }
  const signOutContent = (
    <>
      <LogOut aria-hidden="true" className="text-muted-foreground" />
      {pending ? props.labels.signingOut : props.labels.signOut}
    </>
  );
  return (
    <>
      <AccountDetails {...props} />
      <div className="space-y-1 border-t border-border pt-1">
        {props.actions?.map((action) =>
          props.menu ? (
            <DropdownMenu.Item
              key={action.id}
              disabled={pending}
              onSelect={action.onSelect}
              className={cn(
                typography.body,
                actionClass,
                "cursor-default data-[disabled]:pointer-events-none data-[disabled]:opacity-60",
              )}
            >
              {action.icon && <span aria-hidden="true">{action.icon}</span>}
              {action.label}
            </DropdownMenu.Item>
          ) : (
            <button
              key={action.id}
              type="button"
              disabled={pending}
              onClick={action.onSelect}
              className={cn(typography.body, actionClass)}
            >
              {action.icon && <span aria-hidden="true">{action.icon}</span>}
              {action.label}
            </button>
          ),
        )}
        {props.menu ? (
          <DropdownMenu.Item
            disabled={pending}
            onSelect={(event) => {
              event.preventDefault();
              void signOut();
            }}
            className={cn(
              typography.body,
              actionClass,
              "cursor-default data-[disabled]:pointer-events-none data-[disabled]:opacity-60",
            )}
          >
            {signOutContent}
          </DropdownMenu.Item>
        ) : (
          <button
            type="button"
            disabled={pending}
            aria-busy={pending}
            onClick={() => void signOut()}
            className={cn(typography.body, actionClass)}
          >
            {signOutContent}
          </button>
        )}
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {pending ? props.labels.signingOut : ""}
      </div>
      {error && (
        <p
          role="alert"
          className={cn(typography.caption, "px-2 py-1 text-foreground")}
        >
          {props.labels.signOutError}
        </p>
      )}
    </>
  );
}

/** Shared account content for an existing mobile navigation panel. */
export function AccountSection(props: AccountSectionProps) {
  return (
    <div dir={props.dir} className={cn("min-w-0", props.className)}>
      <AccountContent {...props} />
    </div>
  );
}

/** Presentational account control: session retrieval and logout stay in the app. */
export function AccountMenu({
  initials,
  className,
  ...props
}: AccountMenuProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} dir={props.dir}>
      <DropdownMenu.Trigger
        aria-label={props.labels.accountMenu}
        className={cn(
          typography.label,
          "flex size-8 shrink-0 items-center justify-center rounded-full bg-un-blue/10 font-semibold text-un-blue-text transition-colors hover:bg-un-blue/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-un-blue",
          className,
        )}
      >
        <span aria-hidden="true">
          {initials || initialsFromEmail(props.email)}
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 w-64 max-w-[calc(100vw-1.5rem)] max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-md"
        >
          <AccountContent {...props} menu onSignedOut={() => setOpen(false)} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
