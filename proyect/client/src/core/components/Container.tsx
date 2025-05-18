import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

function Container({ className = "", children, ...rest }: ContainerProps) {
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
