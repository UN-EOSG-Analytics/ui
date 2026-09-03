import type { ImgHTMLAttributes } from "react";

import { normalizeUnLocale } from "../lib/un-links";

export const UN_EMBLEM_SRC = new URL(
  "../assets/un-emblem-colour.svg",
  import.meta.url,
).toString();

const WORDMARK_SOURCES = {
  ar: new URL("../assets/un-logo-ar-reverse.svg", import.meta.url).toString(),
  en: new URL("../assets/un-logo-en-reverse.svg", import.meta.url).toString(),
  es: new URL("../assets/un-logo-es-reverse.svg", import.meta.url).toString(),
  fr: new URL("../assets/un-logo-fr-reverse.svg", import.meta.url).toString(),
  ru: new URL("../assets/un-logo-ru-reverse.svg", import.meta.url).toString(),
  zh: new URL("../assets/un-logo-zh-reverse.svg", import.meta.url).toString(),
} as const;

type ReverseWordmarkLocale = keyof typeof WORDMARK_SOURCES;

export interface UnEmblemProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src"> {
  /** Optional source override for exceptional hosts. The default is bundled. */
  src?: string;
}

export interface UnReverseWordmarkProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src"> {
  /** Active UN locale. Unknown values fall back to English. */
  locale?: string;
}

/** Official UN emblem, bundled by default so consumers do not need public assets. */
export function UnEmblem({
  src = UN_EMBLEM_SRC,
  draggable = false,
  ...props
}: UnEmblemProps) {
  return <img src={src} alt="" draggable={draggable} {...props} />;
}

/** Official per-locale reverse UN lockups, bundled as package assets. */
export function UnReverseWordmark({
  locale,
  draggable = false,
  ...props
}: UnReverseWordmarkProps) {
  const lang = normalizeUnLocale(locale) as ReverseWordmarkLocale;

  return (
    <img
      src={WORDMARK_SOURCES[lang] ?? WORDMARK_SOURCES.en}
      alt=""
      draggable={draggable}
      {...props}
    />
  );
}
