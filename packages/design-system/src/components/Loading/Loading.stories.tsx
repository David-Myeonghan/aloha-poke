import type { Meta, StoryObj } from "@storybook/react";
import { Loading } from "./Loading";

const meta: Meta<typeof Loading> = {
  title: "Components/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    size: "medium",
  },
};

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <div style={{ textAlign: "center" }}>
        <Loading size="small" />
        <p style={{ marginTop: "8px" }}>Small</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Loading size="medium" />
        <p style={{ marginTop: "8px" }}>Medium</p>
      </div>
    </div>
  ),
};
