import { InputHTMLAttributes, useState } from "react";
import Input from "../../../core/components/Input";
import show from "../../../assets/show.svg";
import notShow from "../../../assets/notShow.svg";

export default function PasswordInput({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type={showPassword ? "text" : "password"}
        className={`pr-10 w-full`} // padding-right para el botón
        {...rest}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute inset-y-0 right-2 flex items-center justify-center p-1 focus:outline-none"
      >
        <img
          src={showPassword ? show : notShow}
          alt={showPassword ? "Mostrar contraseña" : "Ocultar contraseña"}
          className="w-5 h-5 text-gray-600"
        />
      </button>
    </div>
  );
}
