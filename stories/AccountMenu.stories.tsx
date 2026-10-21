import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Building2 } from "lucide-react";
import {
  AccountMenu,
  AccountSection,
  type AccountMenuLabels,
} from "../components/account-menu";
import { SiteHeader } from "../components/site-header";

const labels: AccountMenuLabels = {
  accountMenu: "Account menu",
  signedInAs: "Signed in as",
  signOut: "Sign out",
  signingOut: "Signing out…",
  signOutError: "Could not sign out. Please try again.",
};
const meta = {
  title: "Page Structure/LoginSystem/AccountMenu",
  component: AccountMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Account controls promoted from transcripts. The UI library owns the initials trigger, identity details, optional entity/role and actions, plus keyboard behavior and sign-out feedback. Applications supply session data, translated labels and callbacks. AccountSection reuses the content inside existing mobile navigation.",
      },
    },
  },
  args: { email: "david.pomerenke@un.org", labels, onSignOut: async () => {} },
} satisfies Meta<typeof AccountMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Transcripts: Story = {};
export const Housekeeping: Story = {
  args: {
    entity: { label: "Entity", value: "Ethics Office" },
    role: { label: "Role", value: "Reviewer" },
    actions: [
      {
        id: "change-entity",
        label: "Change entity",
        icon: <Building2 />,
        onSelect: () => {},
      },
    ],
  },
};
export const WithoutEntity: Story = {
  args: { role: { label: "Role", value: "Reviewer" } },
};
export const LongDetails: Story = {
  args: {
    email: "a.very.long.account.address.with.many.parts@example.un.org",
    entity: {
      label: "Entity",
      value: "Department of Management Strategy, Policy and Compliance",
    },
    role: { label: "Role", value: "Reviewer" },
  },
};
export const SigningOut: Story = {
  args: { onSignOut: () => new Promise<void>(() => {}) },
};
export const SignOutError: Story = {
  args: {
    onSignOut: async () => {
      throw new Error("Offline");
    },
  },
};
export const MobileSection: Story = {
  ...Housekeeping,
  render: (args) => (
    <div className="w-64 max-w-full rounded-lg border border-border p-2">
      <AccountSection {...args} />
    </div>
  ),
};
export const InHeader: Story = {
  ...Housekeeping,
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <SiteHeader
      brand="Mandate"
      descriptor="Housekeeping Platform"
      homeLabel="Mandate Housekeeping Platform — home"
      showMobileMenu={false}
      navItems={[
        { href: "#analysis", label: "Analysis" },
        { href: "#about", label: "About" },
      ]}
    >
      <AccountMenu {...args} />
    </SiteHeader>
  ),
};
export const French: Story = {
  args: {
    labels: {
      accountMenu: "Menu du compte",
      signedInAs: "Connecté en tant que",
      signOut: "Déconnexion",
      signingOut: "Déconnexion en cours…",
      signOutError: "Impossible de se déconnecter. Réessayez.",
    },
  },
};
export const Arabic: Story = {
  args: {
    dir: "rtl",
    entity: { label: "الجهة", value: "مكتب الأخلاقيات" },
    role: { label: "الدور", value: "مراجع" },
    labels: {
      accountMenu: "قائمة الحساب",
      signedInAs: "تم تسجيل الدخول باسم",
      signOut: "تسجيل الخروج",
      signingOut: "جارٍ تسجيل الخروج…",
      signOutError: "تعذّر تسجيل الخروج. يرجى المحاولة مرة أخرى.",
    },
  },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};
