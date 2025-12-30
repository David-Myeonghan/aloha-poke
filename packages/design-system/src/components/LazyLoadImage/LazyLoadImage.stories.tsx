import type { Meta, StoryObj } from "@storybook/react";
import { LazyLoadImage } from "./LazyLoadImage";

const meta: Meta<typeof LazyLoadImage> = {
  title: "Components/LazyLoadImage",
  component: LazyLoadImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    imageSource: {
      control: "text",
    },
    alt: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSource: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    alt: "Pikachu",
    style: { width: "200px", height: "200px" },
  },
};

export const WithCustomSize: Story = {
  args: {
    imageSource: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    alt: "Charizard",
    style: { width: "300px", height: "300px" },
  },
};

export const MultipleImages: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <LazyLoadImage
        imageSource="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        alt="Bulbasaur"
        style={{ width: "150px", height: "150px" }}
      />
      <LazyLoadImage
        imageSource="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
        alt="Charmander"
        style={{ width: "150px", height: "150px" }}
      />
      <LazyLoadImage
        imageSource="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
        alt="Squirtle"
        style={{ width: "150px", height: "150px" }}
      />
    </div>
  ),
};
