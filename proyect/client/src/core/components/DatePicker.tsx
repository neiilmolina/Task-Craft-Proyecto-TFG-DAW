import { InputHTMLAttributes } from "react";

export default function DatePicker({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="date"
      className={`
        input-text
        ${className}
      `}
      {...rest}
    />
  );
}
