import { InputHTMLAttributes } from "react";

export default function TimePicker({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="time"
      className={`
        input-text
        ${className}
      `}
      {...rest}
    />
  );
}
