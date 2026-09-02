import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteFooter, type FooterLabels } from "../components/site-footer";

const logoBasePath = `${import.meta.env.BASE_URL}images`.replace("//images", "/images");

const en: FooterLabels = {
  home: "United Nations — un.org",
  donate: "Donate",
  newTab: "opens in new tab",
  links: {
    siteIndex: "Site index",
    contact: "Contact",
    copyright: "Copyright",
    faq: "FAQ",
    fraudAlert: "Fraud alert",
    privacyNotice: "Privacy notice",
    termsOfUse: "Terms of use",
  },
};

const fr: FooterLabels = {
  home: "Nations Unies — un.org",
  donate: "Faire un don",
  newTab: "ouvre dans un nouvel onglet",
  links: {
    siteIndex: "Index du site",
    contact: "Contact",
    copyright: "Droits d’auteur",
    faq: "FAQ",
    fraudAlert: "Alerte à la fraude",
    privacyNotice: "Avis de confidentialité",
    termsOfUse: "Conditions d’utilisation",
  },
};

const ar: FooterLabels = {
  home: "الأمم المتحدة — un.org",
  donate: "تبرع",
  newTab: "يفتح في علامة تبويب جديدة",
  links: {
    siteIndex: "فهرس الموقع",
    contact: "اتصل بنا",
    copyright: "حقوق النشر",
    faq: "الأسئلة الشائعة",
    fraudAlert: "تنبيه بشأن الاحتيال",
    privacyNotice: "إشعار الخصوصية",
    termsOfUse: "شروط الاستخدام",
  },
};

const meta = {
  title: "UI Elements/SiteFooter",
  component: SiteFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A pixel replica of the official www.un.org footer — markup scraped from un.org and dimensions read from the live site's computed styles. All seven products have a footer, under two different names, and only one was the real thing. It carries compliance weight too: the UN Multilingualism Web Standards require footer content in the active locale (req #9) and a reciprocal same-language back-link to un.org (req #12) — the lockup is that link.",
      },
    },
  },
  args: { labels: en, logoBasePath },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = { args: { locale: "en" } };

/**
 * French. Note the bottom links are in a *different order* — un.org
 * alphabetizes them by their translated labels, so the order is per-locale
 * data, not a sort at render time. The social accounts differ too: each
 * un.org edition links its own handles.
 */
export const French: Story = { args: { locale: "fr", labels: fr } };

/** Arabic, right-to-left. The whole footer mirrors via logical properties. */
export const Arabic: Story = {
  args: { locale: "ar", labels: ar },
  decorators: [(Story) => (<div dir="rtl"><Story /></div>)],
};

/**
 * Chinese. The Chinese edition of un.org shows **no** social accounts — the
 * row is simply absent, which is a fact about un.org rather than an oversight.
 */
export const Chinese: Story = {
  args: {
    locale: "zh",
    labels: {
      home: "联合国 — un.org",
      donate: "捐款",
      newTab: "在新标签页中打开",
      links: {
        siteIndex: "网站索引",
        contact: "联系我们",
        copyright: "版权",
        faq: "常见问题",
        fraudAlert: "欺诈警示",
        privacyNotice: "隐私声明",
        termsOfUse: "使用条款",
      },
    },
  },
};

/** With a product-specific link appended — here an agent-readable index. */
export const WithExtraLink: Story = {
  args: {
    locale: "en",
    extraLinks: [{ label: "llms.txt", href: "/llms.txt" }],
  },
};
