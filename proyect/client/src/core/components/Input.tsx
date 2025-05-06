import { InputHTMLAttributes } from "react";

function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={`border-secondary border-2 rounded-lg bg-white focus:border-primary ${className}`}
    />
  );
}

export default Input;
