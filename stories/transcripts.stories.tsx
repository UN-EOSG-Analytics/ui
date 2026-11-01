import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo, useState } from "react";
import {
  TranscriptContent,
  TranscriptReader,
  TranscriptSpeakerBadges,
  TranscriptSpeakerIndex,
  TranscriptTopics,
  buildSpeakerSegments,
  getTranscriptPlayback,
  type TranscriptLabels,
  type TranscriptStatement,
  type TranscriptSpeakerMapping,
} from "../components/transcripts";
import { typography } from "../lib/typography";

const meta = {
  title: "Transcripts/Reader",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Read-only displays extracted from united-nations/transcripts at e88f846. Hosts supply public attribution, translated labels, content, video player and clock. Sentence and word timings use milliseconds; onSeek and video clocks use seconds. No authentication or generation controls. The slider in these stories simulates a host video clock.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const messages = {
  en: {
    transcript: "Transcript",
    speakers: "Speakers",
    topics: "Topics",
    empty: "No statements to display.",
    allTopics: "All topics",
    speaker: (n: number) => `Speaker ${n}`,
    seek: (n: number) => `Play from ${n} seconds`,
  },
  fr: {
    transcript: "Transcription",
    speakers: "Intervenants",
    topics: "Thèmes",
    empty: "Aucune intervention à afficher.",
    allTopics: "Tous les thèmes",
    speaker: (n: number) => `Intervenant ${n}`,
    seek: (n: number) => `Lire à partir de ${n} secondes`,
  },
  es: {
    transcript: "Transcripción",
    speakers: "Oradores",
    topics: "Temas",
    empty: "No hay intervenciones que mostrar.",
    allTopics: "Todos los temas",
    speaker: (n: number) => `Orador ${n}`,
    seek: (n: number) => `Reproducir desde ${n} segundos`,
  },
  ru: {
    transcript: "Стенограмма",
    speakers: "Ораторы",
    topics: "Темы",
    empty: "Нет выступлений для отображения.",
    allTopics: "Все темы",
    speaker: (n: number) => `Оратор ${n}`,
    seek: (n: number) => `Воспроизвести с отметки ${n} с`,
  },
  zh: {
    transcript: "文字记录",
    speakers: "发言者",
    topics: "主题",
    empty: "没有可显示的发言。",
    allTopics: "所有主题",
    speaker: (n: number) => `发言者${n}`,
    seek: (n: number) => `从第${n}秒播放`,
  },
  ar: {
    transcript: "النص المكتوب",
    speakers: "المتكلمون",
    topics: "المواضيع",
    empty: "لا توجد بيانات لعرضها.",
    allTopics: "جميع المواضيع",
    speaker: (n: number) => `المتكلم ${n}`,
    seek: (n: number) => `التشغيل من الثانية ${n}`,
  },
} satisfies Record<string, TranscriptLabels>;
const statements: TranscriptStatement[] = [
  {
    start: 0,
    end: 10000,
    paragraphs: [
      {
        start: 0,
        end: 10000,
        sentences: [
          {
            text: "We reaffirm our commitment to international cooperation.",
            start: 0,
            end: 5000,
            topic_keys: ["cooperation"],
            words: [
              { text: "We", start: 0, end: 700 },
              { text: "reaffirm", start: 700, end: 1400 },
              { text: "mismatched-provider-token", start: 1400, end: 1800 },
              { text: "commitment", start: 1800, end: 3000 },
            ],
          },
          {
            text: "The meeting will now hear the next speaker.",
            start: 5000,
            end: 10000,
          },
        ],
      },
    ],
  },
  {
    start: 12000,
    end: 20000,
    paragraphs: [
      {
        start: 12000,
        end: 20000,
        sentences: [
          {
            text: "We must strengthen the protection of civilians.",
            start: 12000,
            end: 20000,
            topic_keys: ["protection"],
          },
        ],
      },
    ],
  },
  {
    start: 22000,
    end: 28000,
    paragraphs: [
      {
        start: 22000,
        end: 28000,
        sentences: [
          { text: "Thank you, Madam President.", start: 22000, end: 28000 },
        ],
      },
    ],
  },
];
const speakerMappings: TranscriptSpeakerMapping = {
  "0": {
    affiliation: "FR",
    group: null,
    function: "representative",
    turn_id: 0,
  },
  "1": {
    affiliation: "KE",
    group: "African Group",
    function: null,
    turn_id: 1,
  },
};
const countryNames = new Map([
  ["FR", "France"],
  ["KE", "Kenya"],
]);
const topics = [
  {
    key: "cooperation",
    label: "International cooperation",
    description: "Multilateral dialogue and collective action.",
  },
  {
    key: "protection",
    label: "Protection of civilians",
    description: "Civilian protection in armed conflict.",
  },
];

function Demo({
  locale = "en",
  collapsible = false,
  empty = false,
}: {
  locale?: keyof typeof messages;
  collapsible?: boolean;
  empty?: boolean;
}) {
  const [seconds, setSeconds] = useState(0);
  const [topic, setTopic] = useState<string | null>(null);
  const labels = messages[locale];
  const content = empty
    ? []
    : locale === "ar"
      ? [
          {
            start: 0,
            end: 10000,
            paragraphs: [
              {
                start: 0,
                end: 10000,
                sentences: [
                  {
                    text: "نؤكد من جديد التزامنا بالتعاون الدولي وحماية المدنيين.",
                    start: 0,
                    end: 10000,
                    topic_keys: ["cooperation"],
                  },
                ],
              },
            ],
          },
        ]
      : statements;
  const segments = useMemo(
    () => buildSpeakerSegments(content, speakerMappings),
    [content],
  );
  const playback = getTranscriptPlayback(content, segments, seconds);
  const props = {
    statements: content,
    segments,
    speakerMappings,
    countryNames:
      locale === "ar"
        ? new Map([
            ["FR", "فرنسا"],
            ["KE", "كينيا"],
          ])
        : countryNames,
    labels,
    playback,
    onSeek: setSeconds,
    selectedTopic: topic,
  };
  const localizedTopics =
    locale === "ar"
      ? [
          {
            key: "cooperation",
            label: "التعاون الدولي",
            description: "الحوار المتعدد الأطراف والعمل الجماعي.",
          },
        ]
      : topics;
  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      className={collapsible ? "max-w-sm" : "max-w-6xl"}
    >
      <TranscriptReader
        video={
          <label className={typography.body}>
            {labels.seek(seconds)}
            <input
              aria-label={labels.transcript}
              type="range"
              min={0}
              max={28}
              step={0.1}
              value={seconds}
              onChange={(event) => setSeconds(Number(event.target.value))}
              className="block w-full"
            />
          </label>
        }
        navigation={
          collapsible ? undefined : (
            <>
              <h2 className={typography.subTitle}>{labels.speakers}</h2>
              <TranscriptSpeakerIndex {...props} />
              <h2 className={typography.subTitle}>{labels.topics}</h2>
              <TranscriptTopics
                topics={localizedTopics}
                selectedTopic={topic}
                onSelectTopic={setTopic}
                labels={labels}
              />
            </>
          )
        }
      >
        <TranscriptContent {...props} collapsible={collapsible} />
      </TranscriptReader>
    </div>
  );
}
export const Desktop: Story = { render: () => <Demo /> };
export const ExpandableTurns: Story = { render: () => <Demo collapsible /> };
export const French: Story = { render: () => <Demo locale="fr" empty /> };
export const ArabicRTL: Story = { render: () => <Demo locale="ar" /> };
export const Empty: Story = { render: () => <Demo empty /> };
export const SixLanguages: Story = {
  render: () => (
    <div className="space-y-6">
      {(Object.keys(messages) as Array<keyof typeof messages>).map((locale) => (
        <div key={locale} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
          <h2 className={typography.subTitle}>{messages[locale].speakers}</h2>
          <TranscriptSpeakerBadges fallback={messages[locale].speaker(1)} />
        </div>
      ))}
    </div>
  ),
};
