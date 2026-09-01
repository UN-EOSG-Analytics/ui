import * as React from "react";
import { cn } from "../lib/utils";
import { ExternalLink } from "./external-link";
import { SOCIAL_LABELS, SocialIcon, type SocialNetwork } from "./social-icons";
import { unUrl, normalizeUnLocale } from "./un-links";

/**
 * The official www.un.org footer.
 *
 * A pixel replica: 4px UN Blue rule, #333 panel, per-locale reverse lockup,
 * per-locale social accounts, Donate button, 3px-pipe separated links. The
 * markup was scraped from un.org/{locale}/ and the dimensions and colours were
 * read from the live site's computed styles — they are measured facts about
 * the official footer, not choices, which is why they are literals here rather
 * than theme tokens.
 *
 * This is the single most duplicated component in the estate: all seven
 * products have a footer, under two different names, and only one of them is
 * the real thing. Extracted from transcripts.
 *
 * It also carries compliance weight. The UN Multilingualism Web Standards
 * require footer content to read in the active locale (req #9) and a
 * reciprocal back-link to un.org in the same language (req #12) — the lockup
 * doubles as that link.
 */

export type FooterLinkKey =
  | "siteIndex"
  | "contact"
  | "copyright"
  | "faq"
  | "fraudAlert"
  | "privacyNotice"
  | "termsOfUse";

const LINK_PATHS: Record<FooterLinkKey, string> = {
  siteIndex: "site-index",
  contact: "contact-us-0",
  copyright: "about-us/copyright",
  faq: "about-us/frequently-asked-questions",
  fraudAlert: "about-us/fraud-alert",
  privacyNotice: "about-us/privacy-notice",
  termsOfUse: "about-us/terms-of-use",
};

const DEFAULT_LINK_ORDER: FooterLinkKey[] = [
  "siteIndex", "contact", "copyright", "faq",
  "fraudAlert", "privacyNotice", "termsOfUse",
];

/**
 * un.org alphabetizes the bottom links per locale — fr and es sort by their
 * *translated* labels. en is already alphabetical; ar/zh/ru keep the English
 * semantic order.
 */
const LINK_ORDER: Partial<Record<string, FooterLinkKey[]>> = {
  fr: ["termsOfUse", "privacyNotice", "contact", "fraudAlert", "copyright", "faq", "siteIndex"],
  es: ["fraudAlert", "contact", "termsOfUse", "faq", "privacyNotice", "copyright", "siteIndex"],
};

/** Each un.org locale links its own accounts. The Chinese edition shows none. */
const SOCIAL_ACCOUNTS: Record<string, [SocialNetwork, string][]> = {
  en: [
    ["facebook", "https://www.facebook.com/unitednations"],
    ["x", "https://twitter.com/un"],
    ["youtube", "https://www.youtube.com/unitednations"],
    ["flickr", "https://www.flickr.com/photos/un_photo/"],
    ["instagram", "https://www.instagram.com/unitednations"],
  ],
  fr: [
    ["facebook", "https://www.facebook.com/nationsunies/"],
    ["x", "https://twitter.com/onu_fr"],
    ["youtube", "https://www.youtube.com/user/onuenaction"],
    ["instagram", "https://www.instagram.com/nations_unies/"],
    ["flickr", "https://www.flickr.com/photos/un_photo/"],
  ],
  es: [
    ["facebook", "https://www.facebook.com/nacionesunidas"],
    ["x", "https://twitter.com/ONU_es"],
    ["youtube", "https://www.youtube.com/user/NacionesUnidasVideo"],
    ["instagram", "https://www.instagram.com/nacionesunidas/"],
    ["flickr", "https://www.flickr.com/photos/un_photo/"],
  ],
  ar: [
    ["youtube", "https://www.youtube.com/user/UNarabic"],
    ["x", "https://twitter.com/UNarabic"],
    ["facebook", "https://www.facebook.com/UnitedNationsArabic"],
    ["flickr", "https://www.flickr.com/photos/un_photo/"],
  ],
  ru: [
    ["facebook", "https://www.facebook.com/UnitedNationsRussian/"],
    ["x", "https://twitter.com/UnitedNationsRU"],
    ["youtube", "https://www.youtube.com/user/NationsRU"],
    ["flickr", "https://www.flickr.com/photos/un_photo/"],
  ],
  zh: [],
};

/**
 * Official per-locale lockups (emblem + localized wordmark, white), vendored
 * from un.org's bootstrap_un2 theme. All share a 91.1-unit intrinsic height;
 * un.org renders them 52px tall, so display width = round(w / 91.1 × 52).
 */
const LOGO_WIDTHS: Record<string, number> = {
  en: 170, fr: 171, es: 192, ar: 165, zh: 194, ru: 177,
};

export interface FooterLabels {
  /** Accessible name for the lockup back-link to un.org. */
  home: string;
  donate: string;
  newTab: string;
  links: Record<FooterLinkKey, string>;
}

export interface SiteFooterProps {
  /** Active UI locale. Unknown values fall back to English. */
  locale?: string;
  /** Translated strings. Everything visible arrives here. */
  labels: FooterLabels;
  /** Extra links appended to the bottom row — e.g. an /llms.txt index. */
  extraLinks?: { label: string; href: string }[];
  /** Where the lockup SVGs live. Override when served from a subpath. */
  logoBasePath?: string;
  containerClassName?: string;
  className?: string;
}

export function SiteFooter({
  locale = "en",
  labels,
  extraLinks = [],
  logoBasePath = "/images",
  containerClassName = "max-w-4xl px-4 sm:px-8 lg:max-w-6xl",
  className,
}: SiteFooterProps) {
  const lang = normalizeUnLocale(locale);
  const social = SOCIAL_ACCOUNTS[lang] ?? SOCIAL_ACCOUNTS.en;
  const order = LINK_ORDER[lang] ?? DEFAULT_LINK_ORDER;
  const logoWidth = LOGO_WIDTHS[lang] ?? LOGO_WIDTHS.en;

  return (
    <footer
      className={cn("mt-auto border-t-4 border-un-blue bg-[#333333] text-white", className)}
    >
      <div className={cn("mx-auto pt-8 pb-[33px]", containerClassName)}>
        <div className="flex flex-wrap items-center gap-y-6">
          {/* The lockup is also the reciprocal back-link to un.org in the
              active language — Multilingualism Web Standards req #12. */}
          <ExternalLink
            href={unUrl("", lang)}
            aria-label={labels.home}
            newTabLabel={labels.newTab}
            className="shrink-0 transition-opacity hover:opacity-80"
          >
            <img
              src={`${logoBasePath}/un-logo-${lang}-reverse.svg`}
              alt=""
              width={logoWidth}
              height={52}
              className="h-[52px] w-auto select-none"
            />
          </ExternalLink>

          <div className="ms-auto flex items-center ps-4">
            {social.length > 0 && (
              <ul className="flex items-center gap-7">
                {social.map(([network, href]) => (
                  <li key={network}>
                    <ExternalLink
                      href={href}
                      aria-label={SOCIAL_LABELS[network]}
                      newTabLabel={labels.newTab}
                      className="text-[#c4c4c4] transition-colors hover:text-white"
                    >
                      <SocialIcon network={network} className="h-6 w-6" />
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            )}
            <ExternalLink
              href="https://www.un.org/en/donate"
              newTabLabel={labels.newTab}
              className="ms-7 inline-block rounded border border-un-blue bg-white px-5 pt-[9px] pb-[10px] text-xs leading-3 font-bold tracking-[1.27px] whitespace-nowrap text-[#454545] uppercase transition-colors hover:bg-[#e6e6e6]"
            >
              {labels.donate}
            </ExternalLink>
          </div>
        </div>

        <div aria-hidden className="mt-4 mb-[19px] border-t border-[#5b5b5b]" />

        <nav>
          <ul className="flex flex-wrap justify-end gap-y-2 text-xs leading-[14px] font-medium tracking-[0.77px] uppercase">
            {order.map((key) => (
              <li
                key={key}
                className="border-e-[3px] border-[#808080] ps-2.5 pe-[13px] last:border-e-0 last:pe-0"
              >
                <ExternalLink
                  href={unUrl(LINK_PATHS[key], lang)}
                  newTabLabel={labels.newTab}
                  className="hover:underline"
                >
                  {labels.links[key]}
                </ExternalLink>
              </li>
            ))}
            {extraLinks.map(({ label, href }) => (
              <li
                key={href}
                className="border-e-[3px] border-[#808080] ps-2.5 pe-[13px] last:border-e-0 last:pe-0"
              >
                <a href={href} className="hover:underline">{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
