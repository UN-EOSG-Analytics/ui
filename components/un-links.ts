/**
 * External-link helpers that respect the active UI locale.
 *
 * The UN Multilingualism Web Standards require links out of the app to reach
 * the matching locale of the destination rather than dumping the reader on
 * English. un.org and webtv.un.org both publish all six official languages
 * under the same `/{locale}/...` scheme.
 *
 * `locale` takes any string so callers can pass their i18n hook straight in;
 * unknown values fall back to English, so a broken link is never produced.
 */
const UN_LOCALES = new Set(["ar", "zh", "en", "fr", "ru", "es"]);

export function normalizeUnLocale(locale: string | undefined): string {
  return locale && UN_LOCALES.has(locale) ? locale : "en";
}

/** Localize a www.un.org link. Pass a tail path, no leading locale segment. */
export function unUrl(path = "", locale?: string): string {
  const lang = normalizeUnLocale(locale);
  const tail = path.replace(/^\/+/, "");
  return tail ? `https://www.un.org/${lang}/${tail}` : `https://www.un.org/${lang}/`;
}

/** Localize a webtv.un.org link. */
export function webtvUrl(path = "", locale?: string): string {
  const lang = normalizeUnLocale(locale);
  const tail = path.replace(/^\/+/, "");
  return tail ? `https://webtv.un.org/${lang}/${tail}` : `https://webtv.un.org/${lang}/`;
}
