"use client";

import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import {
  formatTimecode,
  getTranscriptSpeakerDisplay,
  type TranscriptSpeaker,
} from "../lib/transcript";

/** Extracted from transcripts/components/speaker-badges.tsx; the host resolves localized affiliations. */
export function TranscriptSpeakerBadges({
  info,
  affiliationName,
  fallback,
  className,
}: {
  info?: TranscriptSpeaker | null;
  affiliationName?: string | null;
  fallback: string;
  className?: string;
}) {
  const display = getTranscriptSpeakerDisplay(info, affiliationName, fallback);
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-2",
        typography.body,
        className,
      )}
    >
      {display.affiliation && (
        <span
          className={cn(
            typography.label,
            "rounded-md bg-un-blue/10 px-2 py-1 text-un-blue-text",
          )}
        >
          {display.affiliation}
        </span>
      )}
      {display.group && (
        <span
          className={cn(
            typography.label,
            "rounded-md bg-muted px-2 py-1 text-foreground",
          )}
        >
          {display.group}
        </span>
      )}
      {display.function && (
        <span className="text-muted-foreground">{display.function}</span>
      )}
      {display.fallback && <span>{display.fallback}</span>}
    </span>
  );
}

export function TranscriptTimecode({
  seconds,
  onSeek,
  label,
}: {
  seconds: number | null;
  onSeek?: (seconds: number) => void;
  label: string;
}) {
  const text = formatTimecode(seconds);
  if (!text) return null;
  return onSeek ? (
    <button
      type="button"
      onClick={() => onSeek(seconds!)}
      aria-label={label}
      className={cn(
        typography.caption,
        "shrink-0 rounded px-2 py-1 tabular-nums hover:bg-muted hover:text-un-blue-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
    >
      <bdi dir="ltr">{text}</bdi>
    </button>
  ) : (
    <span className={cn(typography.caption, "tabular-nums")}>
      <bdi dir="ltr">{text}</bdi>
    </span>
  );
}
