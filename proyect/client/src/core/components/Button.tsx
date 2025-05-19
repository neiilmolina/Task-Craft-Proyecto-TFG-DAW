import { ButtonHTMLAttributes, ReactNode } from "react";

const BUTTON_COLORS = {
  error: {
    base: "bg-error",
    hover: "hover:bg-error/80",
  },
  primary: {
    base: "bg-secondary",
    hover: "hover:bg-primary",
  },
} as const;

type ButtonColor = keyof typeof BUTTON_COLORS;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /**
   * Color del botón
   * @default 'primary'
   */
  color?: ButtonColor;
  className?: string;
}

function Button({
  children,
  color = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  const colorClasses = BUTTON_COLORS[color];

  return (
    <button
      className={`
        py-2 px-4 
        max-w-28
        rounded-2xl
        transition-colors duration-200
        cursor-pointer
        ${colorClasses.base}
        ${colorClasses.hover}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
