export const BUTTON_COLORS = {
  error: {
    base: "bg-error",
    hover: "hover:bg-error/80",
  },
  primary: {
    base: "bg-secondary",
    hover: "hover:bg-primary",
  },
  neutral: {
    base: "bg-greyDark",
    hover: "hover:bg-greyDark/80",
  },
} as const;

export type ButtonColor = keyof typeof BUTTON_COLORS;
