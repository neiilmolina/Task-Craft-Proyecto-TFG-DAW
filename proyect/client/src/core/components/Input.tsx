import { InputHTMLAttributes } from "react";

function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        input-text
       ${className}
      `}
      {...rest}
    />
  );
}

export default Input;
