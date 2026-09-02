import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { SignInCard, type SignInCardLabels } from "../components/sign-in-card";

const en: SignInCardLabels = {
  title: "Sign in",
  intro: "Enter your UN entity email address to receive a sign-in link.",
  emailLabel: "Email address",
  emailPlaceholder: "your.name@un.org",
  submit: "Send sign-in link",
  submitting: "Sending…",
  sentTitle: "Please check your email",
  sentBody: "We have sent a sign-in link to",
  sentHint: "If it hasn't arrived in a minute, check your spam folder.",
};

const meta = {
  title: "UI Elements/SignInCard",
  component: SignInCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Magic-link sign-in, the estate's largest remaining duplication — the flow originates in the boilerplate's auth branch and now runs in transcripts, housekeeping, un80-actions and focal-points. Comparing them, the ONLY difference between the boilerplate and housekeeping is the name and import path of the server action; the presentational code is identical. So this takes an `onSubmit` prop instead of importing one, which also means it renders here with no database and no .env. The accessibility wiring (aria-live, aria-invalid, aria-describedby) comes from transcripts, the one copy that has it.",
      },
    },
  },
  args: { labels: en },
} satisfies Meta<typeof SignInCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const never = async () => new Promise<{ success: boolean }>(() => {});
const ok = async () => ({ success: true });
const fail = async () => ({
  success: false,
  error: "That address isn't on an approved UN entity domain.",
});

/** Type an address and submit to walk the whole flow. */
export const Default: Story = { args: { onSubmit: ok } };

/** Submitting never resolves, so the button stays in its pending state. */
export const Loading: Story = { args: { onSubmit: never } };

/**
 * The confirmation replaces the form rather than sitting beside it — the next
 * action is in the reader's inbox, not on this page. Submit to see it.
 */
export const Sent: Story = { args: { onSubmit: ok } };

/**
 * Failure. The message is tied to the field with `aria-describedby` and the
 * input is marked `aria-invalid`, so a screen reader reaching the input hears
 * what is wrong — the three copies without this wiring show the message to
 * sighted users only. Submit to see it.
 */
export const Error: Story = { args: { onSubmit: fail } };

/** Nothing is hardcoded — the same component, in French. */
export const French: Story = {
  args: {
    onSubmit: ok,
    labels: {
      title: "Connexion",
      intro: "Saisissez l'adresse électronique de votre entité pour recevoir un lien de connexion.",
      emailLabel: "Adresse électronique",
      emailPlaceholder: "prenom.nom@un.org",
      submit: "Envoyer le lien",
      submitting: "Envoi…",
      sentTitle: "Consultez votre messagerie",
      sentBody: "Nous avons envoyé un lien de connexion à",
      sentHint: "S'il n'arrive pas, vérifiez vos courriers indésirables.",
    },
  },
};
