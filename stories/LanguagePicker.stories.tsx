import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LanguagePicker, type LanguagePickerProps } from "../components/language-picker";

const options = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "ar", label: "العربية" },
  { value: "zh", label: "中文" },
  { value: "ru", label: "Русский" },
];

function ControlledPicker(props: LanguagePickerProps) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return <div dir={props.dir} className="flex min-h-64 items-start justify-end rounded-md border border-border bg-background p-8">
    <LanguagePicker {...props} value={value} onChange={next => {
      setValue(next);
      props.onChange(next);
    }} />
  </div>;
}

const meta = {
  title: "Page Structure/LanguagePicker",
  component: LanguagePicker,
  parameters: {
    docs: { description: { component: "The Transcripts header preference pill, controlled by the host. Native endonyms, full and compact triggers, pending state, keyboard menu navigation and explicit RTL direction. No router or translation dependency." } },
  },
  args: { options, value: "en", label: "Language", onChange: () => {} },
  render: args => <ControlledPicker {...args} />,
} satisfies Meta<typeof LanguagePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { compact: true } };
export const Pending: Story = { args: { pending: true } };
export const French: Story = { args: { value: "fr", label: "Langue" } };
export const ArabicRTL: Story = { args: { value: "ar", label: "اللغة", dir: "rtl" } };
export const CompactArabicRTL: Story = { args: { value: "ar", label: "اللغة", dir: "rtl", compact: true } };
export const Empty: Story = { args: { options: [] } };
