"use client";

import { Fragment, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { typography } from "../lib/typography";
import {
  weaveSentenceParts,
  segmentHasTopic,
  type TranscriptPlayback,
  type TranscriptSegment,
  type TranscriptStatement,
  type TranscriptSpeakerMapping,
  type TranscriptTopic,
} from "../lib/transcript";
import {
  TranscriptSpeakerBadges,
  TranscriptTimecode,
} from "./transcripts-speaker";

export {
  TranscriptSpeakerBadges,
  TranscriptTimecode,
} from "./transcripts-speaker";
export {
  getTranscriptSpeakerDisplay,
  buildSpeakerSegments,
  getTranscriptPlayback,
  formatTimecode,
  formatTimecodeMs,
  weaveSentenceParts,
} from "../lib/transcript";
export type {
  TranscriptPlayback,
  TranscriptSegment,
  TranscriptStatement,
  TranscriptSpeakerMapping,
  TranscriptSpeaker,
  TranscriptTopic,
  TranscriptSentence,
  TranscriptWord,
} from "../lib/transcript";

export interface TranscriptLabels {
  transcript: string;
  speakers: string;
  topics: string;
  empty: string;
  allTopics: string;
  speaker: (statementNumber: number) => string;
  seek: (seconds: number) => string;
}
export interface TranscriptContentProps {
  statements: TranscriptStatement[];
  segments: TranscriptSegment[];
  speakerMappings: TranscriptSpeakerMapping;
  countryNames: ReadonlyMap<string, string>;
  labels: TranscriptLabels;
  /** All active indices are zero-based; use -1 when the player is between timed units. */
  playback?: TranscriptPlayback;
  onSeek?: (seconds: number) => void;
  selectedTopic?: string | null;
  /** Opt-in filtering; highlighting alone never hides content. */
  topicCollapsed?: boolean;
  /** Collapsible speaker turns for mobile web. Native hosts reuse the badges' data contract. */
  collapsible?: boolean;
  className?: string;
}

/** Read-only core extracted from transcripts/components/transcript-view.tsx.
 * Sentence text remains authoritative even when word alignment is incomplete.
 * Unlike the source's clickable spans, timed text is keyboard operable.
 */
export function TranscriptContent({
  statements,
  segments,
  speakerMappings,
  countryNames,
  labels,
  playback,
  onSeek,
  selectedTopic,
  topicCollapsed = false,
  collapsible = false,
  className,
}: TranscriptContentProps) {
  const visible =
    topicCollapsed && selectedTopic
      ? segments.filter((segment) =>
          segmentHasTopic(segment, statements, selectedTopic),
        )
      : segments;
  return (
    <section
      aria-label={labels.transcript}
      className={cn("space-y-4", className)}
    >
      {visible.length === 0 && (
        <p className={typography.meta}>{labels.empty}</p>
      )}
      {segments.map((segment, segmentIndex) => {
        if (!visible.includes(segment)) return null;
        const first = segment.statementIndices[0];
        const info = speakerMappings[String(first)];
        const speaker = (
          <TranscriptSpeakerBadges
            info={info}
            affiliationName={
              info?.affiliation ? countryNames.get(info.affiliation) : null
            }
            fallback={labels.speaker((first ?? segmentIndex) + 1)}
          />
        );
        const timecode = (
          <TranscriptTimecode
            seconds={segment.timestamp}
            onSeek={onSeek}
            label={
              segment.timestamp == null ? "" : labels.seek(segment.timestamp)
            }
          />
        );
        const content = (
          <div
            className={cn(
              "space-y-3 rounded-lg border p-3",
              playback?.segmentIndex === segmentIndex
                ? "border-un-blue/40 bg-un-blue/5"
                : "border-transparent bg-muted/40",
            )}
          >
            {segment.statementIndices.map((statementIndex) => (
              <Fragment key={statementIndex}>
                {statements[statementIndex]?.paragraphs.map(
                  (paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      dir="auto"
                      className={cn(
                        typography.body,
                        "whitespace-pre-wrap text-start",
                      )}
                      data-paragraph-key={`${statementIndex}-${paragraphIndex}`}
                    >
                      {paragraph.sentences.map((sentence, sentenceIndex) => {
                        const highlighted =
                          !!selectedTopic &&
                          !!sentence.topic_keys?.includes(selectedTopic);
                        if (topicCollapsed && selectedTopic && !highlighted)
                          return null;
                        const active =
                          playback?.statementIndex === statementIndex &&
                          playback.paragraphIndex === paragraphIndex &&
                          playback.sentenceIndex === sentenceIndex;
                        const parts = weaveSentenceParts(
                          sentence.text,
                          sentence.words,
                        );
                        const hasWords = parts.some((part) => part.word);
                        const timed = (
                          text: string,
                          ms: number,
                          underline: boolean,
                          key?: number,
                        ) =>
                          onSeek ? (
                            <button
                              key={key}
                              type="button"
                              onClick={() => onSeek(ms / 1000)}
                              aria-label={`${labels.seek(ms / 1000)}: ${text}`}
                              className={cn(
                                "inline cursor-pointer rounded-sm text-start hover:text-un-blue-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                underline &&
                                  "underline decoration-2 underline-offset-4",
                              )}
                            >
                              {text}
                            </button>
                          ) : (
                            <span
                              key={key}
                              className={
                                underline
                                  ? "underline decoration-2 underline-offset-4"
                                  : undefined
                              }
                            >
                              {text}
                            </span>
                          );
                        return (
                          <Fragment key={sentenceIndex}>
                            <span
                              className={
                                highlighted
                                  ? "rounded bg-un-blue/15"
                                  : undefined
                              }
                            >
                              {hasWords
                                ? parts.map((part, index) =>
                                    part.word ? (
                                      timed(
                                        part.text,
                                        part.word.start,
                                        active &&
                                          part.wordIdx === playback?.wordIndex,
                                        index,
                                      )
                                    ) : (
                                      <span key={index}>{part.text}</span>
                                    ),
                                  )
                                : timed(sentence.text, sentence.start, active)}
                            </span>
                            {sentenceIndex < paragraph.sentences.length - 1
                              ? " "
                              : ""}
                          </Fragment>
                        );
                      })}
                    </p>
                  ),
                )}
              </Fragment>
            ))}
          </div>
        );
        return collapsible ? (
          <details key={segmentIndex} className="space-y-2">
            <summary className="cursor-pointer rounded p-2 focus-visible:outline-2 focus-visible:outline-ring">
              {speaker}
            </summary>
            <div className="flex justify-end">{timecode}</div>
            {content}
          </details>
        ) : (
          <div key={segmentIndex} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {speaker}
              {timecode}
            </div>
            {content}
          </div>
        );
      })}
    </section>
  );
}

/** Meeting-local speaker index; unknown attributions remain visible and navigable. */
export function TranscriptSpeakerIndex({
  segments,
  speakerMappings,
  countryNames,
  labels,
  playback,
  onSeek,
  selectedTopic,
  statements,
}: Omit<TranscriptContentProps, "statements"> & {
  statements?: TranscriptStatement[];
}) {
  return (
    <nav aria-label={labels.speakers} className="space-y-1">
      {segments.map((segment, index) => {
        const first = segment.statementIndices[0];
        const info = speakerMappings[String(first)];
        const inner = (
          <>
            <span className={cn(typography.caption, "shrink-0 tabular-nums")}>
              <TranscriptTimecode seconds={segment.timestamp} label="" />
            </span>
            <TranscriptSpeakerBadges
              info={info}
              affiliationName={
                info?.affiliation ? countryNames.get(info.affiliation) : null
              }
              fallback={labels.speaker((first ?? index) + 1)}
            />
            {selectedTopic &&
              statements &&
              segmentHasTopic(segment, statements, selectedTopic) && (
                <span
                  aria-hidden="true"
                  className="ms-auto h-2 w-2 shrink-0 rounded-full bg-un-blue"
                />
              )}
          </>
        );
        const rowClass = cn(
          "flex w-full items-center gap-2 rounded p-2 text-start",
          playback?.segmentIndex === index && "bg-un-blue/10",
        );
        return onSeek && segment.timestamp != null ? (
          <button
            key={index}
            type="button"
            onClick={() => onSeek(segment.timestamp!)}
            aria-current={playback?.segmentIndex === index ? "true" : undefined}
            className={cn(
              rowClass,
              "hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",
            )}
          >
            {inner}
          </button>
        ) : (
          <div key={index} className={rowClass}>
            {inner}
          </div>
        );
      })}
    </nav>
  );
}

export function TranscriptTopics({
  topics,
  selectedTopic,
  onSelectTopic,
  labels,
}: {
  topics: readonly TranscriptTopic[];
  selectedTopic: string | null;
  onSelectTopic: (key: string | null) => void;
  labels: Pick<TranscriptLabels, "topics" | "allTopics">;
}) {
  return (
    <nav aria-label={labels.topics} className="space-y-1">
      {[{ key: null, label: labels.allTopics, description: "" }, ...topics].map(
        (topic) => (
          <button
            type="button"
            key={topic.key ?? "__all"}
            aria-pressed={selectedTopic === topic.key}
            onClick={() => onSelectTopic(topic.key)}
            className={cn(
              "block w-full rounded p-2 text-start hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",
              selectedTopic === topic.key && "bg-un-blue/10",
            )}
          >
            <span className={typography.body}>{topic.label}</span>
            {topic.description && (
              <span className={cn(typography.caption, "mt-1 block")}>
                {topic.description}
              </span>
            )}
          </button>
        ),
      )}
    </nav>
  );
}

/** Player stays host-owned: pass a video/WebTV player and feed its clock to getTranscriptPlayback. */
export function TranscriptReader({
  video,
  navigation,
  children,
  className,
}: {
  video?: ReactNode;
  navigation?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-6 lg:grid-cols-3", className)}>
      {(video || navigation) && (
        <aside className="min-w-0 space-y-4">
          {video}
          {navigation}
        </aside>
      )}
      <div
        className={cn(
          "min-w-0",
          video || navigation ? "lg:col-span-2" : "lg:col-span-3",
        )}
      >
        {children}
      </div>
    </div>
  );
}
