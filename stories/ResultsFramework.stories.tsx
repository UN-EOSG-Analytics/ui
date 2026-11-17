import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResultsFramework } from "../components/results-framework";
import { ResourceFundingBar } from "../components/resource-funding-bar";
import { ResourceActivityList } from "../components/resource-activity-list";

const resourceLabels = {
  required: "Required resources",
  available: "Available resources",
  spent: "Expenditure",
};
const meta = {
  title: "open.un.org/Cooperation Framework/Results",
  component: ResultsFramework,
  args: {
    labels: {
      ...resourceLabels,
      levels: ["Strategic priority", "Outcome", "Output"],
    },
    framework: [
      {
        id: 1,
        code: "1",
        name: "Inclusive services",
        required: 100,
        available: 80,
        spent: 60,
        children: [
          {
            id: 2,
            code: "1.1",
            name: "More people can access essential services",
            required: 100,
            available: 80,
            spent: 60,
            children: [
              {
                id: 3,
                code: "1.1.1",
                name: "Health services strengthened",
                required: 50,
                available: 40,
                spent: 30,
              },
            ],
          },
        ],
      },
    ],
  },
} satisfies Meta<typeof ResultsFramework>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Framework: Story = {};
export const Funding: Story = {
  render: () => (
    <ResourceFundingBar
      required={100}
      available={80}
      spent={60}
      labels={resourceLabels}
    />
  ),
};
export const SignedAdjustments: Story = {
  render: () => (
    <ResourceFundingBar
      required={100}
      available={120}
      spent={-5}
      labels={resourceLabels}
    />
  ),
};
export const Activities: Story = {
  render: () => (
    <ResourceActivityList
      activities={[
        {
          row_key: "1",
          agency: "UNDP",
          name: "Support inclusive services",
          description: "Example activity description.",
          required: 100,
          available: 80,
          spent: 60,
        },
      ]}
      resourceLabels={resourceLabels}
      showAllLabel="Show all activities"
    />
  ),
};
