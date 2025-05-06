import { HTMLProps } from "react";

function Container({
  className = "",
  children,
  ...rest
}: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`border-secondary border-2 rounded-lg p-4 bg-white ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Container;
