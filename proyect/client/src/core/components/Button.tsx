import { ButtonHTMLAttributes, ReactNode } from "react";
import { BUTTON_COLORS, ButtonColor } from "../interfaces/interfaceComponents";

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
        w-fit
        px-2
        py-1
        h-fit
        min-h-8
        rounded-xl
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
