"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";
import { Button } from "./button";

/**
 * Magic-link sign-in card.
 *
 * The auth cluster is the estate's largest remaining duplication —
 * `login-form` is in four products and counting. This is the presentational
 * half, extracted from focal-points.
 *
 * The one structural change from every copy: it takes an `onSubmit` that
 * returns a result, instead of importing a server action. That decouples it
 * from any backend, which is what lets it be reviewed and designed here
 * without a database or an `.env`.
 *
 * Tokenised on the way in — the copies used raw `gray-900`, `green-50` and
 * `red-200`, which is how six products ended up with three different
 * "almost black" text colours.
 *
 * The accessibility wiring comes from transcripts, the most evolved of the four
 * copies: `aria-live` on the confirmation, and `aria-invalid` +
 * `aria-describedby` tying the error to the field. The other three lack all
 * three, so this extraction is the best of the four rather than just one of
 * them.
 */

export type SignInStatus = "idle" | "loading" | "sent" | "error";

export interface SignInCardLabels {
  title: string;
  intro: string;
  emailLabel: string;
  emailPlaceholder?: string;
  submit: string;
  submitting: string;
  sentTitle: string;
  /** Rendered with the address appended. */
  sentBody: string;
  /** Optional "check your spam folder" hint on the sent state. */
  sentHint?: string;
}

export interface SignInCardProps {
  labels: SignInCardLabels;
  /** Resolve `{ success: true }` or `{ success: false, error }`. */
  onSubmit: (email: string) => Promise<{ success: boolean; error?: string }>;
  className?: string;
}

export function SignInCard({ labels, onSubmit, className }: SignInCardProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<SignInStatus>("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const result = await onSubmit(email);
    if (result.success) {
      setStatus("sent");
    } else {
      setError(result.error ?? "");
      setStatus("error");
    }
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className={cn(typography.cardTitle, "mb-1")}>{labels.title}</h2>
        <p className={cn(typography.meta, "mb-8")}>{labels.intro}</p>

        {status === "sent" ? (
          // Confirmation replaces the form rather than sitting beside it: the
          // next action is in the reader's inbox, not on this page.
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-un-green/40 bg-un-green/10 p-4"
          >
            <p className={cn(typography.subTitle, "text-un-green-text")}>
              {labels.sentTitle}
            </p>
            <p className={cn(typography.body, "mt-2")}>
              {labels.sentBody} <span className="font-medium">{email}</span>
            </p>
            {labels.sentHint && (
              <p className={cn(typography.caption, "mt-2")}>{labels.sentHint}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="signin-email" className={cn(typography.label, "block")}>
                {labels.emailLabel}
              </label>
              <input
                id="signin-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={labels.emailPlaceholder}
                required
                autoComplete="email"
                // The error is linked to the field, not just displayed near it:
                // without these a screen reader reaches the input, hears
                // nothing wrong, and the message goes unread.
                aria-invalid={status === "error" ? true : undefined}
                aria-describedby={status === "error" ? "signin-error" : undefined}
                className={cn(
                  "w-full rounded-md border border-input px-4 py-2.5 text-sm transition-colors",
                  "placeholder:text-muted-foreground",
                  "focus-visible:border-un-blue focus-visible:ring-focus-ring focus-visible:ring-un-blue/50 focus-visible:outline-none",
                )}
              />
            </div>

            {status === "error" && (
              // aria-live so the failure is announced, not just shown.
              <div
                id="signin-error"
                role="alert"
                className="rounded-lg border border-un-red/40 bg-un-red/10 p-3"
              >
                <p className={cn(typography.body, "text-un-red-text")}>{error}</p>
              </div>
            )}

            <Button type="submit" disabled={status === "loading"} className="w-full">
              {status === "loading" ? labels.submitting : labels.submit}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
