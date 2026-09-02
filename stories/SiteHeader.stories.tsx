import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Globe, Landmark } from "lucide-react";
import { SiteHeader } from "../components/site-header";

/**
 * Under GitHub project Pages the site is served from `/<repo>/`, so a
 * root-absolute asset path 404s. Vite exposes the deployed base as
 * `import.meta.env.BASE_URL`, which is "/" in dev.
 */
const emblemSrc = `${import.meta.env.BASE_URL}images/un-emblem-colour.svg`.replace(
  "//images",
  "/images",
);

const meta = {
  title: "UI Elements/SiteHeader",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Extracted from transcripts and mandates, which had independently converged on the same lockup — same emblem size, same bold/light wordmark split, same badge. All copy arrives as props, so the component is multilingual-ready from day one.",
      },
    },
  },
  args: {
    brand: "United Nations",
    descriptor: "Mandate Source Registry",
    homeLabel: "Mandate Source Registry — home",
    href: "#",
    emblemSrc,
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const nav = [
  { href: "#secretariat", label: "UN Secretariat Mandates", icon: Landmark },
  { href: "#system", label: "UN System Mandates", icon: Globe },
];

/** The mandates configuration — the first real consumer. */
export const Default: Story = {
  args: { navItems: nav, activeHref: "#secretariat" },
};

/** With a status pill. transcripts ships this as "Public Preview". */
export const WithBadge: Story = {
  args: { navItems: nav, activeHref: "#secretariat", badge: "Public Preview" },
};

/**
 * The same component in French. Nothing is hardcoded — this is the whole point
 * of splitting the wordmark into `brand` + `descriptor` props rather than
 * passing one string.
 */
export const French: Story = {
  args: {
    brand: "Nations Unies",
    descriptor: "Registre des mandats",
    badge: "Aperçu public",
    homeLabel: "Registre des mandats — accueil",
    navItems: [
      { href: "#secretariat", label: "Mandats du Secrétariat", icon: Landmark },
      { href: "#system", label: "Mandats du système", icon: Globe },
    ],
    activeHref: "#secretariat",
  },
};

/**
 * Arabic, right-to-left. The component uses logical properties (`ms-auto`,
 * `end-4`) throughout, so the whole lockup mirrors without extra work.
 */
export const Arabic: Story = {
  args: {
    brand: "الأمم المتحدة",
    descriptor: "سجل الولايات",
    homeLabel: "سجل الولايات — الصفحة الرئيسية",
    navItems: [
      { href: "#secretariat", label: "ولايات الأمانة العامة", icon: Landmark },
      { href: "#system", label: "ولايات المنظومة", icon: Globe },
    ],
    activeHref: "#secretariat",
  },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};

/**
 * Outboard emblem: on very wide viewports the emblem tucks into the page
 * margin so the wordmark aligns with the main column. Widen the preview past
 * 1408px to see it move.
 */
export const OutboardEmblem: Story = {
  args: {
    navItems: nav,
    activeHref: "#system",
    emblemPlacement: "outboard",
    badge: "Public Preview",
  },
};

/** No nav — the minimum viable header. */
export const Minimal: Story = {
  args: { brand: "United Nations", descriptor: "Transcripts" },
};
