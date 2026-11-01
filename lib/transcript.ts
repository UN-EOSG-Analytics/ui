/** Read-only transcript contract. Content timestamps are milliseconds; seek callbacks use seconds. */
export interface TranscriptWord {
  text: string;
  start: number;
  end: number;
}
export interface TranscriptSentence {
  text: string;
  start: number;
  end: number;
  topic_keys?: string[];
  words?: TranscriptWord[];
}
export interface TranscriptStatement {
  start: number;
  end: number;
  paragraphs: Array<{
    start: number;
    end: number;
    sentences: TranscriptSentence[];
  }>;
}
/** Pass only attribution approved for public display. Inferred personal names are not accepted. */
export interface TranscriptSpeaker {
  affiliation: string | null;
  group: string | null;
  function: string | null;
  turn_id?: number;
}
export type TranscriptSpeakerMapping = Record<string, TranscriptSpeaker>;
export interface TranscriptSegment {
  speaker?: string;
  statementIndices: number[];
  timestamp: number | null;
}
export interface TranscriptTopic {
  key: string;
  label: string;
  description: string;
}
export interface TranscriptPlayback {
  segmentIndex: number;
  statementIndex: number;
  paragraphIndex: number;
  sentenceIndex: number;
  wordIndex: number;
}

/** Native-safe identity display shared by web badges and native speaker expanders.
 * The caller resolves fallback/affiliation translations and supplies only public attribution.
 */
export function getTranscriptSpeakerDisplay(
  info: TranscriptSpeaker | null | undefined,
  affiliationName: string | null | undefined,
  fallback: string,
): {
  affiliation: string | null;
  group: string | null;
  function: string | null;
  fallback: string | null;
} {
  const affiliation = info?.affiliation
    ? affiliationName || info.affiliation
    : null;
  const group = info?.group || null;
  const role =
    info?.function &&
    info.function.toLowerCase() !== "representative" &&
    !/^speaker\s/i.test(info.function)
      ? info.function
      : null;
  return {
    affiliation,
    group,
    function: role,
    fallback: !affiliation && !group && !role ? fallback : null,
  };
}

/** Adapted from transcripts/lib/transcript-formatting.ts. Invalid timestamps have no display. */
export function formatTimecode(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${secs}`
    : `${minutes}:${secs}`;
}
export function formatTimecodeMs(ms: number | null | undefined): string {
  return formatTimecode(ms == null ? ms : ms / 1000);
}

/** Preserve turn_id from the public API so separate anonymous turns never merge. */
export function buildSpeakerSegments(
  statements: TranscriptStatement[],
  mapping: TranscriptSpeakerMapping,
): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  let identity: string | undefined;
  statements.forEach((statement, index) => {
    const info = mapping[String(index)];
    const nextIdentity = JSON.stringify(
      info
        ? [info.turn_id, info.affiliation, info.group, info.function]
        : [index],
    );
    const previous = segments[segments.length - 1];
    if (previous && identity === nextIdentity)
      previous.statementIndices.push(index);
    else {
      const start =
        statement.paragraphs[0]?.sentences[0]?.start ?? statement.start;
      segments.push({
        speaker: nextIdentity,
        statementIndices: [index],
        timestamp: Number.isFinite(start) && start >= 0 ? start / 1000 : null,
      });
    }
    identity = nextIdentity;
  });
  return segments;
}
export function segmentHasTopic(
  segment: TranscriptSegment,
  statements: TranscriptStatement[],
  topic: string,
): boolean {
  return segment.statementIndices.some((index) =>
    statements[index]?.paragraphs.some((paragraph) =>
      paragraph.sentences.some((sentence) =>
        sentence.topic_keys?.includes(topic),
      ),
    ),
  );
}

/** Derive highlighting from the video clock without requiring a particular player. */
export function getTranscriptPlayback(
  statements: TranscriptStatement[],
  segments: TranscriptSegment[],
  seconds: number,
): TranscriptPlayback {
  const result: TranscriptPlayback = {
    segmentIndex: -1,
    statementIndex: -1,
    paragraphIndex: -1,
    sentenceIndex: -1,
    wordIndex: -1,
  };
  if (!Number.isFinite(seconds) || seconds < 0) return result;
  const ms = seconds * 1000;
  statements.some((statement, statementIndex) => {
    return statement.paragraphs.some((paragraph, paragraphIndex) =>
      paragraph.sentences.some((sentence, sentenceIndex) => {
        if (ms < sentence.start || ms >= sentence.end) return false;
        Object.assign(result, {
          statementIndex,
          paragraphIndex,
          sentenceIndex,
          segmentIndex: segments.findIndex((segment) =>
            segment.statementIndices.includes(statementIndex),
          ),
          wordIndex:
            sentence.words?.findIndex(
              (word) => ms >= word.start && ms < word.end,
            ) ?? -1,
        });
        return true;
      }),
    );
  });
  return result;
}
export { weaveSentenceParts } from "./transcript-weave";
