import { ButtonHTMLAttributes } from "react";

function Button({
  children,
  onClick,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`py-2 px-4 bg-blue-500 text-white rounded ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
