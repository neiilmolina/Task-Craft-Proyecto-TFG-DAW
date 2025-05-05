import { SelectHTMLAttributes } from "react";

function Select({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`py-2 px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}

export default Select;
