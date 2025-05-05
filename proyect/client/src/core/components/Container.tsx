import { HTMLProps } from "react";

function Container({
  className = "",
  children,
  ...rest
}: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Container;
