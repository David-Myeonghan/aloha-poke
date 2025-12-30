import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "massive"],
    },
    color: {
      control: "select",
      options: ["primary", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    size: "medium",
    color: "primary",
  },
};

export const Error: Story = {
  args: {
    children: "Error Button",
    size: "medium",
    color: "error",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "small",
    color: "primary",
  },
};

export const Massive: Story = {
  args: {
    children: "Massive Button",
    size: "massive",
    color: "primary",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    size: "medium",
    color: "primary",
    disabled: true,
  },
};
