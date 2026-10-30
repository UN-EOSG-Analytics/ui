/** Official footer copy centralized from the localized un.org footer used by
 * UN Transcripts. Product-specific links/copy remain optional caller overrides.
 * Accessibility descriptions are localized UI copy, not quotations from un.org.
 */
export type FooterLocale = "en" | "fr" | "es" | "ar" | "ru" | "zh";
export type FooterLinkKey =
  | "siteIndex"
  | "contact"
  | "copyright"
  | "faq"
  | "fraudAlert"
  | "privacyNotice"
  | "termsOfUse";
export interface FooterLabels {
  home: string;
  donate: string;
  socialNavigation?: string;
  linksNavigation?: string;
  newTab: string;
  links: Record<FooterLinkKey, string>;
}
export const officialFooterLabels: Readonly<
  Record<FooterLocale, FooterLabels>
> = {
  en: {
    home: "United Nations",
    donate: "Donate",
    socialNavigation: "Social media",
    linksNavigation: "United Nations links",
    newTab: "opens in a new tab",
    links: {
      siteIndex: "A-Z Site Index",
      contact: "Contact",
      copyright: "Copyright",
      faq: "FAQ",
      fraudAlert: "Fraud Alert",
      privacyNotice: "Privacy Notice",
      termsOfUse: "Terms of Use",
    },
  },
  fr: {
    home: "Nations Unies",
    donate: "Faites un don",
    socialNavigation: "Réseaux sociaux",
    linksNavigation: "Liens des Nations Unies",
    newTab: "ouvre dans un nouvel onglet",
    links: {
      siteIndex: "Index de A à Z",
      contact: "Contactez-nous",
      copyright: "Droits d'auteur",
      faq: "FAQ",
      fraudAlert: "Courriers frauduleux",
      privacyNotice: "Confidentialité de l'information",
      termsOfUse: "Conditions d'utilisation",
    },
  },
  es: {
    home: "Naciones Unidas",
    donate: "Donaciones",
    socialNavigation: "Redes sociales",
    linksNavigation: "Enlaces de las Naciones Unidas",
    newTab: "se abre en una pestaña nueva",
    links: {
      siteIndex: "Índice del sitio",
      contact: "Comuníquese con nosotros",
      copyright: "Propiedad intelectual",
      faq: "Preguntas Frecuentes",
      fraudAlert: "Alerta de fraude",
      privacyNotice: "Privacidad",
      termsOfUse: "Condiciones de utilización",
    },
  },
  ar: {
    home: "الأمم المتحدة",
    donate: "تبرعوا",
    socialNavigation: "وسائل التواصل الاجتماعي",
    linksNavigation: "روابط الأمم المتحدة",
    newTab: "يفتح في علامة تبويب جديدة",
    links: {
      siteIndex: "دليل الموقع",
      contact: "اتصل بنا",
      copyright: "حقوق النشر والطبع",
      faq: "أسئلة شائعة",
      fraudAlert: "تحذير من عمليات إحتيال",
      privacyNotice: "بيان الخصوصيات",
      termsOfUse: "شروط الإستخدام",
    },
  },
  ru: {
    home: "Организация Объединённых Наций",
    donate: "Пожертвования",
    socialNavigation: "Социальные сети",
    linksNavigation: "Ссылки Организации Объединённых Наций",
    newTab: "открывается в новой вкладке",
    links: {
      siteIndex: "Указатель",
      contact: "Наш адрес",
      copyright: "© ООН",
      faq: "Часто задаваемые вопросы",
      fraudAlert: "Остерегайтесь мошенничества",
      privacyNotice: "Конфиденциальность",
      termsOfUse: "Условия пользования",
    },
  },
  zh: {
    home: "联合国",
    donate: "捐款",
    socialNavigation: "社交媒体",
    linksNavigation: "联合国链接",
    newTab: "在新标签页中打开",
    links: {
      siteIndex: "网址索引",
      contact: "联系我们",
      copyright: "版权所有",
      faq: "常见问题解答",
      fraudAlert: "提防诈骗",
      privacyNotice: "隐私通告",
      termsOfUse: "使用条款",
    },
  },
};
/** Accepts the same six locale codes as SiteFooter; unknown locales use English. */
export function getFooterLabels(locale = "en"): FooterLabels {
  return (
    officialFooterLabels[locale as FooterLocale] ?? officialFooterLabels.en
  );
}
