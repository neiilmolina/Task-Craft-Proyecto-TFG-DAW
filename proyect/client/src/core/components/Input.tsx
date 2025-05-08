import { InputHTMLAttributes } from "react";

function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        p-2.5
        bg-white
        border-secondary border-2 rounded-4xl
        focus:outline-offset-1 focus:outline-primary ${className}
      `}
      {...rest}
    />
  );
}

export default Input;
