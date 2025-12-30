import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["t1", "t2", "t3", "t4"],
    },
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "p", "span"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const T1: Story = {
  args: {
    children: "Typography T1 (32px/44px, Bold)",
    size: "t1",
    as: "h1",
  },
};

export const T2: Story = {
  args: {
    children: "Typography T2 (24px/34px, Bold)",
    size: "t2",
    as: "h2",
  },
};

export const T3: Story = {
  args: {
    children: "Typography T3 (18px/28px, SemiBold)",
    size: "t3",
    as: "h3",
  },
};

export const T4: Story = {
  args: {
    children: "Typography T4 (16px/24px, Regular)",
    size: "t4",
    as: "p",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Typography size="t1" as="h1">T1 - 제목 스타일</Typography>
      <Typography size="t2" as="h2">T2 - 부제목 스타일</Typography>
      <Typography size="t3" as="h3">T3 - 섹션 제목 스타일</Typography>
      <Typography size="t4" as="p">T4 - 본문 스타일</Typography>
    </div>
  ),
};
