export const typography = {
  t1: {
    fontSize: "32px",
    lineHeight: "44px",
    fontWeight: 700,
  },
  t2: {
    fontSize: "24px",
    lineHeight: "34px",
    fontWeight: 700,
  },
  t3: {
    fontSize: "18px",
    lineHeight: "28px",
    fontWeight: 600,
  },
  t4: {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 400,
  },
} as const;

export type Typography = typeof typography;
export type TypographySize = keyof Typography;
