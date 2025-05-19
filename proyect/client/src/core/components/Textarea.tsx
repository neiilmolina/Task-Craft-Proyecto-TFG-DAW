import { TextareaHTMLAttributes } from "react";

export function TextArea({
  className = "",
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`input-text ${className}`} {...rest} />;
}
