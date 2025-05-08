import { InputHTMLAttributes } from "react";

export function TextArea({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <TextArea
      className={`
        input-text
       ${className}
      `}
      {...rest}
    />
  );
}
